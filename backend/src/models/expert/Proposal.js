import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalText: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Proposal', proposalSchema);
