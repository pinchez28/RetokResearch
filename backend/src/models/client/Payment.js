import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // 🔗 Ownership
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientProject',
      required: true,
      index: true,
    },

    // 💰 Money
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: 'KES',
      immutable: true,
    },

    // 💳 Payment method
    method: {
      type: String,
      enum: ['MPESA_STK'],
      default: 'MPESA_STK',
      immutable: true,
    },

    // 📊 Payment lifecycle
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'cancelled', 'timeout'],
      default: 'pending',
      index: true,
    },

    // 📱 M-Pesa STK data
    mpesa: {
      phone: { type: String, required: true },
      merchantRequestId: { type: String },
      checkoutRequestId: { type: String },
      receiptNumber: { type: String },
      resultCode: Number,
      resultDesc: String,
      callbackMetadata: Object,
    },

    // 🧠 Audit timestamps
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

/**
 * 🔐 CRITICAL SAFETY INDEX
 * Only ONE pending payment per project
 */
paymentSchema.index(
  { project: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending' },
  },
);

/**
 * 🔒 Prevent duplicate STK sessions
 */
paymentSchema.index(
  { 'mpesa.checkoutRequestId': 1 },
  { unique: true, sparse: true },
);

/**
 * 🔒 Prevent duplicate M-Pesa receipt numbers
 */
paymentSchema.index(
  { 'mpesa.receiptNumber': 1 },
  { unique: true, sparse: true },
);

export default mongoose.model('Payment', paymentSchema);
