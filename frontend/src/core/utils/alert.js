// core/store/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/core/api/http.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const loggedIn = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  // ADD THIS: Track initialization state
  const isInitialized = ref(false);

  // ---------------- Getters ----------------
  const userRole = computed(() => user.value?.role?.toLowerCase());
  const userId = computed(() => user.value?._id);
  const isClient = computed(() => user.value?.role?.toLowerCase() === 'client');
  const isExpert = computed(() => user.value?.role?.toLowerCase() === 'expert');
  const isAdmin = computed(() => user.value?.role?.toLowerCase() === 'admin');
  const isAuthenticated = computed(
    () => loggedIn.value && token.value !== null
  );

  // ---------------- Safe Initialization ----------------
  const initialize = () => {
    try {
      console.log('Auth store: Initializing from localStorage...');

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        console.log('Found stored auth data');
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        loggedIn.value = true;

        console.log('Auth initialized:', {
          userRole: user.value?.role,
          isAuthenticated: isAuthenticated.value,
        });
      } else {
        console.log('No stored auth data found');
      }
    } catch (err) {
      console.error('Failed to parse auth from localStorage:', err);
      clearAuth();
    } finally {
      // CRITICAL: Mark initialization as complete
      isInitialized.value = true;
      console.log('Auth store initialization complete');
    }
  };

  // ---------------- Set Auth (internal) ----------------
  const setAuth = (userData, tokenData) => {
    console.log('Setting auth...');

    // Normalize role
    const normalizedUser = {
      ...userData,
      role: userData.role?.toLowerCase(),
    };

    // Update reactive properties
    user.value = normalizedUser;
    token.value = tokenData;
    loggedIn.value = true;

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', tokenData);

    // Mark as initialized
    isInitialized.value = true;

    console.log('Auth set successfully:', {
      userRole: normalizedUser.role,
      isAuthenticated: true,
    });
  };

  // ---------------- Clear Auth ----------------
  const clearAuth = () => {
    console.log('Clearing auth...');
    user.value = null;
    token.value = null;
    loggedIn.value = false;
    isInitialized.value = true; // Still mark as initialized
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ---------------- Client Signup (IMPROVED) ----------------
  const signupClient = async (clientData) => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log('Signing up client...');
      const { data } = await api.post('/auth/clients/signup', clientData);

      if (data.token && data.user) {
        console.log('Signup successful, setting auth...');
        setAuth(data.user, data.token);

        // IMPORTANT: Return a promise that ensures auth is ready
        return new Promise((resolve) => {
          const checkAuth = () => {
            if (isAuthenticated.value && isInitialized.value) {
              console.log('Auth confirmed ready');
              resolve(data);
            } else {
              setTimeout(checkAuth, 10);
            }
          };
          checkAuth();
        });
      }

      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Client signup failed';
      console.error('Signup error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ---------------- Expert Signup ----------------
  const signupExpert = async (expertData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const formData = new FormData();

      // Add all fields to FormData
      Object.keys(expertData).forEach((key) => {
        if (key === 'certifications' && Array.isArray(expertData[key])) {
          formData.append(key, JSON.stringify(expertData[key]));
        } else if (key === 'photo' && expertData[key] instanceof File) {
          formData.append(key, expertData[key]);
        } else {
          formData.append(key, expertData[key]);
        }
      });

      console.log('👨‍🏫 Expert signup started...');
      const { data } = await api.post('/auth/experts/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data; // Returns: { message, status: 'pending_admin_review' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Expert signup failed';
      console.error('❌ Expert signup error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ---------------- Login ----------------
  const login = async (credentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log('🔐 Login started...');
      const { data } = await api.post('/auth/login', credentials);

      if (data.token && data.user) {
        console.log('✅ Login successful, setting auth...');
        setAuth(data.user, data.token);

        // Wait for reactive updates
        return new Promise((resolve) => {
          const checkAuth = () => {
            if (isAuthenticated.value && isInitialized.value) {
              console.log('🔒 Auth ready after login');
              resolve(data);
            } else {
              setTimeout(checkAuth, 10);
            }
          };
          checkAuth();
        });
      }

      return data;
    } catch (err) {
      // Handle expert pending approval
      if (err.response?.data?.status === 'pending_admin_review') {
        error.value =
          'Your expert account is pending admin approval. Please wait.';
      } else {
        error.value = err.response?.data?.message || 'Login failed';
      }
      console.error('❌ Login error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ---------------- Logout ----------------
  const logout = async () => {
    try {
      isLoading.value = true;

      // Call logout API
      await api.post('/auth/logout');
      console.log('👋 Logout successful');
    } catch (err) {
      console.log(
        '⚠️ Logout API error (still clearing local auth):',
        err.message
      );
    } finally {
      clearAuth();
      isLoading.value = false;
    }
  };

  // ---------------- Get Current User ----------------
  const getCurrentUser = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data } = await api.get('/auth/me');

      if (data.user) {
        user.value = {
          ...data.user,
          role: data.user.role?.toLowerCase(),
        };
        localStorage.setItem('user', JSON.stringify(user.value));
        console.log('👤 Current user loaded:', user.value);
      }

      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to get user data';

      // If unauthorized, clear auth
      if (err.response?.status === 401) {
        clearAuth();
      }

      console.error('❌ Get current user error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ---------------- Verify Token ----------------
  const verifyToken = async () => {
    if (!token.value) return false;

    try {
      const { data } = await api.get('/auth/verify');
      return data.valid === true;
    } catch (err) {
      // If unauthorized, clear auth
      if (err.response?.status === 401) {
        clearAuth();
      }
      return false;
    }
  };

  // ---------------- Check if Expert is Approved ----------------
  const isExpertApproved = async () => {
    if (!isExpert.value) return true;

    try {
      const { data } = await api.get('/auth/me');

      if (data.user?.profile?.status === 'approved') {
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Failed to check expert approval:', err);
      return false;
    }
  };

  // Return everything
  return {
    // State
    user,
    token,
    loggedIn,
    isLoading,
    error,
    isInitialized, // Add this

    // Getters
    userRole,
    userId,
    isClient,
    isExpert,
    isAdmin,
    isAuthenticated,

    // Actions
    initialize,
    signupClient,
    signupExpert, // Add this back
    login,
    logout,
    getCurrentUser,
    verifyToken,
    isExpertApproved,
  };
});
