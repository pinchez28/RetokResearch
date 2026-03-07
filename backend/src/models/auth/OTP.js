import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true }, // hashed OTP
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    type: { type: String, enum: ['phone', 'email'], required: true },
  },
  { timestamps: true },
);

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
