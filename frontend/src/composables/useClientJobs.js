import { ref, onMounted } from 'vue';
import { clientApi } from '@/core/api/http.js';
import Swal from 'sweetalert2';

export function useClientProject(projectId = null) {
  const project = ref(null);
  const loading = ref(false);
  const starting = ref(false);
  const submitting = ref(false);
  const file = ref(null);
  const chatThreadId = ref(null);

  // ---------------- HELPERS ----------------
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
  const formatDateTime = (d) => (d ? new Date(d).toLocaleString() : '—');

  const badgeClass = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'ready':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // ---------------- FETCH ALL PROJECTS ----------------
  const fetchProjects = async () => {
    loading.value = true;
    try {
      const { data } = await clientApi.getClientProjects();
      return data.projects || [];
    } catch (err) {
      console.error('Failed to fetch projects', err);
      Swal.fire('Error', 'Failed to load projects', 'error');
      return [];
    } finally {
      loading.value = false;
    }
  };

  // ---------------- FETCH SINGLE PROJECT ----------------
  const fetchProject = async () => {
    if (!projectId) return;
    loading.value = true;
    try {
      const { data } = await clientApi.getProjectById(projectId);
      project.value = data.project || null;
      chatThreadId.value = data.project?.chatThreadId || null;
    } catch (err) {
      console.error('Failed to load project', err);
      project.value = null;
      chatThreadId.value = null;
      Swal.fire('Error', 'Failed to load project', 'error');
    } finally {
      loading.value = false;
    }
  };

  // ---------------- START PROJECT ----------------
  const startProject = async () => {
    if (!project.value?._id || starting.value) return;
    starting.value = true;
    try {
      await clientApi.startJob(project.value._id);
      project.value.status = 'in_progress';
      Swal.fire('Started', 'Project started successfully', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire(
        'Error',
        err?.response?.data?.message || 'Failed to start project',
        'error'
      );
    } finally {
      starting.value = false;
    }
  };

  // ---------------- FILE UPLOAD & SUBMISSION ----------------
  const handleFileUpload = (e) => {
    file.value = e.target.files[0];
  };

  const submitWork = async () => {
    if (!file.value) return Swal.fire('Error', 'Select a file first', 'error');
    submitting.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file.value);
      await clientApi.markReceived(project.value._id, formData);
      Swal.fire('Success', 'Work submitted successfully', 'success');
      await fetchProject();
    } catch (err) {
      console.error(err);
      Swal.fire(
        'Error',
        err?.response?.data?.message || 'Failed to submit work',
        'error'
      );
    } finally {
      submitting.value = false;
    }
  };

  // ---------------- APPROVE / REQUEST REVISION ----------------
  const approveWork = async () => {
    if (!project.value?._id) return;
    submitting.value = true;
    try {
      await clientApi.approveWork(project.value._id);
      Swal.fire('Approved', 'Work approved successfully', 'success');
      await fetchProject();
    } catch (err) {
      console.error(err);
      Swal.fire(
        'Error',
        err?.response?.data?.message || 'Failed to approve work',
        'error'
      );
    } finally {
      submitting.value = false;
    }
  };

  const requestRevision = async (note = '') => {
    if (!project.value?._id) return;
    submitting.value = true;
    try {
      await clientApi.requestRevision(project.value._id, { note });
      Swal.fire(
        'Revision Requested',
        'The expert will be notified.',
        'success'
      );
      await fetchProject();
    } catch (err) {
      console.error(err);
      Swal.fire(
        'Error',
        err?.response?.data?.message || 'Failed to request revision',
        'error'
      );
    } finally {
      submitting.value = false;
    }
  };

  // ---------------- FILE DOWNLOAD ----------------
  const downloadFile = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  onMounted(() => {
    if (projectId) fetchProject();
  });

  return {
    project,
    loading,
    starting,
    submitting,
    file,
    chatThreadId,
    fetchProject,
    fetchProjects,
    startProject,
    handleFileUpload,
    submitWork,
    approveWork,
    requestRevision,
    downloadFile,
    formatDate,
    formatDateTime,
    badgeClass,
  };
}
