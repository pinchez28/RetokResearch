import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    role: { type: String, default: 'Admin' }, // optional
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
