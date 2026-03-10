import mongoose from 'mongoose';

const emailTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto delete when expired
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const EmailToken = mongoose.model('EmailToken', emailTokenSchema);

export default EmailToken;
