const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const chatMessageDTO = (message, viewerRole, viewerId) => {
  if (!message || !viewerId) return null;

  const viewerIdStr = viewerId.toString();
  const isAdmin = viewerRole?.toLowerCase() === 'admin';

  // Normalize sender to always be an object
  let senderObj;
  if (typeof message.sender === 'string') {
    senderObj = {
      _id: message.sender,
      role: message.senderRole?.toLowerCase() || 'unknown',
      name: capitalize(message.senderRole) || 'Unknown',
    };
  } else {
    senderObj = {
      _id: message.sender._id || message.sender,
      role:
        message.senderRole?.toLowerCase() ||
        message.sender.role?.toLowerCase() ||
        'unknown',
      name: message.sender.name || capitalize(message.senderRole) || 'Unknown',
      email: message.sender.email || null,
    };
  }

  const senderIdStr = senderObj._id?.toString();

  const canView =
    isAdmin || senderIdStr === viewerIdStr || message.status === 'approved';

  if (!canView) return null;

  return {
    _id: message._id,
    sender: senderObj,
    content: message.content,
    status: message.status,
    rejectionReason:
      isAdmin || senderIdStr === viewerIdStr ? message.rejectionReason : null,
    moderatedByAdmin: Boolean(message.moderatedByAdmin),
    readBy: (message.readBy || []).map((r) => ({
      user: r.user?._id?.toString() || r.user?.toString(),
      readAt: r.readAt,
    })),
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};
