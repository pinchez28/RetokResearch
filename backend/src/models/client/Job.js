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

  // Client fields
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{ type: String }],
  deadline: { type: Date, required: true },

  // Client suggested price (optional)
  clientProposedPrice: { type: Number },

  // ADMIN-ONLY FINAL PRICE RANGE
  pricingRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  // ADMIN sets branch (optional for client)
  branch: {
    type: String,
    enum: ['Academic Research', 'Industrial Research', null],
    default: null,
  },

  // ADMIN sets category (depends on branch)
  category: { type: String, default: null },

  // ADMIN sets required skills
  skillsRequired: [{ type: String }],

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

  // Expert applications
  applications: [applicationSchema],

  assignedExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Job', jobSchema);
