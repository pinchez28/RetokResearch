// backend/models/Service.js
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    branch: { type: String, required: true },
    category: { type: String, required: true },
    shortDescription: { type: String },
    fullDescription: { type: String },
    priceRange: { type: String },
    featured: { type: Boolean, default: false },
    includes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Service', ServiceSchema);
