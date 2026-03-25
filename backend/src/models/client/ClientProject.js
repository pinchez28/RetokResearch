import mongoose from 'mongoose';
import crypto from 'crypto';

const clientProjectSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      unique: true, // 🔒 one project per job
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },

    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExpertAssignment',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'assigned',
        'in_progress',
        'ready',
        'downloaded',
        'in_review',
        'appealed_for_revision',
        'completed',
      ],
      default: 'assigned',
      index: true,
    },

    /* ========================================
       PAYMENT FLAGS
    ======================================== */

    paymentConfirmed: { type: Boolean, default: false }, // MPESA confirmation
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    /* ========================================
       FINAL COST (ADMIN CONTROLLED)
    ======================================== */

    finalCost: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },

    /* ========================================
       PAYMENT SYSTEM (NEW)
    ======================================== */

    paymentMethod: {
      type: String,
      enum: ['mpesa_stk', 'paybill_manual'],
      default: 'paybill_manual', // default to manual unless client chooses STK
    },

    // Account number for manual paybill
    accountNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Unique payment reference for MPESA/STK
    paymentRef: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
    },

    // Client claims they have paid via paybill
    manualPaymentRequested: {
      type: Boolean,
      default: false,
    },

    // Admin unlocks project after verifying bank payment
    adminUnlocked: {
      type: Boolean,
      default: false,
    },

    /* ========================================
       TIMELINE
    ======================================== */

    readyAt: { type: Date, default: null },
    downloadedAt: { type: Date, default: null },
    revisionRequestedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/* ============================
   VIRTUALS
============================ */

// Can client download final work?
clientProjectSchema.virtual('canClientDownload').get(function () {
  return (
    this.status === 'ready' &&
    !this.downloadedAt &&
    ((this.paymentConfirmed && this.isPaid) || this.adminUnlocked === true)
  );
});

// Is project active
clientProjectSchema.virtual('isActive').get(function () {
  return [
    'assigned',
    'in_progress',
    'ready',
    'in_review',
    'appealed_for_revision',
  ].includes(this.status);
});

// Completed project
clientProjectSchema.virtual('isCompleted').get(function () {
  return this.status === 'completed' && !!this.completedAt;
});

// Delivered to client
clientProjectSchema.virtual('isDelivered').get(function () {
  return !!this.downloadedAt;
});

/* ============================
   AUTO GENERATE PAYBILL ACCOUNT
============================ */

clientProjectSchema.pre('save', function (next) {
  if (!this.accountNumber) {
    this.accountNumber = Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

export default mongoose.model('ClientProject', clientProjectSchema);
