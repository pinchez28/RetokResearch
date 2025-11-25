// src/models/ContactMessage.js
import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Visitor's name
    email: { type: String, required: true }, // Visitor's email
    message: { type: String, required: true }, // The message content
    status: {
      type: String,
      enum: ['New', 'Seen', 'Responded'],
      default: 'New',
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Index for fast admin queries
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
