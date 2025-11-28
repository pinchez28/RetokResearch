// backend/src/models/Notification.js

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType',
    required: false,
  },
  userType: {
    type: String,
    enum: ['admin', 'client', 'expert'],
    required: true,
  },

  title: { type: String, required: true },
  message: { type: String, required: true },

  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: false },

  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
