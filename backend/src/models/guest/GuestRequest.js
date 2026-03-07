import mongoose from 'mongoose';

const GuestRequestSchema = new mongoose.Schema(
  {
    // ======================================================
    // 1. GUEST INFORMATION
    // ======================================================
    guest: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, trim: true },
    },

    topic: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },

    // ======================================================
    // 2. SERVICE CONFIGURATION (SET BY ADMIN)
    // ======================================================
    serviceType: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          // allow empty/null values
          if (!v) return true;
          return [
            'Research Paper',
            'Essay Writing',
            'Thesis',
            'Dissertation',
            'Proposal',
            'Editing',
          ].includes(v);
        },
        message: (props) => `${props.value} is not a valid service type`,
      },
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: 'KES',
    },

    // ======================================================
    // 3. WORKFLOW STATUS ENGINE
    // ======================================================
    status: {
      type: String,
      enum: [
        'new', // Guest submitted
        'acknowledged', // Admin has reviewed
        'full_request',
        'assigned', // Expert assigned
        'in_progress', // Expert working
        'submitted', // Expert submitted to admin
        'ready_for_delivery', // Admin approved
        'completed', // Sent to guest
        'cancelled',
      ],
      default: 'new',
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ======================================================
    // 4. EXPERT RELATION
    // ======================================================
    assignedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      default: null,
    },

    expertAcceptedAt: Date,
    workStartedAt: Date,
    workSubmittedAt: Date,

    // ======================================================
    // 5. FILE MANAGEMENT
    // ======================================================
    files: {
      initialUploads: [
        {
          url: String,
          fileName: String,
          uploadedAt: { type: Date, default: Date.now },
        },
      ],

      expertSubmission: {
        url: String,
        fileName: String,
        submittedAt: Date,
      },

      finalDelivery: {
        url: String,
        fileName: String,
        deliveredAt: Date,
      },
    },

    // ======================================================
    // 6. PAYMENT CONTROL
    // ======================================================
    payment: {
      requiredAmount: { type: Number, default: 0 },
      paid: { type: Boolean, default: false },
      paidAt: Date,
      transactionReference: String,
    },

    // ======================================================
    // 7. COMMUNICATION LOG (AUDIT TRAIL)
    // ======================================================
    timeline: [
      {
        actor: {
          type: String,
          enum: ['guest', 'admin', 'expert', 'system'],
        },
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ======================================================
    // 8. INTERNAL ADMIN NOTES
    // ======================================================
    internalNotes: [
      {
        note: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('GuestRequest', GuestRequestSchema);
