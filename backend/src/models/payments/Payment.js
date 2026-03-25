import mongoose from 'mongoose';

const { Schema } = mongoose;

/* ============================================================
   🔁 STATUS STATE MACHINE RULES
============================================================ */

const allowedTransitions = {
  pending: ['confirmed', 'failed', 'cancelled', 'timeout'],
  failed: ['pending'], // retry allowed
  timeout: ['pending'], // retry allowed
  cancelled: [], // user cancelled → no retry
  confirmed: [], // final state
};

/* ============================================================
   PAYMENT SCHEMA
============================================================ */

const paymentSchema = new Schema(
  {
    /* ========================================================
       🔑 PAYMENT REFERENCE
    ======================================================== */
    reference: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
    },

    /* ========================================================
       🔥 PAYMENT TYPE
    ======================================================== */
    type: {
      type: String,
      enum: ['PROJECT_PAYMENT', 'EXPERT_SUBSCRIPTION'],
      required: true,
      index: true,
      immutable: true,
    },

    /* ========================================================
       🔗 OWNERSHIP
    ======================================================== */

    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      index: true,
    },

    expert: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
      index: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: 'ClientProject',
      index: true,
    },

    /* ========================================================
       💰 MONEY
    ======================================================== */

    amount: {
      type: Number,
      required: true,
      min: 1,
      immutable: true,
    },

    currency: {
      type: String,
      default: 'KES',
      immutable: true,
    },

    /* ========================================================
       💳 PAYMENT METHOD
    ======================================================== */

    method: {
      type: String,
      enum: ['MPESA_STK', 'PAYBILL'],
      default: 'MPESA_STK',
      immutable: true,
    },

    /* ========================================================
       📊 PAYMENT STATUS
    ======================================================== */

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'cancelled', 'timeout'],
      default: 'pending',
      index: true,
    },

    /* ========================================================
       🔁 RETRY TRACKING (NEW)
    ======================================================== */

    retryCount: {
      type: Number,
      default: 0,
    },

    lastRetryAt: Date,

    maxRetries: {
      type: Number,
      default: 3,
      immutable: true,
    },

    /* ========================================================
       📱 M-PESA STK DETAILS
    ======================================================== */

    mpesa: {
      phone: {
        type: String,
        required: true,
      },

      merchantRequestId: {
        type: String,
        index: true,
      },

      checkoutRequestId: {
        type: String,
        index: true,
      },

      receiptNumber: {
        type: String,
      },

      transactionDate: Date,

      resultCode: Number,
      resultDesc: String,

      callbackMetadata: Schema.Types.Mixed,
    },

    /* ========================================================
       ⭐ EXPERT SUBSCRIPTION DATA
    ======================================================== */

    subscription: {
      durationDays: {
        type: Number,
        default: 30,
      },
      expiresAt: Date,
    },

    /* ========================================================
       🧠 AUDIT TIMELINE
    ======================================================== */

    initiatedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    confirmedAt: Date,
    failedAt: Date,
    cancelledAt: Date,
    timeoutAt: Date,
  },
  {
    timestamps: true,
  },
);

/* ============================================================
   🔒 INDEXES
============================================================ */

paymentSchema.index(
  { project: 1, status: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: 'pending',
      type: 'PROJECT_PAYMENT',
    },
  },
);

paymentSchema.index(
  { expert: 1, status: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: 'pending',
      type: 'EXPERT_SUBSCRIPTION',
    },
  },
);

paymentSchema.index(
  { 'mpesa.checkoutRequestId': 1 },
  { unique: true, sparse: true },
);

paymentSchema.index(
  { 'mpesa.receiptNumber': 1 },
  { unique: true, sparse: true },
);

paymentSchema.index(
  { project: 1, status: 1 },
  { partialFilterExpression: { status: 'pending' } },
);

/* ============================================================
   🔐 DATA VALIDATION
============================================================ */

paymentSchema.pre('validate', function (next) {
  if (this.type === 'PROJECT_PAYMENT') {
    if (!this.client || !this.project) {
      return next(new Error('PROJECT_PAYMENT requires client and project'));
    }
  }

  if (this.type === 'EXPERT_SUBSCRIPTION') {
    if (!this.expert) {
      return next(new Error('EXPERT_SUBSCRIPTION requires expert'));
    }
  }

  next();
});

/* ============================================================
   🔄 STATE MACHINE ENFORCEMENT (NEW)
============================================================ */

paymentSchema.pre('save', function (next) {
  if (!this.isModified('status')) return next();

  const prevStatus = this.get('status', null, { getters: false });
  const currentStatus = this.status;

  // If document is new, allow
  if (this.isNew) return next();

  const allowed = allowedTransitions[prevStatus] || [];

  if (!allowed.includes(currentStatus)) {
    return next(
      new Error(`Invalid status transition: ${prevStatus} → ${currentStatus}`),
    );
  }

  next();
});

/* ============================================================
   🔁 AUTO RETRY HANDLER (HELPER METHOD)
============================================================ */

paymentSchema.methods.canRetry = function () {
  return (
    ['failed', 'timeout'].includes(this.status) &&
    this.retryCount < this.maxRetries
  );
};

paymentSchema.methods.markRetry = function () {
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  this.status = 'pending';
};

/* ============================================================
   🔑 GENERATE PAYMENT REFERENCE
============================================================ */

paymentSchema.pre('save', function (next) {
  if (!this.reference) {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.reference = `PAY-${rand}`;
  }

  next();
});

/* ============================================================
   MODEL EXPORT
============================================================ */

export default mongoose.model('Payment', paymentSchema);
