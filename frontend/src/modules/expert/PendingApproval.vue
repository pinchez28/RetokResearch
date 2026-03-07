<!-- modules/expert/PendingApproval.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="w-20 h-20 mx-auto mb-6 text-yellow-500">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        Account Pending Approval
      </h1>

      <p class="text-gray-600 mb-6">
        Your expert account is currently being reviewed by our admin team. This
        process usually takes 24-48 hours. You'll be notified once your account
        is approved.
      </p>

      <div class="space-y-4">
        <button
          @click="logout"
          class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Logout
        </button>

        <button
          @click="refreshStatus"
          :disabled="loading"
          class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <span v-if="loading">Checking...</span>
          <span v-else>Check Approval Status</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/core/store/auth.js';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

const refreshStatus = async () => {
  try {
    loading.value = true;
    await authStore.getCurrentUser();

    // Check if approved now
    const isApproved = await authStore.isExpertApproved();
    if (isApproved) {
      router.push('/expert/dashboard');
    }
  } catch (error) {
    console.error('Failed to check status:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
