import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    /* =====================================================
       RELATIONSHIPS
    ===================================================== */
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },

    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert', // references Expert._id
      required: true,
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client', // references Client._id
      required: true,
      index: true,
    },

    /* =====================================================
       SNAPSHOT (IMMUTABLE JOB DATA)
       Stored at assignment time for consistency
    ===================================================== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    /* =====================================================
       WORKFLOW / STATUS
    ===================================================== */
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'ready', 'completed'],
      default: 'assigned',
      index: true,
    },

    startedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    /* =====================================================
       COMMERCIAL / TERMS
    ===================================================== */
    budget: {
      type: Number,
      min: 0,
      default: 0,
    },

    deliveryTime: {
      type: String, // e.g. "3 days", "1 week"
      trim: true,
    },

    /* =====================================================
       CHAT
    ===================================================== */
    chatThreadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatThread',
    },

    /* =====================================================
       META
    ===================================================== */
    role: {
      type: String,
      default: 'primary_expert',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('ExpertAssignment', assignmentSchema);
