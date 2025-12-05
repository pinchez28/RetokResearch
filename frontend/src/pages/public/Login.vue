<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F1DC] px-4">
    <div class="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
      <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-2">
        Welcome Back
      </h2>
      <p class="text-sm text-gray-500 text-center">
        Sign in to your account to request and track research services.
      </p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="you@example.com"
            class="input"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-900"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="••••••••"
            class="input"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#FF8040] hover:bg-[#0046FF] text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <!-- Sign Up link triggers modal -->
      <p class="text-sm text-gray-500 mt-4 text-center">
        Don't have an account?
        <button
          type="button"
          @click="showSignupModal = true"
          class="text-[#0046FF] hover:underline font-semibold"
        >
          Signup
        </button>
      </p>

      <router-link
        :to="{ name: 'Home' }"
        class="block text-center text-gray-500 mt-2"
      >
        Back to Home
      </router-link>
    </div>

    <!-- Signup Modal -->
    <div
      v-if="showSignupModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-lg p-6 w-80 text-center space-y-4"
      >
        <h3 class="text-xl font-bold text-gray-900">Sign up as:</h3>
        <div class="flex flex-col gap-3 mt-4">
          <button
            type="button"
            @click="redirectToSignup('client')"
            class="bg-[#FF8040] hover:bg-[#0046FF] text-white py-2 rounded-xl font-semibold transition"
          >
            Client
          </button>
          <button
            type="button"
            @click="redirectToSignup('expert')"
            class="bg-[#FF8040] hover:bg-[#0046FF] text-white py-2 rounded-xl font-semibold transition"
          >
            Service Provider
          </button>
        </div>
        <button
          type="button"
          @click="showSignupModal = false"
          class="mt-4 text-gray-500 hover:underline"
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
import api from '@/utils/api.js';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showSignupModal = ref(false);

const handleLogin = async () => {
  error.value = '';
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.';
    return;
  }

  loading.value = true;

  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    switch (data.user.role) {
      case 'Admin':
        router.push('/admin');
        break;
      case 'Client':
        router.push('/client');
        break;
      case 'Expert':
        router.push('/expert');
        break;
      default:
        router.push('/');
    }
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const redirectToSignup = (role) => {
  showSignupModal.value = false;
  if (role === 'client') router.push('/signup/client');
  if (role === 'expert') router.push('/signup/expert');
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  background-color: #f9fafb;
  transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
}
.input:focus {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
  background-color: #ffffff;
}

div.min-h-screen {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
