import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },

    details: {
      type: String,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', auditLogSchema);
