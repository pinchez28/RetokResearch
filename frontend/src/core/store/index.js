import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/core/api/http';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const role = ref('public');
  const loggedIn = ref(false);
  const loading = ref(false);

  // ✅ Fetch session from backend
  const fetchMe = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/auth/me');
      user.value = data.user;
      role.value = data.user.role;
      loggedIn.value = true;
    } catch {
      user.value = null;
      role.value = 'public';
      loggedIn.value = false;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Login (cookie already set by backend)
  const login = async () => {
    await fetchMe();
  };

  // ✅ Logout (backend clears cookie)
  const logout = async () => {
    await api.post('/auth/logout');
    user.value = null;
    role.value = 'public';
    loggedIn.value = false;
  };

  return {
    user,
    role,
    loggedIn,
    loading,
    fetchMe,
    login,
    logout,
  };
});
