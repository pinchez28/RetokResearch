import mongoose from 'mongoose';

/* =====================================================
   MESSAGE SCHEMA
===================================================== */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🔑 Explicit sender role (immutable audit data)
    senderRole: {
      type: String,
      enum: ['client', 'expert', 'admin'],
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // moderation state
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    // soft delete (audit-safe)
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // was this message moderated by an admin?
    moderatedByAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },

    // read receipts (3-participant room)
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

/* =====================================================
   CHAT THREAD SCHEMA
===================================================== */
const chatThreadSchema = new mongoose.Schema(
  {
    // One chat per job (intentional invariant)
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      unique: true,
      index: true,
    },

    // Explicit authority owners (DO NOT REMOVE)
    clientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    expertUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // 🔐 Security gate — MUST include client, expert, admin
    allowedUserIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: true,
      validate: {
        validator: function (v) {
          if (!Array.isArray(v)) return false;
          const ids = v.map((id) => id.toString());
          return (
            ids.includes(this.clientUser.toString()) &&
            ids.includes(this.expertUser.toString()) &&
            ids.includes(this.adminUser.toString())
          );
        },
        message:
          'allowedUserIds must include clientUser, expertUser, and adminUser',
      },
      index: true,
    },

    // Embedded messages (bounded, moderated)
    messages: {
      type: [messageSchema],
      default: [],
    },

    // Updated ONLY when a new message is added
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // moderation & lifecycle controls
    isLocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

/* =====================================================
   HOOKS
===================================================== */

// Update lastMessageAt ONLY when a new message is appended
chatThreadSchema.pre('save', function (next) {
  if (this.isModified('messages') && this.messages.length) {
    const lastMessage = this.messages[this.messages.length - 1];
    this.lastMessageAt = lastMessage.createdAt || new Date();
  }
  next();
});

export default mongoose.model('ChatThread', chatThreadSchema);
