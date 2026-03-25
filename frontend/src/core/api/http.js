// src/core/api/http.js
import axios from 'axios';

/* ================= BASE URL ================= */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:4000';

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // important for refresh cookie
});

/* ================= ACCESS TOKEN (MEMORY) ================= */
let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) localStorage.setItem('token', token);
};

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const token = accessToken || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ================= REFRESH LOGIC ================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { data } = await api.get('/auth/refresh'); // refresh endpoint
        const newToken = data.accessToken;

        setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        accessToken = null;
        localStorage.removeItem('token');

        // Reset auth store & force logout
        try {
          const { useAuthStore } = await import('@/core/store/auth.js');
          const authStore = useAuthStore();
          authStore.logout();
        } catch (e) {
          console.warn('Failed to reset auth store on refresh failure', e);
        }

        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/* ================= GUEST API ================= */
export const guestApi = {
  getAbout: () => api.get('/guest/about'),
  getApprovedJobs: () => api.get('/guest/jobs/approved'),
  getServices: () => api.get('/guest/services'),
  submitGuestRequest: (payload) => api.post('/guest/guest-requests', payload),
  submitGuestMessage: (payload) =>
    api.post('/guest/messages/contact-admin', payload),
};

/* ================= AUTH API ================= */
export const authApi = {
  signupClient: (payload) => api.post('/auth/clients/signup', payload),
  signupExpert: (formData) => api.post('/auth/experts/signup', formData),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
};

/* ================= CLIENT API ================= */
export const clientApi = {
  getStats: () => api.get('/client/stats'),
  getDashboard: () => api.get('/client/dashboard'),
  getNotifications: () => api.get('/client/notifications'),
  getProfile: () => api.get('/client/profile'),
  updateProfile: (data) => api.patch('/client/profile', data),
  postJob: (formData) =>
    api.post('/client/jobs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyJobs: (params = {}) => api.get('/client/jobs', { params }),
  getJobById: (jobId) => api.get(`/client/jobs/${jobId}`),
  updateJob: (jobId, data) => api.put(`/client/jobs/${jobId}/update`, data),
  deleteJob: (jobId) => api.delete(`/client/jobs/${jobId}`),
  hireExpert: (jobId, payload) =>
    api.post(`/client/jobs/${jobId}/hire`, payload),
  getJobProposals: (jobId) => api.get(`/client/jobs/${jobId}/proposals`),
  acceptProposal: (jobId, proposalId) =>
    api.post(`/client/jobs/${jobId}/proposals/${proposalId}/accept`),
  getProjects: (params = {}) => api.get('/client/projects', { params }),
  getProjectById: (projectId) => api.get(`/client/projects/${projectId}`),
  startJob: (projectId) => api.post(`/client/projects/${projectId}/start`),
  submitJob: (projectId, formData) =>
    api.post(`/client/projects/${projectId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  initiateProjectPayment(projectId, phone) {
    return api.post(`/client/projects/${projectId}/pay`, { phone });
  },
  retryProjectPayment(projectId, phone) {
    return api.post(`/client/projects/${projectId}/pay/retry`, { phone });
  },

  requestPaymentConfirmation(projectId) {
    return api.post(
      `/client/projects/${projectId}/request-payment-confirmation`,
    );
  },
  manualProjectPayment(projectId, phone) {
    return api.post(`/client/projects/${projectId}/manual-pay`, { phone });
  },
  getProjectPaymentStatus(projectId) {
    return api.get(`/client/projects/${projectId}/payment-status`);
  },
  downloadWork(projectId) {
    return api.get(`/client/projects/${projectId}/download`, {
      responseType: 'blob',
    });
  },
  markProjectDownloaded(projectId) {
    return api.post(`/client/projects/${projectId}/downloaded`);
  },
  approveCompletedWork: (projectId) =>
    api.post(`/client/projects/approve/${projectId}`),
  requestRevision: (projectId, note) =>
    api.post(`/client/projects/revision/${projectId}`, { note }),
  downloadFile: (url) => window.open(url, '_blank'),
};

/* ================= EXPERT API ================= */
export const expertApi = {
  getAvailableJobs: (params = {}) => api.get('/expert/jobs', { params }),
  getJobById: (jobId) => api.get(`/expert/jobs/${jobId}`),
  applyForJob: (jobId, formData) =>
    api.post(`/expert/jobs/${jobId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAssignments: () => api.get('/expert/assignments'),
  getAssignmentDetails: (assignmentId) =>
    api.get(`/expert/assignments/${assignmentId}`),
  confirmAssignment: (assignmentId) =>
    api.patch(`/expert/assignments/${assignmentId}/confirm`),

  // ✅ NEW: Confirm admin-assigned guest request
  confirmGuestAssignment: (assignmentId) =>
    api.post(`/expert/guest-assignments/${assignmentId}/confirm`),

  submitWork: (assignmentId, formData) =>
    api.put(`/expert/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  requestRevision: (assignmentId, note) =>
    api.post(`/expert/assignments/${assignmentId}/revision`, { note }),
  getProjects: () => api.get('/expert/projects'),
  getProfile: async () => {
    const { data } = await api.get('/expert/profile');
    return { success: true, data: data.profile };
  },
  updateProfile: (formData) =>
    api.put('/expert/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getStats: () => api.get('/expert/stats'),
  getEarnings: () => api.get('/expert/earnings'),
  getProposals: () => api.get('/expert/proposals'),
};

/* ================= CHAT API ================= */
export const chatApi = {
  getThread: (threadId) => api.get(`/chats/${threadId}`),
  sendMessage: (threadId, content) =>
    api.post(`/chats/${threadId}/messages`, { content }),
  softDeleteMessage: (threadId, messageId) =>
    api.delete(`/chats/${threadId}/messages/${messageId}`),
  moderateMessage: (threadId, messageId, action, reason = '') =>
    api.post(`/chats/${threadId}/messages/${messageId}/moderate`, {
      action,
      reason,
    }),
};

/* ================= ADMIN API ================= */
export const adminApi = {
  // ----- USERS -----
  getClients: () => api.get('/admin/clients'),
  getExperts: () => api.get('/admin/experts'),
  getPendingExperts: () => api.get('/admin/experts/pending'),
  getExpertById: (id) => api.get(`/admin/experts/${id}`),
  approveExpert: (id) => api.patch(`/admin/experts/${id}/approve`),
  rejectExpert: (id, data = {}) =>
    api.patch(`/admin/experts/${id}/reject`, data),

  // ----- JOBS -----
  getJobs: () => api.get('/admin/jobs'),
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  getActiveJobs: () => api.get('/admin/jobs/active'),
  getCompletedJobs: () => api.get('/admin/jobs/completed'),
  getJobById: (id) => api.get(`/admin/jobs/${id}`),
  getProjectByJobId: (jobId) => api.get(`/admin/projects/by-job/${jobId}`),
  reviewJob: (id, data) => api.patch(`/admin/jobs/${id}/review`, data),
  rejectJob: (id, data) => api.patch(`/admin/jobs/${id}/reject`, data),
  overrideAssignment: (id, data) =>
    api.patch(`/admin/jobs/${id}/override-assignment`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getJobsSummary: () => api.get('/admin/jobs/summary'),
  getApprovedExperts: () => api.get('/admin/jobs/approved-experts'),
  assignExpert: (jobId, expertId) =>
    api.post(`/admin/jobs/${jobId}/assign`, { expertId }),
  confirmManualPayment: (projectId) =>
    api.post(`/admin/projects/${projectId}/unlock`),

  // =========================
  // 🔥 GUEST REQUESTS
  // =========================
  getAllExperts: () => api.get('/admin/experts'),
  getGuestRequests: (params = {}) =>
    api.get('/admin/guest-requests', { params }),
  getGuestRequestById: (id) => api.get(`/admin/guest-requests/${id}`),
  acknowledgeGuestRequest: (id) =>
    api.patch(`/admin/guest-requests/${id}/acknowledge`),
  adminUpdateGuestRequest: (id, payload) =>
    api.put(`/admin/guest-requests/${id}/update`, payload),
  approveGuestSubmission: (id) =>
    api.patch(`/admin/guest-requests/${id}/approve`),
  completeGuestRequest: (id) =>
    api.patch(`/admin/guest-requests/${id}/complete`),
  deleteGuestRequest: (id) => api.delete(`/admin/guest-requests/${id}`),
};
export default api;
