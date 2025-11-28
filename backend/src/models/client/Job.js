import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  coverLetter: { type: String, required: true },
  quote: { type: Number, required: true },
  appliedAt: { type: Date, default: Date.now },
});

const jobSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  skillsRequired: [{ type: String, required: true }],
  attachments: [{ type: String }],
  deadline: { type: Date },

  // Pricing set by admin
  pricingRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  // Job status
  status: {
    type: String,
    enum: [
      'pending_admin_review',
      'admin_rejected',
      'approved_for_bidding',
      'assigned',
      'in_progress',
      'completed',
    ],
    default: 'pending_admin_review',
  },

  // Experts selected by admin
  approvedExperts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert' }],

  // Expert applications
  applications: [applicationSchema],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Job', jobSchema);
