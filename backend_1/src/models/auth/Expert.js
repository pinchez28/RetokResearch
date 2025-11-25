import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    photo: { type: String, required: true },
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String, required: true },
    certifications: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Expert', expertSchema);
