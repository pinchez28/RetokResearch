// src/core/store/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, setAccessToken } from '@/core/api/http.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loggedIn = ref(false);
  const isLoading = ref(false);
  const isInitialized = ref(false);

  /* ================= COMPUTED ================= */
  const userRole = computed(() => user.value?.role);
  const userId = computed(() => user.value?._id);
  const isClient = computed(() => user.value?.role === 'Client');
  const isExpert = computed(() => user.value?.role === 'Expert');
  const isAdmin = computed(() => user.value?.role === 'Admin');
  const isAuthenticated = computed(() => loggedIn.value && !!user.value);

  /* ================= INITIALIZE (FIXED) ================= */
  const initialize = async () => {
    if (isInitialized.value || isLoading.value) return;

    isLoading.value = true;

    try {
      // Try current access token first
      const storedToken = localStorage.getItem('token');
      if (storedToken) setAccessToken(storedToken);

      let response;
      try {
        response = await authApi.getCurrentUser();
      } catch (err) {
        // If 401 → try refresh
        if (err.response?.status === 401) {
          const refreshRes = await authApi.refresh(); // call /auth/refresh
          setToken(refreshRes.data.accessToken); // store new access token
          response = await authApi.getCurrentUser(); // retry fetching user
        } else {
          throw err;
        }
      }

      user.value = response.data;
      loggedIn.value = true;
    } catch (err) {
      user.value = null;
      loggedIn.value = false;
      setToken(null);
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  };

  /* ================= TOKEN ================= */
  const setToken = (token) => {
    if (token) {
      setAccessToken(token);
      localStorage.setItem('token', token);
    } else {
      setAccessToken(null);
      localStorage.removeItem('token');
    }
  };

  /* ================= LOGIN ================= */
  const login = async (credentials) => {
    isLoading.value = true;
    try {
      const { data } = await authApi.login(credentials);

      if (!data.accessToken) {
        throw new Error('No access token received');
      }

      setToken(data.accessToken);
      user.value = data.user;
      loggedIn.value = true;

      return user.value;
    } finally {
      isLoading.value = false;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    isLoading.value = true;
    try {
      await authApi.logout();
    } catch (_) {
      // ignore
    } finally {
      user.value = null;
      loggedIn.value = false;
      setToken(null);
      isLoading.value = false;
      window.location.href = '/login';
    }
  };

  /* ================= CLIENT SIGNUP ================= */
  const signupClient = async (formData) => {
    isLoading.value = true;
    try {
      const payload = { ...formData, role: 'Client' };
      const { data } = await authApi.signupClient(payload);

      if (data.accessToken) {
        setToken(data.accessToken);
        user.value = data.user;
        loggedIn.value = true;
      }

      return data;
    } finally {
      isLoading.value = false;
    }
  };

  /* ================= EXPERT SIGNUP ================= */
  const signupExpert = async (formData, isFormData = false) => {
    isLoading.value = true;
    try {
      let payload = formData;

      if (!isFormData) {
        payload = { ...formData, role: 'Expert' };
      }

      const { data } = await authApi.signupExpert(payload);

      if (data.accessToken) {
        setToken(data.accessToken);
        user.value = data.user;
        loggedIn.value = true;
      }

      return data;
    } finally {
      isLoading.value = false;
    }
  };

  /* ================= EXPOSE ================= */
  return {
    user,
    loggedIn,
    isLoading,
    isInitialized,
    userRole,
    userId,
    isClient,
    isExpert,
    isAdmin,
    isAuthenticated,
    initialize,
    setToken,
    login,
    logout,
    signupClient,
    signupExpert,
  };
});
