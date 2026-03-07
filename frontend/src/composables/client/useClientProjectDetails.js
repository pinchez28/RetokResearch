import { ref, onMounted, computed } from 'vue';
import { clientApi } from '@/core/api/http.js';
import Swal from 'sweetalert2';

export function useClientProjectDetails(projectId) {
  /* ---------------- STATE ---------------- */
  const project = ref(null);
  const loading = ref(false);
  const submitting = ref(false);
  const file = ref(null);
  const chatThreadId = ref(null);

  /* ---------------- HELPERS ---------------- */
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  const statusBadgeClass = (status) => {
    const map = {
      assigned: 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded',
      in_progress: 'bg-blue-100 text-blue-700 px-2 py-1 rounded',
      ready: 'bg-purple-100 text-purple-700 px-2 py-1 rounded',
      completed: 'bg-green-100 text-green-700 px-2 py-1 rounded',
      cancelled: 'bg-red-100 text-red-700 px-2 py-1 rounded',
    };
    return map[status] || 'bg-gray-100 text-gray-700 px-2 py-1 rounded';
  };

  /* ---------------- CHAT ACCESS ---------------- */
  const canAccessChat = computed(() => project.value?.status === 'in_progress');

  /* ---------------- TIME REMAINING ---------------- */
  const timeRemaining = computed(() => {
    if (!project.value?.deadline) return '—';

    const now = new Date();
    const deadline = new Date(project.value.deadline);
    let diff = deadline - now;

    if (diff <= 0) return 'Deadline passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    let str = '';
    if (days) str += `${days}d `;
    if (hours) str += `${hours}h `;
    if (minutes) str += `${minutes}m`;

    return str.trim();
  });

  /* ---------------- FETCH PROJECT ---------------- */
  const fetchProject = async () => {
    loading.value = true;
    try {
      const res = await clientApi.getProjectById(projectId);
      console.log('[DEBUG] API response:', res.data);

      if (res.data.success) {
        const p = res.data.project;

        // Set budget from hired expert quote
        if (!p.budget && p.applications?.length) {
          const acceptedApp = p.applications.find(
            (a) => a.status === 'accepted'
          );
          if (acceptedApp) p.budget = acceptedApp.quote;
        }

        project.value = p;
        chatThreadId.value = p.chatThreadId || null;
      } else {
        console.error('[DEBUG] API returned success: false', res.data.message);
        project.value = null;
      }
    } catch (err) {
      console.error('[DEBUG] Failed to fetch project', err);
      project.value = null;
    } finally {
      loading.value = false;
    }
  };

  /* ---------------- FILE UPLOAD ---------------- */
  const handleFileUpload = (e) => {
    file.value = e.target.files?.[0] || null;
  };

  const submitWork = async () => {
    if (!file.value) {
      return Swal.fire('Error', 'Please select a file first', 'error');
    }

    submitting.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file.value);

      await clientApi.submitJob(projectId, formData);
      Swal.fire('Success', 'Work submitted successfully', 'success');
      file.value = null;
      await fetchProject();
    } catch (err) {
      console.error('[useClientProjectDetails] submitWork error', err);
      Swal.fire('Error', 'Failed to submit work', 'error');
    } finally {
      submitting.value = false;
    }
  };

  /* ---------------- APPROVAL ---------------- */
  const approveWork = async () => {
    submitting.value = true;
    try {
      await clientApi.approveCompletedWork(projectId);
      Swal.fire('Approved', 'Work approved successfully', 'success');
      await fetchProject();
    } catch (err) {
      console.error('[useClientProjectDetails] approveWork error', err);
      Swal.fire('Error', 'Failed to approve work', 'error');
    } finally {
      submitting.value = false;
    }
  };

  const requestRevision = async (note) => {
    submitting.value = true;
    try {
      await clientApi.requestRevision(projectId, { note });
      Swal.fire('Revision Requested', 'Expert has been notified', 'success');
      await fetchProject();
    } catch (err) {
      console.error('[useClientProjectDetails] requestRevision error', err);
      Swal.fire('Error', 'Failed to request revision', 'error');
    } finally {
      submitting.value = false;
    }
  };

  /* ---------------- FILE DOWNLOAD ---------------- */
  const downloadFile = (url) => {
    if (url) window.open(url, '_blank');
  };

  /* ---------------- INIT ---------------- */
  onMounted(fetchProject);

  return {
    // state
    project,
    loading,
    submitting,
    file,
    chatThreadId,
    canAccessChat,
    timeRemaining,

    // methods
    fetchProject,
    handleFileUpload,
    submitWork,
    approveWork,
    requestRevision,
    downloadFile,

    // helpers
    formatDate,
    statusBadgeClass,
  };
}
