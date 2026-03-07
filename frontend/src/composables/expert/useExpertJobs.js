// src/composables/expert/useExpertJobs.js
import { ref } from 'vue';
import { expertApi, chatApi } from '../../core/api/http.js';

export const useExpertJobs = () => {
  const jobs = ref([]); // available jobs
  const assignments = ref([]); // hired jobs
  const jobDetails = ref(null);
  const chatThread = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ---------------- Fetch available jobs ----------------
  const fetchJobs = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await expertApi.getAvailableJobs();
      jobs.value = res.data.jobs || res.data;
    } catch (err) {
      console.error('Failed to fetch available jobs:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // ---------------- Fetch assignments (hired jobs) ----------------
  const fetchAssignments = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await expertApi.getMyAssignedJobs();
      assignments.value = res.data.jobs || res.data;
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // ---------------- Fetch single job details ----------------
  const fetchJobDetails = async (jobId) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await expertApi.getJobById(jobId);
      jobDetails.value = res.data.data || res.data;
    } catch (err) {
      console.error(`Failed to fetch job ${jobId}:`, err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // ---------------- Fetch chat thread for a job ----------------
  const fetchChatThread = async (threadId) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await chatApi.getThread(threadId);
      chatThread.value = res.data.messages || res.data;
    } catch (err) {
      console.error(`Failed to fetch chat thread ${threadId}:`, err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // ---------------- Apply for a job ----------------
  const applyForJob = async (jobId, formData) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await expertApi.applyForJob(jobId, formData);
      return res.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ---------------- Start job ----------------
  const startJob = async (jobId) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await expertApi.startJob(jobId);
      return res.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ---------------- Upload final work ----------------
  const uploadFinalWork = async (jobId, formData) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await expertApi.uploadFinalWork(jobId, formData);
      return res.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    jobs,
    assignments,
    jobDetails,
    chatThread,
    loading,
    error,
    fetchJobs,
    fetchAssignments,
    fetchJobDetails,
    fetchChatThread,
    applyForJob,
    startJob,
    uploadFinalWork,
  };
};
