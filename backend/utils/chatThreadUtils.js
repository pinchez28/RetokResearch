// utils/chatThreadUtils.js
import ChatThread from '../src/models/chat/ChatThread.js';
import User from '../src/models/auth/User.js';

/* =======================================================
   CREATE OR UPDATE CHAT THREAD ON HIRE CONFIRMATION
   Ensures client, expert, and admin are part of the thread
======================================================= */
export const createChatThreadOnHireConfirm = async ({
  jobId,
  clientUserId,
  expertUserId,
  adminUserId = null, // optional, will default to first Admin
}) => {
  // ------------------------------
  // Ensure we have an admin user for moderation
  // ------------------------------
  if (!adminUserId) {
    const defaultAdmin = await User.findOne({ role: 'Admin' }).lean();
    if (defaultAdmin) adminUserId = defaultAdmin._id;
  }

  // ------------------------------
  // Check if a chat thread already exists for this job
  // ------------------------------
  let thread = await ChatThread.findOne({ job: jobId });

  if (thread) {
    // Update allowed users if thread already exists
    const updatedAllowed = new Set(
      (thread.allowedUserIds || []).map((id) => id.toString()),
    );

    [clientUserId, expertUserId, adminUserId]
      .filter(Boolean)
      .forEach((id) => updatedAllowed.add(id.toString()));

    thread.allowedUserIds = Array.from(updatedAllowed);
    thread.clientUser = clientUserId;
    thread.expertUser = expertUserId;
    if (adminUserId) thread.adminUser = adminUserId;

    await thread.save();
    return thread;
  }

  // ------------------------------
  // Create a new chat thread
  // ------------------------------
  thread = new ChatThread({
    job: jobId,
    clientUser: clientUserId,
    expertUser: expertUserId,
    adminUser: adminUserId || undefined,
    allowedUserIds: [
      clientUserId,
      expertUserId,
      ...(adminUserId ? [adminUserId] : []),
    ],
    messages: [],
  });

  await thread.save();
  return thread;
};

/* =======================================================
   ADD A USER TO EXISTING CHAT THREAD
======================================================= */
export const addUserToChatThread = async ({ chatThreadId, userId }) => {
  const thread = await ChatThread.findById(chatThreadId);
  if (!thread) throw new Error('Chat thread not found');

  const allowedSet = new Set(
    (thread.allowedUserIds || []).map((id) => id.toString()),
  );
  allowedSet.add(userId.toString());
  thread.allowedUserIds = Array.from(allowedSet);

  await thread.save();
  return thread;
};

/* =======================================================
   REMOVE A USER FROM CHAT THREAD
======================================================= */
export const removeUserFromChatThread = async ({ chatThreadId, userId }) => {
  const thread = await ChatThread.findById(chatThreadId);
  if (!thread) throw new Error('Chat thread not found');

  thread.allowedUserIds = (thread.allowedUserIds || []).filter(
    (id) => id.toString() !== userId.toString(),
  );

  await thread.save();
  return thread;
};

/* =======================================================
   GET CHAT THREAD FOR A JOB
======================================================= */
export const getChatThreadByJob = async (jobId) => {
  const thread = await ChatThread.findOne({ job: jobId });
  return thread;
};
