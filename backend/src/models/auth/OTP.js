import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true, // hashed OTP
    },

    purpose: {
      type: String,
      enum: [
        'email_verification',
        'phone_verification',
        'password_reset',
        'login_verification',
      ],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto delete expired OTPs
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
