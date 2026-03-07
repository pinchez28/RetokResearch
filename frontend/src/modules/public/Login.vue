<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-primary-900 text-primary-200 pt-[120px] pb-12 lg:pt-[140px] lg:pb-16"
  >
    <!-- LEFT PANEL -->
    <div
      class="hidden md:flex md:w-1/2 sticky top-[120px] h-[calc(100vh-160px)] bg-primary-800/60 backdrop-blur-xl border-r border-primary-700 flex-col justify-between items-center px-12 py-12"
    >
      <!-- TEXT -->
      <div class="text-center space-y-4 max-w-md">
        <h1 class="text-5xl font-extrabold text-accent-400">Welcome Back</h1>

        <p class="text-primary-200 text-lg">
          Sign in to request and track research services seamlessly. Access
          top-tier research experts and manage projects effortlessly.
        </p>
      </div>

      <!-- IMAGE -->
      <!-- ANIMATED ILLUSTRATION -->
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
          <p class="text-primary-300 text-sm sm:text-base">
            Access your account and manage your research services.
          </p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- EMAIL -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- ERROR -->
          <div v-if="error" class="text-red-400 text-sm text-center">
            {{ error }}
          </div>

          <!-- LOGIN BUTTON -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-accent-500 text-primary-900 font-bold py-3 rounded-xl hover:bg-accent-400 transition-all duration-300 shadow-float-md"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Login</span>
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
              <!-- Close Button -->
              <button
                @click="showSignupModal = false"
                class="absolute top-4 right-4 text-primary-400 hover:text-accent-400 text-xl"
              >
                ✕
              </button>

              <!-- Title -->
              <div class="text-center space-y-2">
                <h3 class="text-2xl font-extrabold text-accent-400">
                  Create Account As
                </h3>
                <p class="text-primary-300 text-sm">
                  Choose your role to continue
                </p>
              </div>

              <!-- Options -->
              <div class="space-y-4">
                <!-- Client -->
                <button
                  @click="redirectToSignup('client')"
                  class="w-full flex items-center justify-center gap-3 bg-primary-900 border border-primary-700 py-3 rounded-xl hover:border-accent-500 transition-all duration-300"
                >
                  <User class="w-5 h-5 text-accent-400" />
                  <span class="font-semibold">Sign up as Client</span>
                </button>

                <!-- Expert -->
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/core/store/auth.js';
import { Loader, User, Briefcase } from 'lucide-vue-next';
import { Vue3Lottie } from 'vue3-lottie';
import loginAnimation from '@/assets/animations/login-animation.json';

const router = useRouter();
const authStore = useAuthStore();

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
    await authStore.login({ email: email.value, password: password.value });

    const user = authStore.user;

    if (user.role === 'Expert' && user.profile?.status !== 'approved') {
      await Swal.fire({
        icon: 'info',
        title: 'Account Pending Approval',
        text: 'Your Expert account is pending admin approval. You will be able to login once approved.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    switch (user.role) {
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
    if (err.response?.status === 403) {
      await Swal.fire({
        icon: 'info',
        title: 'Account Pending Approval',
        text:
          err.response.data.message ||
          'Your account is pending admin approval.',
        confirmButtonText: 'Ok',
      });
    } else {
      error.value =
        err.response?.data?.message || 'Login failed. Please try again.';
    }
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
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 1rem;
  border: 2px solid #d1d5db;
  outline: none;
  background-color: #f9fafb;
  font-weight: 500;
  transition: all 0.3s;
}
.input:focus {
  border-color: #26c506;
  box-shadow: 0 0 0 4px rgba(38, 197, 6, 0.2);
}

/* LEFT PANEL SLIDE IN */
.left-panel-animate {
  animation: slideInLeft 0.9s ease-out forwards;
  opacity: 0;
}
@keyframes slideInLeft {
  from {
    transform: translateX(-60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* RIGHT PANEL SLIDE IN */
.form-panel-animate {
  animation: slideInRight 0.9s ease-out forwards;
  opacity: 0;
}
@keyframes slideInRight {
  from {
    transform: translateX(60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* STAGGER FADE UP */
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease forwards;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}
.delay-3 {
  animation-delay: 0.6s;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* FLOATING IMAGE */
.floating-illustration {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
