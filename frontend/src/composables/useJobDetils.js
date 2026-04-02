// composables/useJobDetails.js
import { ref } from 'vue';
import { adminApi } from '@/core/api/http';

export function useJobDetails(jobId) {
  const job = ref(null);
  const assignment = ref(null);
  const project = ref(null);
  const chatThread = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchJobDetails = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await adminApi.getJobById(jobId);
      if (data.success) {
        job.value = data.data.job;
        assignment.value = data.data.assignment;
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch job';
    } finally {
      loading.value = false;
    }
  };

  const fetchProject = async () => {
    try {
      const { data } = await adminApi.getProjectByJobId(jobId);
      project.value = data.project;
    } catch (err) {
      console.error('Project fetch failed', err);
    }
  };

  const fetchChatThread = async () => {
    try {
      const threadId =
        assignment.value?.chatThreadId?._id || assignment.value?.chatThreadId;
      if (!threadId) return;

      const { data } = await adminApi.getChatThreadById(threadId);
      chatThread.value = data.chatThread;
    } catch (err) {
      console.error('Chat fetch failed', err);
    }
  };

  const sendAdminMessage = async (text) => {
    if (!chatThread.value) return;

    try {
      const { data } = await adminApi.sendMessage(chatThread.value._id, {
        text,
        senderRole: 'admin',
      });
      if (data.success) {
        chatThread.value.messages.push(data.message);
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return {
    job,
    assignment,
    project,
    chatThread,
    loading,
    error,
    fetchJobDetails,
    fetchProject,
    fetchChatThread,
    sendAdminMessage,
  };
}
