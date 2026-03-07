// core/utils/routerGuards.js
import { useAuthStore } from '@/core/store/auth.js';
import api from '@/core/api/http.js';
import { waitForAuth } from './authUtils.js';
import {
  JOB_STATUS,
  getJobRedirectPath,
  canViewApplications,
} from './jobStatus.js';

/**
 * Meta field guard processor - UPDATED to ensure auth store is ready
 */
export const processRouteMeta = async (to, from, next) => {
  console.log('🧭 Router guard started for:', to.path);

  const authStore = useAuthStore();

  // Initialize auth store if it hasn't been initialized yet
  if (!authStore.isInitialized) {
    console.log('🔄 Initializing auth store...');
    authStore.initialize();
  }

  // Wait for auth store to be fully initialized
  console.log('⏳ Waiting for auth initialization...');
  await waitForAuth(authStore, 500); // Wait up to 500ms

  console.log('🔐 Auth state:', {
    isInitialized: authStore.isInitialized,
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.userRole,
  });

  const meta = to.meta || {};

  // Check authentication requirement
  if (meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }

    // Check role requirement - compare lowercase
    if (
      meta.roles &&
      meta.roles.length > 0 &&
      !meta.roles.includes(authStore.userRole)
    ) {
      console.log(`🚫 Role '${authStore.userRole}' not allowed for this route`);
      // Redirect to appropriate dashboard
      const redirectPath = authStore.userRole
        ? `/${authStore.userRole}/dashboard`
        : '/';
      next(redirectPath);
      return;
    }
  }

  // Check guest-only routes
  if (meta.requiresGuest && authStore.isAuthenticated) {
    console.log('👤 Already authenticated, redirecting to dashboard');
    const redirectPath = authStore.userRole
      ? `/${authStore.userRole}/dashboard`
      : '/';
    next(redirectPath);
    return;
  }

  console.log('✅ Access granted');
  next();
};

// The rest of your routerGuards.js remains the same...
// [Keep all other functions as they were]
