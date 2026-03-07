import mongoose from 'mongoose';

const emailTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const EmailToken = mongoose.model('EmailToken', emailTokenSchema);

export default EmailToken;
