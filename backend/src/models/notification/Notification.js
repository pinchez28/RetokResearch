import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    /* =====================================================
       TARGET (WHO RECEIVES IT)
    ===================================================== */

    // Specific user (null = role-based or global)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // Who should see this notification
    userType: {
      type: String,
      enum: ['Admin', 'Client', 'Expert', 'Global'],
      default: 'Global',
      index: true,
    },

    /* =====================================================
       CONTENT
    ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Optional short label for UI badges
     * Example: "Job Update", "Payment", "System"
     */
    label: {
      type: String,
      default: null,
    },

    /* =====================================================
       CLASSIFICATION (SAFE ENUMS ONLY)
    ===================================================== */

    /**
     * High-level grouping (SAFE ENUM)
     * DO NOT put actions here
     */
    category: {
      type: String,
      enum: [
        'Job',
        'Application',
        'Payment',
        'Message',
        'Account',
        'System',
        'General',
      ],
      default: 'General',
      index: true,
    },

    /**
     * Low-level action (FREE STRING)
     * Examples:
     *  - job_created
     *  - job_assigned
     *  - application_accepted
     *  - milestone_released
     *  - payout_completed
     */
    action: {
      type: String,
      default: null,
      index: true,
    },

    /* =====================================================
       REFERENCES (OPTIONAL BUT POWERFUL)
    ===================================================== */

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
      index: true,
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    messageThreadId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    /* =====================================================
       DELIVERY & STATE
    ===================================================== */

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
       SOFT DELETE & LIFECYCLE
    ===================================================== */

    archived: {
      type: Boolean,
      default: false,
      index: true,
    },

    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    /* =====================================================
       METADATA (SAFE EXTENSION ZONE)
    ===================================================== */

    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* =====================================================
   INDEXES (PERFORMANCE CRITICAL)
===================================================== */

// Main inbox fetch
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Role-based/global notifications
notificationSchema.index({ userType: 1, createdAt: -1 });

// Category filters
notificationSchema.index({ category: 1, createdAt: -1 });

// Expiration cleanup
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent accidental spam (non-unique)
notificationSchema.index({ userId: 1, action: 1, jobId: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
