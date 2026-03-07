// src/composables/useExpertAssignment.js
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { expertApi } from '@/core/api/http';
import { useAuth } from '@/composables/useAuth';

export function useExpertAssignment() {
  const route = useRoute();
  const toast = useToast();
  const { user } = useAuth();

  // ================= STATE =================
  const assignment = ref(null);
  const loading = ref(false);
  const submitting = ref(false);
  const confirming = ref({});
  const file = ref(null);
  const timeRemaining = ref('—');
  let timerInterval = null;

  const assignmentId = computed(() => route.params.assignmentId);
  const expertId = computed(() => user.value?._id); // dynamically track logged-in expert

  // ================= HELPERS =================
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—';

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'in_progress':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded';
      case 'completed':
        return 'bg-gray-200 text-gray-600 px-2 py-1 rounded';
      default:
        return 'bg-gray-100 text-gray-600 px-2 py-1 rounded';
    }
  };

  // ================= FETCH ASSIGNMENT =================
  const fetchAssignment = async () => {
    if (!assignmentId.value || !expertId.value) return;

    loading.value = true;
    assignment.value = null; // reset before fetch
    try {
      const { data } = await expertApi.getAssignmentDetails(assignmentId.value);

      if (!data.success) {
        toast.error('Assignment not found');
        assignment.value = null;
        return;
      }

      assignment.value = data.assignment;

      // Detect if this is an admin-assigned guest request
      // Optional: Add a flag for frontend display
      assignment.value.isAdminAssigned = !!data.assignment.isAdminAssigned;
    } catch (err) {
      console.error('fetchAssignment error:', err);
      toast.error(err?.response?.data?.message || 'Failed to fetch assignment');
      assignment.value = null;
    } finally {
      loading.value = false;
    }
  };

  // ================= CONFIRM ASSIGNMENT =================
  const confirmAssignment = async () => {
    if (!assignment.value?._id) return;

    confirming.value[assignment.value._id] = true;
    try {
      // If this is admin-assigned guest request, call separate endpoint
      let data;
      if (assignment.value.isAdminAssigned) {
        ({ data } = await expertApi.confirmGuestAssignment(
          assignment.value._id,
        ));
      } else {
        ({ data } = await expertApi.confirmAssignment(assignment.value._id));
      }

      toast.success(data.message || 'Assignment confirmed');
      await fetchAssignment();
    } catch (err) {
      console.error('confirmAssignment error:', err);
      toast.error(
        err?.response?.data?.message || 'Failed to confirm assignment',
      );
    } finally {
      confirming.value[assignment.value._id] = false;
    }
  };

  // ================= SUBMIT WORK =================
  const submitWork = async () => {
    if (!file.value || !assignment.value?._id) {
      toast.error('Please select a file first');
      return;
    }

    submitting.value = true;
    try {
      const formData = new FormData();
      formData.append('finalWork', file.value);

      // Use separate endpoint if admin-assigned
      if (assignment.value.isAdminAssigned) {
        await expertApi.submitGuestWork(assignment.value._id, formData);
      } else {
        await expertApi.submitWork(assignment.value._id, formData);
      }

      toast.success('Work submitted successfully');
      file.value = null;
      await fetchAssignment(); // Refresh assignment
    } catch (err) {
      console.error('submitWork error:', err);
      toast.error(err?.response?.data?.message || 'Failed to submit work');
    } finally {
      submitting.value = false;
    }
  };

  // ================= FILE UPLOAD HANDLER =================
  const handleFileUpload = (e) => {
    file.value = e.target.files?.[0] || null;
  };

  // ================= COUNTDOWN =================
  const startCountdown = () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!assignment.value?.dueDate) {
        timeRemaining.value = '—';
        return;
      }

      const diff = new Date(assignment.value.dueDate) - Date.now();
      if (diff <= 0) {
        timeRemaining.value = 'Deadline passed';
        clearInterval(timerInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      timeRemaining.value = `${days}d ${hours}h ${minutes}m`;
    }, 60000);
  };

  watch(
    [assignment, expertId],
    ([val]) => {
      if (val?.status === 'in_progress' && val?.dueDate) {
        startCountdown();
      } else {
        clearInterval(timerInterval);
        timeRemaining.value = '—';
      }
    },
    { immediate: true },
  );

  onUnmounted(() => clearInterval(timerInterval));

  return {
    assignment,
    loading,
    submitting,
    confirming,
    timeRemaining,
    formatDate,
    statusBadgeClass,
    fetchAssignment,
    confirmAssignment,
    submitWork,
    handleFileUpload,
  };
}
