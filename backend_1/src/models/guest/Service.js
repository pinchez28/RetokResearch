import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    branch: { type: String, required: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    priceRange: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add compound unique index: title + branch + category
serviceSchema.index({ title: 1, branch: 1, category: 1 }, { unique: true });

export default mongoose.model('Service', serviceSchema);
