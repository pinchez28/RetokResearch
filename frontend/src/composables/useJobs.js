// src/composables/useJobs.js
import { reactive, readonly } from 'vue';
import { expertApi } from '@/core/api/http.js';

const state = reactive({
  jobs: [],
});

/**
 * Expert Jobs Composable
 * - Fetch available jobs
 * - Remove a job after applying
 * - Get job by ID
 */
export default function useJobs() {
  /**
   * Load all available jobs for expert
   * Excludes jobs the expert has already applied for
   */
  const loadJobs = async () => {
    try {
      const res = await expertApi.getAvailableJobs();
      if (res.data?.success) {
        state.jobs = res.data.jobs.filter((job) => !job.hasApplied);
        console.log('Available jobs loaded:', state.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
  };

  /**
   * Remove a job from the local store
   * Typically used after expert applies
   */
  const removeJob = (jobId) => {
    state.jobs = state.jobs.filter((job) => job._id !== jobId);
  };

  /**
   * Get a specific job by ID from local store
   */
  const getJobById = (jobId) => state.jobs.find((j) => j._id === jobId);

  return {
    jobs: readonly(state.jobs),
    loadJobs,
    removeJob,
    getJobById,
  };
}
