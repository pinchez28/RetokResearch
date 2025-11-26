import mongoose from 'mongoose';

const GuestRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: String },
    proposedPrice: { type: String },
    service: { type: String, default: 'Quick Request' }, // default if not provided
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model('GuestRequest', GuestRequestSchema);
