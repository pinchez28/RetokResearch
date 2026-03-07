import ChatThread from '../src/models/chat/ChatThread.js';

/**
 * Ensure a chat thread exists for a job
 * - Idempotent
 * - Race-condition safe
 * - Enforces role invariants
 * - Admin is REQUIRED
 */
export const ensureChatThread = async ({
  jobId,
  clientUserId,
  expertUserId,
  adminUserId,
}) => {
  if (!jobId || !clientUserId || !expertUserId || !adminUserId) {
    throw new Error('Missing required parameters for ensureChatThread');
  }

  // Prevent role collisions
  const ids = [
    clientUserId.toString(),
    expertUserId.toString(),
    adminUserId.toString(),
  ];

  if (new Set(ids).size !== 3) {
    throw new Error('Client, expert, and admin must be distinct users');
  }

  try {
    // Atomic upsert (race-safe)
    const thread = await ChatThread.findOneAndUpdate(
      { job: jobId },
      {
        $setOnInsert: {
          job: jobId,
          clientUser: clientUserId,
          expertUser: expertUserId,
          adminUser: adminUserId,
          allowedUserIds: [clientUserId, expertUserId, adminUserId],
          messages: [],
          isLocked: false,
          isArchived: false,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return thread;
  } catch (err) {
    // Handle duplicate key edge case explicitly
    if (err.code === 11000) {
      return ChatThread.findOne({ job: jobId });
    }
    throw err;
  }
};
