// src/models/guest/guestMessage.js
import mongoose from 'mongoose';

const guestMessageSchema = new mongoose.Schema(
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
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: true, // now matches the frontend
    },

    reply: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['pending', 'replied', 'closed'],
      default: 'pending',
    },

    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

const GuestMessage = mongoose.model('GuestMessage', guestMessageSchema);

export default GuestMessage;
