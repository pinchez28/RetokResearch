import mongoose from 'mongoose';

const TopRatedExpertSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    position: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      unique: true, // enforce unique position across docs
    },
    meta: {
      name: String,
      avatarUrl: String,
      rating: Number,
    },
  },
  { timestamps: true }
);

// Ensure unique position 1..5
TopRatedExpertSchema.index({ position: 1 }, { unique: true });

const TopRatedExpert = mongoose.model('TopRatedExpert', TopRatedExpertSchema);

export default TopRatedExpert;
