import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalText: { type: String, required: true },
  quote: { type: Number, default: 0 },
  cvUrl: { type: String }, // optional CV
  submittedAt: { type: Date, default: Date.now },
  expertSnapshot: {
    // store a snapshot of the expert profile at submission
    name: { type: String },
    phone: { type: String },
    photo: { type: String },
    specialization: { type: String },
    bio: { type: String },
    experience: { type: String },
    education: { type: String },
    certifications: { type: Array, default: [] },
    portfolio: { type: Array, default: [] },
    rating: { type: Number, default: 0 },
  },
});

export default mongoose.model('Proposal', proposalSchema);
