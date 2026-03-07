// models/Proposal.js
import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    // ---------------- Core Relations ----------------
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert', // reference Expert model, not generic User
      required: true,
      index: true,
    },

    // ---------------- Proposal Content ----------------
    proposalText: {
      type: String,
      required: true,
      minlength: 30,
    },
    quote: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDeliveryDays: {
      type: Number,
      min: 1,
    },
    cvUrl: {
      type: String,
    },
    attachments: [
      {
        name: String,
        url: String,
      },
    ],

    // ---------------- Status & Lifecycle ----------------
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
      index: true,
    },
    isShortlisted: {
      type: Boolean,
      default: false,
    },

    // ---------------- Expert Snapshot (Historical) ----------------
    expertSnapshot: {
      name: String,
      photo: String,
      specialization: String,
      bio: String,
      experience: String,
      education: String,
      certifications: { type: [String], default: [] },
      portfolio: { type: [String], default: [] },
      rating: { type: Number, default: 0 },
    },

    // ---------------- Admin & Audit ----------------
    adminNotes: {
      type: String,
    },
    reviewedByAdmin: {
      type: Boolean,
      default: false,
    },

    // ---------------- Messaging Control ----------------
    messageFlowAllowed: {
      type: Boolean,
      default: false, // admin controls messaging between client & expert
    },
    adminMessage: {
      type: String, // reason if rejected or messages blocked
      default: null,
    },

    // ---------------- Timing ----------------
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ---------------- Constraints ----------------
// ONE expert per job — enforces uniqueness at DB level
proposalSchema.index({ job: 1, expert: 1 }, { unique: true });

// ---------------- Optimize queries ----------------
proposalSchema.index({ job: 1, status: 1 });
proposalSchema.index({ expert: 1, status: 1 });

export default mongoose.model('Proposal', proposalSchema);
