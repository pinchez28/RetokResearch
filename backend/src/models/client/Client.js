import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    name: { type: String, required: true },
    phone: String,
    company: String,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    role: { type: String, default: 'client' },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

export default Client;
