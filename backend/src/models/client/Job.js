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
  // CLIENT WHO POSTED THE JOB
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },

  // CLIENT FIELDS
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{ type: String }],
  deadline: { type: Date },

  // Client suggests the price (not a range)
  clientProposedPrice: { type: Number },

  // ADMIN-ONLY FINAL PRICE RANGE
  pricingRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  // ADMIN FIELDS
  category: { type: String, default: null },
  skillsRequired: [{ type: String }], // Admin decides skills

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

  approvedExperts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert' }],

  // EXPERT APPLICATIONS
  applications: [applicationSchema],

  // Assigned expert after admin decision
  assignedExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Job', jobSchema);
