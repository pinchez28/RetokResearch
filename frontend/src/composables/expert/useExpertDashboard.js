// src/composables/useExpertDashboard.js
import { ref } from 'vue';
import { expertApi } from '../../core/api/http.js';

export const useExpertDashboard = () => {
  const profile = ref(null);
  const assignments = ref([]); // renamed from projects for clarity
  const proposals = ref([]);
  const stats = ref({});
  const loading = ref(false);
  const error = ref(null);

  /* =======================================================
     FETCH EXPERT PROFILE
  ======================================================== */
  const fetchProfile = async () => {
    loading.value = true;
    try {
      const res = await expertApi.getProfile();
      profile.value = res.data.data || res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  /* =======================================================
     FETCH ASSIGNMENTS (ASSIGNED JOBS)
     Updated to use expertAssignmentController endpoints
  ======================================================== */
  const fetchAssignments = async () => {
    loading.value = true;
    try {
      const res = await expertApi.getAssignments();
      // backend now returns DTOs with chatThreadId and status
      assignments.value = res.data.assignments || [];
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  /* =======================================================
     FETCH SINGLE ASSIGNMENT DETAILS
     For opening assignment details or chat
  ======================================================== */
  const fetchAssignmentDetails = async (assignmentId) => {
    loading.value = true;
    try {
      const res = await expertApi.getAssignmentDetails(assignmentId);
      return res.data.assignment || null;
    } catch (err) {
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /* =======================================================
     CONFIRM ASSIGNMENT (START WORK)
  ======================================================== */
  const confirmAssignment = async (jobId) => {
    loading.value = true;
    try {
      const res = await expertApi.confirmAssignment(jobId);
      // update local assignments list
      const idx = assignments.value.findIndex(
        (a) => a.assignmentId === res.data.assignment.assignmentId
      );
      if (idx !== -1) {
        assignments.value[idx] = res.data.assignment;
      }
      return res.data.assignment;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* =======================================================
     FETCH EXPERT PROPOSALS
  ======================================================== */
  const fetchProposals = async () => {
    loading.value = true;
    try {
      const res = await expertApi.getProposals();
      proposals.value = res.data.data || res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  /* =======================================================
     FETCH EXPERT STATS
  ======================================================== */
  const fetchStats = async () => {
    loading.value = true;
    try {
      const res = await expertApi.getStats();
      stats.value = res.data.data || res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  /* =======================================================
     UPDATE PROFILE
  ======================================================== */
  const updateProfile = async (formData) => {
    loading.value = true;
    try {
      const res = await expertApi.updateProfile(formData);
      profile.value = res.data.data || res.data;
      return profile.value;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    assignments,
    proposals,
    stats,
    loading,
    error,
    fetchProfile,
    fetchAssignments,
    fetchAssignmentDetails,
    confirmAssignment,
    fetchProposals,
    fetchStats,
    updateProfile,
  };
};
