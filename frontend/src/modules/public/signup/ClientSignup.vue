<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row bg-primary-900 text-primary-200 py-12 sm:py-20 px-4 sm:px-6 lg:px-28"
  >
    <!-- LEFT PANEL (Illustration) -->
    <div
      class="hidden lg:flex lg:w-1/2 sticky top-24 h-[calc(100vh-6rem)] bg-primary-800/60 backdrop-blur-xl border border-primary-700 rounded-l-3xl shadow-premium-dark flex-col justify-start items-center pt-12 px-10 space-y-6"
    >
      <h1 class="text-4xl lg:text-5xl font-extrabold text-accent-400">
        Join as Client
      </h1>

      <p class="text-primary-300 text-lg text-center max-w-md">
        Sign up to request research services and track your projects
        effortlessly.
      </p>

      <Vue3Lottie
        :animationData="signupAnimation"
        :loop="true"
        :speed="0.85"
        class="w-[420px] max-w-full opacity-90 lottie-float"
      />
    </div>

    <!-- FORM CARD -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div
        class="w-full max-w-3xl bg-primary-800/70 backdrop-blur-xl border border-primary-700 rounded-3xl shadow-premium-dark p-10 space-y-6"
      >
        <!-- Heading -->
        <div class="text-center space-y-2">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-accent-400">
            Client Signup
          </h1>
          <p class="text-primary-300 text-sm sm:text-base">
            Create your account to start requesting research services.
          </p>
        </div>

        <!-- FORM -->
        <form
          @submit.prevent="handleSignup"
          class="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <!-- Name -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Name
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="John Doe"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Email -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Phone -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Phone
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="+254 700 000000"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Password -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Confirm Password -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Confirm Password
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="col-span-1 sm:col-span-2 text-red-400 text-center text-sm"
          >
            {{ error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="col-span-1 sm:col-span-2 w-full bg-accent-500 text-primary-900 font-bold py-3 rounded-xl hover:bg-accent-400 transition-all duration-300 shadow-float-md disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <Loader v-if="loading" class="animate-spin w-5 h-5" />
            {{ loading ? 'Signing up...' : 'Sign Up' }}
          </button>

          <!-- Login Link -->
          <p
            class="col-span-1 sm:col-span-2 text-sm text-primary-300 text-center"
          >
            Already have an account?
            <router-link
              to="/login"
              class="text-accent-400 hover:underline font-semibold"
            >
              Login
            </router-link>
          </p>
        </form>

        <!-- Back Home -->
        <router-link
          to="/"
          class="block text-center text-accent-400 hover:text-accent-300 mt-4 font-semibold"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/core/store/auth.js';
import { Loader } from 'lucide-vue-next';
import { Vue3Lottie } from 'vue3-lottie';
import signupAnimation from '@/assets/animations/client-signup-animation.json';

const ClientIllustration = new URL(
  '@/assets/images/client-signup-illustration.png',
  import.meta.url,
).href;

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

const handleSignup = async () => {
  error.value = '';

  if (
    !form.value.name ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.password ||
    !form.value.confirmPassword
  ) {
    error.value = 'Please fill all required fields.';
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;

  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
    };

    const data = await authStore.signupClient(payload);

    if (data?.accessToken && data?.user) {
      router.push('/client/dashboard');
    } else {
      error.value = data?.message || 'Signup failed. Please try again.';
    }
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Signup failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 2px solid #d1d5db;
  outline: none;
  background-color: white;
  font-weight: 500;
}
.input:focus {
  border-color: #26c506;
  box-shadow: 0 0 0 3px rgba(38, 197, 6, 0.2);
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
