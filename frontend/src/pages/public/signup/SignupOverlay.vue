<template>
  <div>
    <!-- Overlay background -->
    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
      @click="closeOverlay"
    >
      <!-- Modal container -->
      <div
        class="relative p-10 rounded-2xl w-96 max-w-[90%] text-center shadow-2xl transform transition-transform hover:scale-105 bg-transparent"
        @click.stop
      >
        <h2 class="text-3xl font-extrabold text-white mb-4">Join us as:</h2>

        <!-- Buttons -->
        <button
          @click="selectRole('client')"
          class="w-full py-4 mb-4 text-xl font-bold text-white rounded-xl shadow-2xl transform hover:-translate-y-1 hover:shadow-3xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
        >
          Client
        </button>

        <button
          @click="selectRole('expert')"
          class="w-full py-4 mb-4 text-xl font-bold text-white rounded-xl shadow-2xl transform hover:-translate-y-1 hover:shadow-3xl transition-all duration-300 bg-green-600 hover:bg-green-700"
        >
          Service Provider
        </button>

        <button
          @click="closeOverlay"
          class="mt-2 py-3 w-full text-white/90 underline hover:text-white hover:-translate-y-1 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const visible = ref(false);
const router = useRouter();

const openOverlay = () => {
  visible.value = true;
};

const closeOverlay = () => {
  visible.value = false;
};

const selectRole = (role) => {
  visible.value = false;
  if (role === 'client') router.push('/signup/client');
  else if (role === 'expert') router.push('/signup/expert');
};

// Expose globally
window.openSignupOverlay = openOverlay;
</script>

<style scoped>
.fixed {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
