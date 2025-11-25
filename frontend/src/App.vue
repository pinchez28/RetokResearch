<template>
  <div id="app">
    <!-- Main app content -->
    <router-view />

    <!-- Global Signup Overlay -->
    <SignupOverlay ref="signupOverlay" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SignupOverlay from '@/pages/public/signup/SignupOverlay.vue';

const signupOverlay = ref(null);

// Global function to open the overlay anywhere
window.openSignupOverlay = () => {
  signupOverlay.value?.openOverlay();
};
</script>
