import { ref } from 'vue';
import { adminApi } from '@/core/api/http';

export function useAdminJobDetails() {
  const loading = ref(false);
  const error = ref(null);

  const job = ref(null);
  const assignment = ref(null);
  const proposal = ref(null);
  const timeline = ref([]);
  const charts = ref({});
  const chatThread = ref(null);

  const fetchJobDetails = async (jobId) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await adminApi.getJobById(jobId);

      job.value = data.data.job;
      assignment.value = data.data.assignment;
      proposal.value = data.data.proposal;
      timeline.value = data.data.timeline;
      charts.value = data.data.charts;
      chatThread.value = data.data.chatThread;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load job details';
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    job,
    assignment,
    proposal,
    timeline,
    charts,
    chatThread,
    fetchJobDetails,
  };
}
