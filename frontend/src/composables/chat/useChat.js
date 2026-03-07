import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { chatApi } from '@/core/api/http';
import {
  getNotificationSocket,
  initNotificationSocket,
} from '@/core/socket/notificationSocket';

/* ===================== MODULE SINGLETONS ===================== */
let socketInitialized = false;
let listenersBound = false;

export function useChat(
  threadIdRef,
  canAccessChatRef,
  currentUser,
  isAdmin = false,
  emit,
) {
  /* ===================== STATE ===================== */
  const messages = ref([]);
  const participants = ref({
    client: null,
    expert: null,
    admin: null,
  });

  const loading = ref(false);
  const error = ref(null);
  const chatNotReady = ref(false);

  const threadId = computed(() => threadIdRef?.value || null);
  const canAccess = computed(() => !!canAccessChatRef?.value || isAdmin);

  /* ===================== SOCKET INIT ===================== */
  if (!socketInitialized) {
    initNotificationSocket({ role: currentUser.role });
    socketInitialized = true;
  }

  const socket = getNotificationSocket();

  /* ===================== MESSAGE NORMALIZATION ===================== */
  const normalizeMessage = (msg) => {
    const sender = msg.sender || {};

    // Resolve sender from participants if role/email missing
    let resolvedSender = sender;

    const allParticipants = [
      participants.value.client,
      participants.value.expert,
      participants.value.admin,
    ].filter(Boolean);

    const match = allParticipants.find((p) => p._id === sender._id);

    if (match) {
      resolvedSender = {
        ...sender,
        role: match.role,
        email: match.email,
        name: match.name || '',
      };
    }

    const normalizedRole = resolvedSender.role
      ? resolvedSender.role.toLowerCase()
      : 'unknown';

    return {
      ...msg,
      sender: {
        _id: resolvedSender._id || 'unknown',
        role: normalizedRole,
        email: resolvedSender.email || '',
        name: resolvedSender.name || '',
      },
      senderDisplayName:
        resolvedSender.role || resolvedSender.email || 'Unknown',
    };
  };

  /* ===================== SOCKET LISTENERS ===================== */
  if (socket && !listenersBound) {
    socket.on('new-message', ({ threadId: incomingId, message }) => {
      if (incomingId !== threadId.value) return;

      messages.value.push(normalizeMessage(message));
    });

    socket.on(
      'message-moderated',
      ({ threadId: incomingId, messageId, status, rejectionReason }) => {
        if (incomingId !== threadId.value) return;

        const msg = messages.value.find((m) => m._id === messageId);
        if (msg) {
          msg.status = status;
          msg.rejectionReason = rejectionReason || null;
        }
      },
    );

    socket.on('message-deleted', ({ threadId: incomingId, messageId }) => {
      if (incomingId !== threadId.value) return;
      messages.value = messages.value.filter((m) => m._id !== messageId);
    });

    listenersBound = true;
  }

  /* ===================== ROOM HANDLING ===================== */
  const joinRoom = (id) => socket?.emit('join-chat-thread', id);
  const leaveRoom = (id) => socket?.emit('leave-chat-thread', id);

  watch(
    () => threadId.value,
    (newId, oldId) => {
      if (oldId) leaveRoom(oldId);
      if (newId && canAccess.value) joinRoom(newId);
    },
  );

  /* ===================== LOAD CHAT THREAD ===================== */
  const loadChat = async () => {
    if (!threadId.value || !canAccess.value) return;

    loading.value = true;
    error.value = null;

    try {
      const { data } = await chatApi.getThread(threadId.value);

      // 🔑 SET PARTICIPANTS FIRST
      participants.value = {
        client: data.participants?.client || null,
        expert: data.participants?.expert || null,
        admin: data.participants?.admin || null,
      };

      messages.value = Array.isArray(data.messages)
        ? data.messages.map(normalizeMessage)
        : [];

      chatNotReady.value = false;
      emit?.('chat-ready', threadId.value);
    } catch (err) {
      if (err.response?.status === 403) {
        chatNotReady.value = true;
        messages.value = [];
        participants.value = { client: null, expert: null, admin: null };
      } else {
        error.value = err;
        console.error('loadChat error:', err);
      }
    } finally {
      loading.value = false;
    }
  };

  /* ===================== SEND MESSAGE ===================== */
  const sendMessage = async (content) => {
    if (!content?.trim() || !threadId.value) return;

    const tempId = `temp-${Date.now()}`;

    messages.value.push({
      _id: tempId,
      content: content.trim(),
      status: 'pending',
      sender: {
        _id: currentUser._id,
        role: currentUser.role.toLowerCase(),
        email: currentUser.email,
        name: currentUser.name || currentUser.username,
      },
      senderDisplayName: currentUser.role || currentUser.email,
      createdAt: new Date().toISOString(),
    });

    try {
      await chatApi.sendMessage(threadId.value, content.trim());
    } catch (err) {
      messages.value = messages.value.filter((m) => m._id !== tempId);
      error.value = err;
    }
  };

  /* ===================== ADMIN MODERATION ===================== */
  const moderateMessage = async (messageId, action, reason = '') => {
    if (!isAdmin || !threadId.value) return;

    try {
      const { data } = await chatApi.moderateMessage(
        threadId.value,
        messageId,
        action,
        reason,
      );

      const idx = messages.value.findIndex((m) => m._id === messageId);
      if (idx !== -1) {
        messages.value[idx] = normalizeMessage(data.message);
      }

      return data.message;
    } catch (err) {
      error.value = err;
      console.error('Moderation error:', err);
      throw err;
    }
  };

  /* ===================== SOFT DELETE MESSAGE ===================== */
  const deleteMessage = async (messageId) => {
    if (!threadId.value) return;

    try {
      await chatApi.softDeleteMessage(threadId.value, messageId);
      messages.value = messages.value.filter((m) => m._id !== messageId);
    } catch (err) {
      console.error('deleteMessage error:', err);
      throw err;
    }
  };

  /* ===================== MARK AS READ ===================== */
  const markAsRead = async () => {
    if (!threadId.value) return;
    try {
      await chatApi.markRead(threadId.value);
    } catch {
      console.warn('Read receipt failed');
    }
  };

  /* ===================== AUTO RETRY IF LOCKED ===================== */
  let retryTimer = null;

  watch(chatNotReady, (locked) => {
    if (!locked || retryTimer) return;

    retryTimer = setInterval(async () => {
      await loadChat();
      if (!chatNotReady.value) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
    }, 3000);
  });

  watch(
    () => ({ id: threadId.value, access: canAccess.value }),
    ({ id, access }) => {
      if (id && access) loadChat();
    },
    { immediate: true },
  );

  onMounted(() => {
    if (threadId.value && canAccess.value) loadChat();
  });

  onUnmounted(() => {
    if (threadId.value) leaveRoom(threadId.value);
    if (retryTimer) clearInterval(retryTimer);
  });

  /* ===================== EXPOSE ===================== */
  return {
    messages,
    participants,
    loading,
    error,
    chatNotReady,
    loadChat,
    sendMessage,
    moderateMessage,
    deleteMessage,
    markAsRead,
  };
}
