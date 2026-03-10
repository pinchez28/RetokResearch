import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // make required to ensure every client links to a user
    },

    name: { type: String, required: true },
    phone: String,
    company: String,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    role: { type: String, default: 'Client' },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Optional: populate email from linked User
clientSchema.virtual('email', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'email' },
});

const Client = mongoose.model('Client', clientSchema);
export default Client;
