import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const role = ref('public'); // default: public user
  const setRole = (newRole) => {
    role.value = newRole;
  };

  return { role, setRole };
});
