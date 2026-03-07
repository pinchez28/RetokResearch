import mongoose from 'mongoose';

/* ============================
   Expert Application Subdocument
============================ */
const applicationSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert', // ✅ always Expert._id
      required: true,
      index: true,
    },

    proposalText: { type: String, required: true, minlength: 30 },
    quote: { type: Number, required: true, min: 1 },
    cvUrl: { type: String },
    attachments: [{ name: String, url: String }],

    // 🔒 REQUIRED (you already rely on it when hiring)
    estimatedDeliveryDays: {
      type: Number,
      min: 1,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'pending_confirmation',
        'accepted',
        'rejected',
        'withdrawn',
      ],
      default: 'pending',
    },

    isShortlisted: { type: Boolean, default: false },

    expertSnapshot: {
      expertId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Expert._id
      name: String,
      photo: String,
      cvPdf: { type: String, default: null },
      specialization: String,
      experience: { type: Number },
      education: String,
      certifications: [{ type: String }],
      bio: String,
      rating: { type: Number, default: 0 },
    },

    adminNotes: String,
    reviewedByAdmin: { type: Boolean, default: false },
    messageFlowAllowed: { type: Boolean, default: false },
    adminMessage: String,
    rejectionReason: { type: String, default: null },

    submittedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date, default: null },
  },
  { _id: true },
);

/* ❗ Prevent same expert applying twice to same job */
applicationSchema.index({ expert: 1 }, { unique: true });

/* ============================
   Job Schema
============================ */
const jobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true },

    pricingRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },

    branch: {
      type: String,
      enum: ['Academic Research', 'Industrial Research', null],
      default: null,
    },

    category: { type: String, default: null },

    status: {
      type: String,
      enum: [
        'pending_admin_review',
        'admin_rejected',
        'approved_for_bidding',
        'assigned',
        'in_progress',
        'ready',
        'downloaded',
        'in_review',
        'appealed_for_revision',
        'completed',
      ],
      default: 'pending_admin_review',
      index: true,
    },

    rejectionReason: { type: String, default: null },
    rejectedAt: { type: Date, default: null },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: { type: Date, default: null },
    resubmittedAt: { type: Date, default: null },

    applications: { type: [applicationSchema], default: [] },

    /* ============================
       Hiring / Assignment
    ============================ */
    hiredExpertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert', // ✅ Expert._id
      default: null,
      index: true,
    },

    hiredApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    finalCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    assignedAt: { type: Date, default: null },
    startedAt: { type: Date, default: null },

    finalWorkUrl: { type: String, default: null },

    deliveredWorkAttachments: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    downloadedAt: { type: Date, default: null },
    revisionRequestedAt: { type: Date, default: null },
    paymentConfirmed: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/* ============================
   🔒 INVARIANT ENFORCEMENT
============================ */
jobSchema.pre('save', function (next) {
  const activeStates = [
    'assigned',
    'in_progress',
    'downloaded',
    'in_review',
    'appealed_for_revision',
  ];

  if (activeStates.includes(this.status)) {
    if (!this.hiredExpertId) {
      return next(new Error('Active job must have hiredExpertId'));
    }

    if (!this.hiredApplicationId) {
      return next(new Error('Active job must have hiredApplicationId'));
    }

    const hiredApp = this.applications.id(this.hiredApplicationId);
    if (!hiredApp) {
      return next(
        new Error('hiredApplicationId does not exist in applications'),
      );
    }

    if (hiredApp.status !== 'accepted') {
      return next(new Error('Hired application must be accepted'));
    }
  }

  next();
});

/* ============================
   DOMAIN METHODS
============================ */
jobSchema.methods.acceptApplication = function (applicationId) {
  const app = this.applications.id(applicationId);
  if (!app) throw new Error('Application not found');

  this.applications.forEach((a) => {
    if (a._id.equals(applicationId)) {
      a.status = 'accepted';
      a.messageFlowAllowed = true;
      a.respondedAt = new Date();

      // 🔒 LOCK PRICE
      this.finalCost = a.quote;
      this.hiredExpertId = a.expert;
    } else {
      a.status = 'rejected';
      a.messageFlowAllowed = false;
    }
  });

  this.hiredApplicationId = applicationId;
};

/* ============================
   Virtuals
============================ */
jobSchema.virtual('canBid').get(function () {
  return this.status === 'approved_for_bidding' && !this.hiredExpertId;
});

jobSchema.virtual('isActiveAssignment').get(function () {
  const activeStates = [
    'assigned',
    'in_progress',
    'downloaded',
    'in_review',
    'appealed_for_revision',
  ];
  return activeStates.includes(this.status);
});

jobSchema.virtual('canComplete').get(function () {
  if (!this.downloadedAt || this.revisionRequestedAt) return false;
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  return Date.now() - this.downloadedAt.getTime() >= twoDays;
});

jobSchema.virtual('canClientDownload').get(function () {
  // 1. Must be paid
  const isPaid = this.paymentConfirmed === true;

  // 2. Work must actually exist (check if string is not empty)
  const hasWork = !!this.finalWorkUrl && this.finalWorkUrl.length > 0;

  // 3. Status check (Optional: ensures job is in a 'ready' or 'completed' state)
  const isReady = ['ready', 'downloaded', 'completed'].includes(this.status);

  return isPaid && hasWork && isReady;
});

jobSchema.virtual('hiredExpert', {
  ref: 'Expert',
  localField: 'hiredExpertId',
  foreignField: '_id',
  justOne: true,
});

export default mongoose.model('Job', jobSchema);
