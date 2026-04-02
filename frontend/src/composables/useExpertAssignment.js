import { ref } from 'vue';
import { expertApi } from '@/core/api/http'; // ✅ use expertApi

export function useExpertAssignment({ assignmentId }) {
  const assignment = ref(null);
  const loading = ref(false);
  const confirming = ref({});
  const submitting = ref(false);

  const fetchAssignment = async () => {
    loading.value = true;
    try {
      const { data } = await expertApi.getAssignmentDetails(assignmentId); // ✅ expert API
      assignment.value = data.assignment || data; // adjust if backend returns assignment inside `data`
    } catch (err) {
      console.error('Failed to fetch assignment', err);
    } finally {
      loading.value = false;
    }
  };

  const confirmAssignment = async () => {
    confirming.value[assignmentId] = true;
    try {
      await expertApi.confirmAssignment(assignmentId); // ✅ expert API
      await fetchAssignment();
    } catch (err) {
      console.error('Confirm failed', err);
    } finally {
      confirming.value[assignmentId] = false;
    }
  };

  const handleFileUpload = (e) => {
    assignment.value.file = e.target.files[0];
  };

  const submitWork = async () => {
    if (!assignment.value?.file) return;

    submitting.value = true;
    try {
      const formData = new FormData();
      formData.append('finalWork', assignment.value.file);

      await expertApi.submitWork(assignmentId, formData); // ✅ expert API
      await fetchAssignment();
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      submitting.value = false;
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '—';

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'assigned':
        return 'text-yellow-600 font-semibold';
      case 'in_progress':
        return 'text-blue-600 font-semibold';
      case 'in_review':
        return 'text-purple-600 font-semibold';
      case 'completed':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-500';
    }
  };

  return {
    assignment,
    loading,
    confirming,
    submitting,
    fetchAssignment,
    formatDate,
    statusBadgeClass,
    confirmAssignment,
    handleFileUpload,
    submitWork,
  };
}
