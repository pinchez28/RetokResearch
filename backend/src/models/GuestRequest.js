import mongoose from 'mongoose';

const guestRequestSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String },
    deadline: { type: String },
    proposedPrice: { type: String },
    service: { type: String },
    status: {
      type: String,
      default: 'New',
      enum: ['New', 'Seen', 'In Progress', 'Completed'],
    },
  },
  { timestamps: true }
);

// ⭐ NEW: Indexes for faster admin queries
guestRequestSchema.index({ status: 1 });
guestRequestSchema.index({ createdAt: -1 });

export default mongoose.model('GuestRequest', guestRequestSchema);
