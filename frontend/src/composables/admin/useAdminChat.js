import { ref } from 'vue';
import http from '@/core/api/http';
import { useAuthStore } from '@/core/store/auth';
import { socket } from '@/core/api/socket';

export function useAdminChat() {
  const authStore = useAuthStore();

  const thread = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /* ===============================
     LOAD CHAT THREAD
  =============================== */
  const loadThread = async (threadId) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await http.get(`/chat/${threadId}`);
      thread.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load chat';
    } finally {
      loading.value = false;
    }
  };

  /* ===============================
     APPROVE MESSAGE
  =============================== */
  const approveMessage = async (threadId, messageId) => {
    try {
      await http.post(`/chat/${threadId}/messages/${messageId}/moderate`);
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  /* ===============================
     DELETE MESSAGE
  =============================== */
  const deleteMessage = async (threadId, messageId) => {
    try {
      await http.delete(`/chat/${threadId}/messages/${messageId}`);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  /* ===============================
     SOCKET BINDINGS
  =============================== */
  const bindSockets = (threadId) => {
    socket.emit('join-thread', threadId);

    socket.on('new-message', ({ message }) => {
      if (!thread.value) return;
      thread.value.messages.push(message);
    });

    socket.on('message-moderated', ({ messageId, status }) => {
      const msg = thread.value?.messages.find((m) => m._id === messageId);
      if (msg) msg.status = status;
    });

    socket.on('message-deleted', ({ messageId }) => {
      const msg = thread.value?.messages.find((m) => m._id === messageId);
      if (msg) msg.deleted = true;
    });
  };

  return {
    thread,
    loading,
    error,
    loadThread,
    approveMessage,
    deleteMessage,
    bindSockets,
  };
}
