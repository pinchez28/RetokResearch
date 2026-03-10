<template>
  <div
    class="min-h-screen flex items-center justify-center bg-primary-900 text-primary-200 pt-[120px] pb-12 lg:pt-[140px] lg:pb-16"
  >
    <div
      class="w-full max-w-md bg-primary-800/70 backdrop-blur-xl border border-primary-700 rounded-3xl shadow-premium-dark p-10 space-y-6"
    >
      <div class="text-center space-y-2">
        <h2 class="text-4xl font-extrabold text-accent-400">Reset Password</h2>
        <p class="text-primary-300 text-lg">
          Enter your new password to regain access to your account.
        </p>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleReset" class="space-y-6">
        <div class="relative">
          <label class="block text-sm font-medium text-primary-300 mb-2">
            New Password
          </label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="New Password"
            class="input-dark w-full pr-12"
          />
          <button
            type="button"
            class="absolute right-3 top-10 text-primary-400 hover:text-accent-400"
            @click="showPassword = !showPassword"
          >
            <Eye v-if="!showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>

        <div class="relative">
          <label class="block text-sm font-medium text-primary-300 mb-2">
            Confirm Password
          </label>
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm Password"
            class="input-dark w-full pr-12"
          />
          <button
            type="button"
            class="absolute right-3 top-10 text-primary-400 hover:text-accent-400"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-accent-500 text-primary-900 font-bold py-3 rounded-xl hover:bg-accent-400 transition-all duration-300 shadow-float-md flex items-center justify-center gap-2"
        >
          <Loader v-if="loading" class="animate-spin w-5 h-5" />
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <router-link
        :to="{ name: 'Login' }"
        class="block text-center text-accent-400 hover:text-accent-300 font-semibold mt-2"
      >
        ← Back to Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { Loader, Eye, EyeOff } from 'lucide-vue-next';
import { authApi } from '@/core/api/http.js';

const route = useRoute();
const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// Extract token from URL
const token = ref('');
onMounted(() => {
  token.value = route.params.token || '';
});

const handleReset = async () => {
  if (!password.value || !confirmPassword.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please enter both password fields.',
    });
  }

  if (password.value !== confirmPassword.value) {
    return Swal.fire({
      icon: 'error',
      title: 'Passwords Mismatch',
      text: 'New password and confirmation do not match.',
    });
  }

  loading.value = true;

  try {
    await authApi.resetPassword({
      token: token.value,
      password: password.value,
    });

    await Swal.fire({
      icon: 'success',
      title: 'Password Reset Successful',
      text: 'You can now log in with your new password.',
    });

    router.push({ name: 'Login' });
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Reset Failed',
      text: err.response?.data?.message || 'Unable to reset password.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-dark {
  @apply w-full px-4 py-3
         rounded-xl
         bg-primary-900
         border border-primary-700
         text-primary-200
         placeholder-primary-400
         outline-none
         transition-all duration-300;
}

.input-dark:focus {
  @apply border-accent-500 shadow-inner-glow;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
