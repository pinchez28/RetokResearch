import ChatThread from '../models/chat/ChatThread.js';

export const registerChatSocket = (io, socket) => {
  /**
   * ==============================
   * JOIN THREAD
   * ==============================
   */
  socket.on('join-thread', async ({ threadId }) => {
    try {
      const userId = socket.user?._id?.toString();

      if (!userId) {
        return socket.emit('chat-error', 'Unauthenticated');
      }

      const thread = await ChatThread.findById(threadId).select(
        'clientUser expertUser adminUser',
      );

      if (!thread) {
        return socket.emit('chat-error', 'Chat thread not found');
      }

      const allowedUserIds = [
        thread.clientUser?.toString(),
        thread.expertUser?.toString(),
        thread.adminUser?.toString(),
      ].filter(Boolean);

      const hasAccess = allowedUserIds.includes(userId);

      if (!hasAccess) {
        return socket.emit('chat-error', 'Forbidden');
      }

      socket.join(`thread:${threadId}`);

      socket.emit('joined-thread', { threadId });
    } catch (err) {
      console.error('🔥 Socket join-thread error:', err);
      socket.emit('chat-error', 'Failed to join chat');
    }
  });

  /**
   * ==============================
   * LEAVE THREAD (CLEAN)
   * ==============================
   */
  socket.on('leave-thread', ({ threadId }) => {
    socket.leave(`thread:${threadId}`);
  });
};
