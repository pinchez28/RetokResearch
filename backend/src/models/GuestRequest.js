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
    service: { type: String }, // optional: the service requested
    status: { type: String, default: 'New' }, // New, Seen, In Progress, Completed
  },
  { timestamps: true }
);

export default mongoose.model('GuestRequest', guestRequestSchema);
