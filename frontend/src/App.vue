<template>
  <div id="app">
    <router-view />
    <Toaster richColors />
    <SignupOverlay ref="signupOverlay" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import SignupOverlay from '@/modules/public/signup/SignupOverlay.vue';
import { connectSocket, joinRoom, disconnectSocket } from '@/core/api/socket';
import { useNotificationStore } from '@/core/store/notificationStore';
import { useAuthStore } from '@/core/store/auth';

const signupOverlay = ref(null);
const authStore = useAuthStore();
const notifStore = useNotificationStore();

window.openSignupOverlay = () => {
  signupOverlay.value?.openOverlay();
};

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      connectSocket();
      joinRoom();

      notifStore.loadNotifications();
      notifStore.initSocket(authStore.user.role);
    } else {
      disconnectSocket();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  disconnectSocket();
});
</script>
