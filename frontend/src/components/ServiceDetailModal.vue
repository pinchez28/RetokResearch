<template>
  <transition name="fade">
    <div
      v-if="visible && service"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative overflow-y-auto"
        style="max-height: 90vh"
      >
        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <!-- Service Info -->
        <h2
          class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-wide"
        >
          {{ service.title }}
        </h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed tracking-wide">
          {{ service.fullDescription }}
        </p>

        <!-- Included features -->
        <ul
          class="list-disc list-inside space-y-2 text-gray-700 text-lg tracking-wide mb-6"
        >
          <li v-for="(item, index) in service.includes" :key="index">
            {{ item }}
          </li>
        </ul>

        <!-- CTA Section -->
        <div
          class="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
        >
          <p class="text-lg md:text-xl text-blue-900 mb-4 tracking-wide">
            You can request this research service and track your assignment
            until completion.
          </p>
          <button
            @click="handleRequest"
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Request This Research
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
  visible: Boolean,
  service: {
    type: Object,
    default: () => ({}),
  },
});

const router = useRouter();

// MOCK: replace with real auth logic
const isLoggedIn = false;

const handleRequest = () => {
  if (!service || !service.title) return;

  // Since no client yet, always redirect to login/signup
  router.push({
    name: 'Login', // your public login route
    query: {
      // Later you can use this to redirect after login
      redirect: '/client/post-assignment',
      service: service.title, // optional: prefill service
    },
  });
};
</script>

<style scoped>
/* Fade-in transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Optional: Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
