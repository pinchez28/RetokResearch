import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    // Personal info
    name: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String },

    // Professional info
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String, required: true },
    certifications: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

    // CV for proposals
    cvPdf: { type: String },

    // Link to the auth User
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Account status
    status: {
      type: String,
      enum: ['pending_admin_review', 'approved', 'rejected'],
      default: 'pending_admin_review',
    },
    rejectionReason: { type: String, default: null },

    // Pending updates requiring admin review
    pendingUpdates: {
      bio: { type: String },
      specialization: { type: String },
      certifications: [{ type: String }],
      education: { type: String },
      experience: { type: Number },
      cvPdf: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

// Index for faster queries by status
expertSchema.index({ status: 1 });

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
