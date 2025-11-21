<template>
  <header
    class="flex items-center justify-between h-16 px-4 sm:px-6 bg-[#001BB7] text-[#F5F1DC] shadow-md fixed top-0 left-0 right-0 z-50"
  >
    <!-- Section Title -->
    <div class="text-lg sm:text-xl md:text-2xl font-bold">
      {{ currentSection }}
    </div>

    <!-- User Actions -->
    <div class="flex items-center space-x-4">
      <!-- Notifications -->
      <button class="relative p-1 hover:bg-[#0046FF] rounded-full transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 sm:h-7 sm:w-7 text-[#F5F1DC]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3c0 .386-.149.735-.395 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          class="absolute -top-1 -right-1 w-2 h-2 bg-[#FF8040] rounded-full"
        ></span>
      </button>

      <!-- User Avatar / Lucid Icon -->
      <div class="flex items-center space-x-2">
        <img
          src="@/assets/images/logo.jpg"
          alt="Admin Avatar"
          class="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-[#0046FF]"
        />
        <span class="hidden sm:block font-medium">Admin</span>
      </div>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="bg-[#FF8040] hover:bg-[#FF9966] text-[#F5F1DC] px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold transition"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Compute current section title based on route path
const currentSection = computed(() => {
  if (route.path.startsWith('/admin/homepage')) return 'Homepage Management';
  if (route.path.startsWith('/admin/clients')) return 'Client Dashboard';
  if (route.path.startsWith('/admin/experts')) return 'Expert Dashboard';
  if (route.path.startsWith('/admin/settings')) return 'Admin Settings';
  return 'Admin Dashboard';
});

// Simple logout placeholder
const logout = () => {
  // Clear auth tokens / user session here
  console.log('Logging out...');
  router.push('/login');
};
</script>

<style scoped>
header {
  z-index: 50;
}

/* Responsive tweaks */
@media (max-width: 640px) {
  header {
    flex-wrap: wrap;
    justify-content: space-between;
    height: auto;
    padding: 0.5rem 1rem;
  }
}
</style>
