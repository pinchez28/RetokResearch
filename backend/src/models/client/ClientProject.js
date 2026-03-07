import mongoose from 'mongoose';

const clientProjectSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      unique: true, // 🔒 one project per job
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },

    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExpertAssignment',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'assigned',
        'in_progress',
        'ready',
        'downloaded',
        'in_review',
        'appealed_for_revision',
        'completed',
      ],
      default: 'assigned',
      index: true,
    },

    paymentConfirmed: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    readyAt: { type: Date, default: null },
    downloadedAt: { type: Date, default: null },
    revisionRequestedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },

    // 🔒 BACKEND CONTROLLED: final cost client must pay
    finalCost: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/* ============================
   VIRTUALS
============================ */

// Can client download the final work?
clientProjectSchema.virtual('canClientDownload').get(function () {
  return (
    this.paymentConfirmed &&
    this.isPaid &&
    this.status === 'ready' &&
    !this.downloadedAt
  );
});

// Is the project currently active (in progress or waiting)?
clientProjectSchema.virtual('isActive').get(function () {
  return [
    'assigned',
    'in_progress',
    'ready',
    'in_review',
    'appealed_for_revision',
  ].includes(this.status);
});

// Has the project been fully completed?
clientProjectSchema.virtual('isCompleted').get(function () {
  return this.status === 'completed' && !!this.completedAt;
});

// Has the project been delivered to client (downloaded)?
clientProjectSchema.virtual('isDelivered').get(function () {
  return !!this.downloadedAt;
});

export default mongoose.model('ClientProject', clientProjectSchema);
