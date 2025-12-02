// src/utils/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach token for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// ===== Client API =====
export const clientApi = {
  postJob: (jobData, isFormData = false) => {
    if (isFormData) {
      return api.post('/client/jobs', jobData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      return api.post('/client/jobs', jobData);
    }
  },
  getMyJobs: () => api.get('/client/jobs/mine'),
};

// ===== Expert API =====
export const expertApi = {
  getAvailableJobs: () => api.get('/expert/jobs'),
  applyForJob: (jobId, applicationData) =>
    api.post(`/expert/jobs/${jobId}/apply`, applicationData),
  getMyApplications: () => api.get('/expert/jobs/applied'),
};

// ===== Admin API =====
export const adminApi = {
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  getActiveJobs: () => api.get('/admin/jobs/active'), // <-- add this
  approveJob: (jobId, payload) =>
    api.patch(`/admin/jobs/approve/${jobId}`, payload),
  rejectJob: (jobId) => api.patch(`/admin/jobs/reject/${jobId}`),
  reviewJob: (jobId, reviewData) =>
    api.put(`/admin/jobs/${jobId}/review`, reviewData),
  getAllJobs: () => api.get('/admin/jobs'),
};

export default api; // default export is just the Axios instance
