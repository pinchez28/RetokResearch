import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // optional for global notifications
  },
  userType: {
    type: String,
    enum: ['Admin', 'Client', 'Expert'], // capitalized roles
    required: false, // null = global
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: false },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
