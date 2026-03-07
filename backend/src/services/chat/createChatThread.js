import ChatThread from '../../models/chat/ChatThread.js';
import Job from '../../models/client/Job.js';
import User from '../../models/auth/User.js';
import Expert from '../../models/expert/Expert.js';

/**
 * Create or ensure a chat thread after hire confirmation
 *
 * DOMAIN RULES:
 * - Chat is created ONLY when job.status === 'in_progress'
 * - One chat thread per job
 * - Uses User._id for all participants
 * - Idempotent (safe to call multiple times)
 */
export const createChatThreadOnHireConfirm = async ({
  jobId,
  clientUserId,
  expertUserId,
  adminUserId = null,
}) => {
  if (!jobId || !clientUserId || !expertUserId) {
    throw new Error('Missing required parameters for chat creation');
  }

  const job = await Job.findById(jobId).select(
    '_id status hiredExpertId adminUser',
  );

  if (!job) {
    throw new Error('Job not found for chat creation');
  }

  // 🔒 Lifecycle enforcement
  if (job.status !== 'in_progress') {
    throw new Error('Chat thread can only be created when job is in progress');
  }

  // 🔒 Validate hired expert ownership
  if (!job.hiredExpertId) {
    throw new Error('Job has no hired expert for chat creation');
  }

  const expert = await Expert.findOne({ user: expertUserId }).select('_id');
  if (!expert) {
    throw new Error('Expert profile not found for chat creation');
  }

  if (expert._id.toString() !== job.hiredExpertId.toString()) {
    throw new Error('Expert does not match hired expert for this job');
  }

  // Resolve admin user (explicit > job.adminUser > system admin)
  if (!adminUserId) {
    adminUserId = job.adminUser;

    if (!adminUserId) {
      const adminUser = await User.findOne({ role: 'admin' }).select('_id');
      if (!adminUser) {
        throw new Error('Admin user not found for chat thread');
      }
      adminUserId = adminUser._id;
    }
  }

  // ✅ Store ObjectIds, not strings
  const allowedUserIds = [clientUserId, expertUserId, adminUserId].filter(
    Boolean,
  );

  const thread = await ChatThread.findOneAndUpdate(
    { job: jobId },
    {
      $setOnInsert: {
        job: jobId,
        clientUser: clientUserId,
        expertUser: expertUserId,
        adminUser: adminUserId,
        allowedUserIds,
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
};
