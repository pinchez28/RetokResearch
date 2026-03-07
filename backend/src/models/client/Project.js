import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
