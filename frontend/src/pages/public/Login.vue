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

        <div class="flex justify-between items-center text-sm text-blue-700">
          <router-link :to="{ name: 'ForgotPassword' }"
            >Forgot password?</router-link
          >
        </div>

        <button
          type="submit"
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all duration-300"
        >
          Login
        </button>

        <p class="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?
          <router-link to="/signup" class="text-blue-600 hover:underline"
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
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');

const handleLogin = () => {
  if (!email.value || !password.value) return;

  const redirectTo = route.query.redirect || '/';
  router.push(redirectTo);
};
</script>

<style scoped>
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
