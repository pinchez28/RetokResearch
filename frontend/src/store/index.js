import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const role = ref('public'); // user role
  const loggedIn = ref(false); // whether user is logged in

  const setRole = (newRole) => {
    role.value = newRole;
  };
  const setLoggedIn = (status) => {
    loggedIn.value = status;
  };

  return { role, loggedIn, setRole, setLoggedIn };
});
