import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light');

  /**
   * Initialize theme for a specific user + role
   * Call this ONCE after login
   */
  const initTheme = (role, userId) => {
    if (!role || !userId) return;

    const key = `theme:${role}:${userId}`;
    theme.value = localStorage.getItem(key) || 'light';
  };

  /**
   * Toggle theme ONLY for the current user
   */
  const toggleTheme = (role, userId) => {
    if (!role || !userId) return;

    const key = `theme:${role}:${userId}`;
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem(key, theme.value);
  };

  return {
    theme,
    initTheme,
    toggleTheme,
  };
});
