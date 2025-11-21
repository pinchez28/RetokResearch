import mongoose from 'mongoose';

const guestSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'completed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const GuestSubmission = mongoose.model(
  'GuestSubmission',
  guestSubmissionSchema
);

export default GuestSubmission;
