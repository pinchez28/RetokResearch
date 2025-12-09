import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String, required: false },
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String, required: true },
    certifications: [{ type: String }],
    portfolio: [String],
    skills: [{ type: String }], // <-- Add this
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    cvPdf: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending_admin_review', 'approved', 'rejected'],
      default: 'pending_admin_review',
    },
  },
  { timestamps: true }
);

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
