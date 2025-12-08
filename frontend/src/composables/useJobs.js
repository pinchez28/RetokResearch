// src/composables/useJobs.js
import { jobsStore } from './jobsStore.js';
import api from '@/utils/api.js';

export const loadJobs = async () => {
  try {
    const { data } = await api.get('/client/jobs/mine'); // returns jobs with applications
    jobsStore.value = data.jobs; // populate store
    console.log('Jobs loaded:', jobsStore.value);
  } catch (err) {
    console.error('Failed to load jobs', err);
  }
};
