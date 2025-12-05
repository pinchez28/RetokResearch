<template>
  <!-- Signup Choice Modal -->
  <div
    v-if="showSignup"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    @click="closeOverlay"
  >
    <div
      class="relative p-12 rounded-2xl w-96 max-w-[90%] text-center shadow-2xl transform transition-transform hover:scale-105 bg-transparent"
      @click.stop
    >
      <h2 class="text-3xl font-extrabold text-white mb-6">Join us as:</h2>

      <button
        @click="selectRole('client')"
        class="w-full py-6 mb-6 text-2xl font-bold text-white rounded-xl shadow-2xl transition-all bg-blue-600 hover:bg-blue-700"
      >
        Client
      </button>

      <button
        @click="selectRole('expert')"
        class="w-full py-6 mb-6 text-2xl font-bold text-white rounded-xl shadow-2xl transition-all bg-green-600 hover:bg-green-700"
      >
        Service Provider
      </button>

      <button
        @click="closeOverlay"
        class="mt-2 py-4 w-full text-white/90 underline hover:text-white text-lg"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showSignup = ref(false);

const openSignupOverlay = () => (showSignup.value = true);
const closeOverlay = () => (showSignup.value = false);

const selectRole = (role) => {
  showSignup.value = false;
  if (role === 'client') router.push('/signup/client');
  else if (role === 'expert') router.push('/signup/expert');
};

// Expose globally so App.vue can call it
window.openSignupOverlay = openSignupOverlay;
</script>
