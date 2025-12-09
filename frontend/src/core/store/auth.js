import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const loggedIn = ref(false);

  // Initialize from localStorage
  const initialize = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
      loggedIn.value = true;
    }
  };

  const login = (userData, tokenData) => {
    user.value = userData;
    token.value = tokenData;
    loggedIn.value = true;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    loggedIn.value = false;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return { user, token, loggedIn, initialize, login, logout };
});

