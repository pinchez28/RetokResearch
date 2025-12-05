import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String, required: true },
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String, required: true },
    certifications: [{ type: String }],
    portfolio: [String],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    cvPdf: { type: String }, // <-- new field
  },
  { timestamps: true }
);

export default mongoose.model('Expert', expertSchema);
