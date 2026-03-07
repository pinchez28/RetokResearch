// backend/models/guest/GuestServiceRequest.js
import mongoose from 'mongoose';

const GuestServiceRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    description: { type: String, required: true },
    deadline: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('GuestServiceRequest', GuestServiceRequestSchema);
