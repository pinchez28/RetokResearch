import mongoose from 'mongoose';

const expertSubscriptionSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },

    phone: String,
    amount: Number,

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },

    checkoutRequestID: String,
    mpesaReceiptNumber: String,

    paidAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model('ExpertSubscription', expertSubscriptionSchema);
