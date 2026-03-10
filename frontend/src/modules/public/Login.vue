<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-primary-900 text-primary-200 pt-[120px] pb-12 lg:pt-[140px] lg:pb-16"
  >
    <!-- LEFT PANEL -->
    <div
      class="hidden md:flex md:w-1/2 sticky top-[120px] h-[calc(100vh-160px)] bg-primary-800/60 backdrop-blur-xl border-r border-primary-700 flex-col justify-between items-center px-12 py-12"
    >
      <div class="text-center space-y-4 max-w-md">
        <h1 class="text-5xl font-extrabold text-accent-400">Welcome Back</h1>
        <p class="text-primary-200 text-2xl">
          Sign in to request and track research services seamlessly.
        </p>
      </div>

      <div
        class="flex-1 w-full flex items-center justify-center overflow-hidden"
      >
        <Vue3Lottie
          :animationData="loginAnimation"
          :loop="true"
          :speed="0.65"
          class="w-full max-w-[420px] h-auto"
        />
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div
        class="w-full max-w-xl bg-primary-800/70 backdrop-blur-xl border border-primary-700 rounded-3xl shadow-premium-dark p-10 space-y-6"
      >
        <div class="text-center space-y-2">
          <h2 class="text-4xl font-extrabold text-accent-400">Sign In</h2>
          <p class="text-primary-300 text-2xl">
            Access your account and manage your research services.
          </p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- EMAIL -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2"
              >Email</label
            >
            <input
              v-model="email"
              type="email"
              placeholder="Email Address"
              class="input-dark w-full text-primary-900"
              @keyup.enter="handleLogin"
            />
          </div>

          <!-- PASSWORD -->
          <div class="relative">
            <label class="block text-sm font-medium text-primary-300 mb-2"
              >Password</label
            >
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="input-dark w-full text-primary-900 pr-12"
              @keyup.enter="handleLogin"
            />

            <!-- SHOW PASSWORD -->
            <button
              type="button"
              class="absolute right-3 top-10 text-primary-400 hover:text-accent-400"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>

            <!-- FORGOT PASSWORD -->
            <div class="text-right mt-2">
              <button
                type="button"
                @click="showForgotModal = true"
                class="text-sm text-accent-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <!-- LOGIN BUTTON -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-accent-500 text-primary-900 font-bold py-3 rounded-xl hover:bg-accent-400 transition-all duration-300 shadow-float-md flex items-center justify-center gap-2"
          >
            <Loader v-if="loading" class="animate-spin w-5 h-5" />
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <!-- SIGNUP -->
        <div class="text-center text-sm text-primary-300 mt-4">
          Don't have an account?
          <button
            @click="showSignupModal = true"
            class="text-accent-400 hover:underline font-semibold"
          >
            Signup
          </button>
        </div>

        <!-- BACK -->
        <router-link
          :to="{ name: 'Home' }"
          class="block text-center text-accent-400 hover:text-accent-300 font-semibold mt-2"
        >
          ← Back to Home
        </router-link>

        <!-- SIGNUP ROLE MODAL -->
        <transition name="fade">
          <div
            v-if="showSignupModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div
              class="bg-primary-800 border border-primary-700 rounded-3xl shadow-premium-dark w-full max-w-md p-8 space-y-6 relative"
            >
              <button
                @click="showSignupModal = false"
                class="absolute top-4 right-4 text-primary-400 hover:text-accent-400 text-xl"
              >
                ✕
              </button>

              <div class="text-center space-y-2">
                <h3 class="text-2xl font-extrabold text-accent-400">
                  Create Account As
                </h3>
                <p class="text-primary-300 text-sm">
                  Choose your role to continue
                </p>
              </div>

              <div class="space-y-4">
                <button
                  @click="redirectToSignup('client')"
                  class="w-full flex items-center justify-center gap-3 bg-primary-900 border border-primary-700 py-3 rounded-xl hover:border-accent-500 transition-all duration-300"
                >
                  <User class="w-5 h-5 text-accent-400" />
                  <span class="font-semibold">Sign up as Client</span>
                </button>

                <button
                  @click="redirectToSignup('expert')"
                  class="w-full flex items-center justify-center gap-3 bg-primary-900 border border-primary-700 py-3 rounded-xl hover:border-accent-500 transition-all duration-300"
                >
                  <Briefcase class="w-5 h-5 text-accent-400" />
                  <span class="font-semibold">Sign up as Expert</span>
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- FORGOT PASSWORD MODAL -->
        <transition name="fade">
          <div
            v-if="showForgotModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div
              class="bg-primary-800 border border-primary-700 rounded-3xl shadow-premium-dark w-full max-w-md p-8 space-y-6 relative"
            >
              <button
                @click="showForgotModal = false"
                class="absolute top-4 right-4 text-primary-400 hover:text-accent-400 text-xl"
              >
                ✕
              </button>

              <h3 class="text-2xl font-bold text-accent-400 text-center">
                Reset Password
              </h3>

              <p class="text-primary-300 text-sm text-center">
                Enter your email to receive a password reset link.
              </p>

              <input
                v-model="forgotEmail"
                type="email"
                placeholder="Email Address"
                class="input-dark w-full"
              />

              <button
                @click="handleForgotPassword"
                class="w-full bg-accent-500 text-primary-900 font-bold py-3 rounded-xl hover:bg-accent-400 transition-all duration-300"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/core/store/auth.js';
import { Loader, User, Briefcase, Eye, EyeOff } from 'lucide-vue-next';
import { Vue3Lottie } from 'vue3-lottie';
import loginAnimation from '@/assets/animations/login-animation.json';
import { authApi } from '@/core/api/http.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showSignupModal = ref(false);

/* Forgot password */
const showForgotModal = ref(false);
const forgotEmail = ref('');

onMounted(() => {
  email.value = route.query.email || '';
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Credentials',
      text: 'Please enter both email and password.',
    });
  }

  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    const user = authStore.user;

    if (user.role === 'Expert' && user.profile?.status !== 'approved') {
      await Swal.fire({
        icon: 'info',
        title: 'Account Pending Approval',
        text: 'Your Expert account is pending admin approval.',
      });
      return;
    }

    if (user.role === 'Admin') router.push('/admin');
    else if (user.role === 'Client') router.push('/client');
    else if (user.role === 'Expert') router.push('/expert');
    else router.push('/');
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: err.response?.data?.message || 'Login failed. Please try again.',
    });
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = async () => {
  if (!forgotEmail.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Email',
      text: 'Please enter your email.',
    });
  }

  try {
    await authApi.forgotPassword({ email: forgotEmail.value });

    showForgotModal.value = false;

    await Swal.fire({
      icon: 'success',
      title: 'Reset Link Sent',
      text: 'Check your email for the password reset link.',
    });
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Failed to send reset email.',
    });
  }
};

const redirectToSignup = (role) => {
  showSignupModal.value = false;
  if (role === 'client') router.push('/signup/client');
  if (role === 'expert') router.push('/signup/expert');
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
