import mongoose from 'mongoose';

const ExpertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '/img/default-avatar.png',
    },
    rating: {
      type: Number,
      default: 0,
    },
    // Add any other fields you need for your Expert collection
  },
  { timestamps: true }
);

const Expert = mongoose.model('Expert', ExpertSchema);

export default Expert;
