import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/core/store/auth.js';

/**
 * Universal auth composable
 * Provides reactive access to the current user and role helpers
 */
export function useAuth() {
  const authStore = useAuthStore();

  // Pull reactive refs from the Pinia store
  const {
    user,
    userRole,
    userId,
    isClient,
    isExpert,
    isAdmin,
    isAuthenticated,
  } = storeToRefs(authStore);

  // Optional helpers
  const role = userRole;
  const id = userId;

  return {
    user,
    role,
    id,
    isClient,
    isExpert,
    isAdmin,
    isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
    initialize: authStore.initialize,
    signupClient: authStore.signupClient,
    signupExpert: authStore.signupExpert,
  };
}
