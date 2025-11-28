import axios from 'axios';

const API_BASE = 'http://localhost:4000/api'; // adjust if needed

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Client API =====
export const clientApi = {
  postJob: (jobData) => api.post('/client/jobs', jobData),
  getMyJobs: () => api.get('/client/jobs/mine'), // optional: backend endpoint for client jobs
};

// ===== Expert API =====
export const expertApi = {
  getAvailableJobs: () => api.get('/expert/jobs'),
  applyForJob: (jobId, applicationData) =>
    api.post(`/expert/jobs/${jobId}/apply`, applicationData),
  getMyApplications: () => api.get('/expert/jobs/applied'), // optional
};

// ===== Admin API =====
export const adminApi = {
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  reviewJob: (jobId, reviewData) =>
    api.put(`/admin/jobs/${jobId}/review`, reviewData),
  getAllJobs: () => api.get('/admin/jobs'), // optional
};

export default api;
