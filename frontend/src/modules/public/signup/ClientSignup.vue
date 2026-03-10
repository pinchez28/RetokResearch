<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row bg-primary-900 text-primary-200 py-12 sm:py-20 px-4 sm:px-6 lg:px-28"
  >
    <!-- LEFT PANEL -->
    <div
      class="hidden lg:flex lg:w-1/2 sticky top-24 h-[calc(100vh-6rem)] bg-primary-800/60 backdrop-blur-xl border border-primary-700 rounded-l-3xl shadow-premium-dark flex-col justify-start items-center pt-12 px-10 space-y-6"
    >
      <h1 class="text-4xl lg:text-5xl font-extrabold text-accent-400">
        Join as Client
      </h1>

      <p class="text-primary-300 text-center max-w-md text-2xl">
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
        class="w-full max-w-xl bg-primary-800/70 backdrop-blur-xl border border-primary-700 rounded-3xl shadow-premium-dark p-10 space-y-6"
      >
        <!-- Heading -->
        <div class="text-center space-y-2">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-accent-400">
            Client Signup
          </h1>
          <p class="text-primary-300 text-2xl">
            Create your account to start requesting research services.
          </p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleSignup" class="space-y-6">
          <!-- NAME -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              User Name
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Username"
              class="input-dark w-full"
            />
          </div>

          <!-- EMAIL -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="Email Address"
              class="input-dark w-full"
            />
          </div>

          <!-- PHONE -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Phone
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="Phone Number"
              class="input-dark w-full"
            />
          </div>

          <!-- PASSWORD -->
          <div class="relative">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Password"
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

          <!-- CONFIRM PASSWORD -->
          <div class="relative">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Confirm Password
            </label>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
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

          <!-- SUBMIT -->
          <button type="submit" :disabled="loading" class="btn-primary">
            <Loader v-if="loading" class="animate-spin w-5 h-5" />
            {{ loading ? 'Signing up...' : 'Sign Up' }}
          </button>

          <!-- LOGIN LINK -->
          <p class="text-sm text-primary-300 text-center">
            Already have an account?
            <router-link
              to="/login"
              class="text-accent-400 hover:underline font-semibold"
            >
              Login
            </router-link>
          </p>
        </form>

        <!-- BACK -->
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
import Swal from 'sweetalert2';
import { Loader, Eye, EyeOff } from 'lucide-vue-next';
import { Vue3Lottie } from 'vue3-lottie';
import signupAnimation from '@/assets/animations/client-signup-animation.json';

const router = useRouter();
const authStore = useAuthStore();

// Password toggle
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const loading = ref(false);

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const handleSignup = async () => {
  if (
    !form.value.name ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.password ||
    !form.value.confirmPassword
  ) {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill all required fields.',
    });
  }

  if (form.value.password !== form.value.confirmPassword) {
    return Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'Passwords do not match.',
    });
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

    if (data?.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'A verification email has been sent to your inbox.',
      });
      router.push('/verify-email');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: data?.message || 'Signup failed.',
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Signup Failed',
      text: err.response?.data?.message || 'Something went wrong.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Dark input fields like login page */
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

.btn-primary {
  @apply w-full bg-accent-500 text-primary-900 font-bold py-3 rounded-xl hover:bg-accent-400 transition-all duration-300 shadow-float-md flex justify-center items-center gap-2 disabled:opacity-50;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Floating Lottie */
.lottie-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
