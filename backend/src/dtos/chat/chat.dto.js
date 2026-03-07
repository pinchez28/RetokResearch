import { chatMessageDTO } from './chatMessageDTO.js';

/**
 * Transform a chat thread for API responses
 * @param {Object} thread - Mongoose ChatThread object
 * @param {String} role - current user role ('admin', 'client', 'expert')
 * @param {String|ObjectId} userId - current user id
 */
export const chatThreadDTO = (thread, role, userId) => {
  if (!thread || !userId) return null;

  const currentUserId = userId.toString();
  const viewerRole = role?.toLowerCase();

  /**
   * Role-aware participant projection
   */
  const participantInfo = (user) => {
    if (!user) return null;

    const userRole = user.role?.toLowerCase();
    const isSelf = user._id.toString() === currentUserId;

    // Admin sees everything
    if (viewerRole === 'admin') {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }

    // Viewer sees their own full info
    if (isSelf) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }

    // Everyone sees admin full info
    if (userRole === 'admin') {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }

    // Other participant — hide email
    return {
      _id: user._id,
      name: user.name,
      role: user.role,
    };
  };

  // Messages (visibility enforced inside chatMessageDTO)
  const messages = (thread.messages || [])
    .map((msg) => chatMessageDTO(msg, viewerRole, currentUserId))
    .filter(Boolean)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    threadId: thread._id,
    job: thread.job
      ? {
          _id: thread.job._id,
          title: thread.job.title,
          status: thread.job.status,
        }
      : null,
    participants: {
      client: participantInfo(thread.clientUser),
      expert: participantInfo(thread.expertUser),
      admin: participantInfo(thread.adminUser),
    },
    messages,
    isLocked: Boolean(thread.isLocked),
    isArchived: Boolean(thread.isArchived),
    lastMessageAt: thread.lastMessageAt,
  };
};
