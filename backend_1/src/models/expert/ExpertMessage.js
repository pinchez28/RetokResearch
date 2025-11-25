import mongoose from 'mongoose';

const expertMessageSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    service: { type: String },
  },
  { timestamps: true }
);

const ExpertMessage = mongoose.model('ExpertMessage', expertMessageSchema);

export default ExpertMessage;
