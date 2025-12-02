<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
      <h2 class="text-3xl font-extrabold text-gray-800 text-center">
        Welcome Back
      </h2>
      <p class="text-sm text-gray-500 text-center">
        Sign in to your account to request and track research services.
      </p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="you@example.com"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="••••••••"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
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
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Login</span>
        </button>

        <p class="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?
          <router-link to="/signup/client" class="text-blue-600 hover:underline"
            >Signup</router-link
          >
        </p>

        <router-link
          :to="{ name: 'Home' }"
          class="block text-center text-gray-500 mt-2"
        >
          Back to Home
        </router-link>
      </form>
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

const handleLogin = async () => {
  error.value = '';
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.';
    return;
  }

  loading.value = true;

  try {
    // Send request to backend login endpoint
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    // Save JWT and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
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
