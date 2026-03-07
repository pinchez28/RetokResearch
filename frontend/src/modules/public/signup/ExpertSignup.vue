<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row bg-primary-900 text-primary-200 py-12 sm:py-20 px-4 sm:px-6 lg:px-28"
  >
    <!-- LEFT PANEL -->
    <div
      class="hidden lg:flex lg:w-1/2 sticky top-24 h-[calc(100vh-6rem)] bg-primary-800/60 backdrop-blur-xl border border-primary-700 rounded-l-3xl shadow-premium-dark flex-col justify-start items-center pt-12 px-10 space-y-6"
    >
      <h1 class="text-4xl lg:text-5xl font-extrabold text-accent-400">
        Join as a Reserch Expert
      </h1>

      <p class="text-primary-300 text-lg text-center">
        Sign up to collaborate and earn by providing research services
        seamlessly.
      </p>

      <div
        class="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] max-w-full opacity-90 lottie-float"
      >
        <Vue3Lottie
          :animationData="signupAnimation"
          :loop="true"
          :speed="0.85"
          class="w-[320px] max-w-full opacity-90 lottie-float"
        />
      </div>
    </div>

    <!-- FORM CARD -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div
        class="max-w-3xl w-full bg-primary-800/70 backdrop-blur-xl border border-primary-700 rounded-3xl shadow-premium-dark p-10 space-y-6"
      >
        <!-- Heading -->
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-extrabold text-accent-400">
            Service Provider Signup
          </h1>
          <p class="text-primary-300 text-sm sm:text-base">
            Join our platform to collaborate and earn on research projects.
          </p>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="handleSignup"
          enctype="multipart/form-data"
          class="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              User Name
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              required
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              required
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
              placeholder="+254 700 000000"
              required
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Profile Photo -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              class="file-input-dark"
              required
            />
          </div>

          <!-- CV Upload -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              CV / Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              @change="handleCVUpload"
              class="file-input-dark"
              required
            />
          </div>

          <!-- Specialization -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Specialization
            </label>
            <input
              v-model="form.specialization"
              type="text"
              placeholder="Data Science"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Experience -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Experience (yrs)
            </label>
            <input
              v-model.number="form.experience"
              type="number"
              min="0"
              placeholder="5"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Education -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Education
            </label>
            <input
              v-model="form.education"
              type="text"
              placeholder="BSc Computer Science"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Certifications -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Certifications
            </label>
            <input
              v-model="form.certifications"
              type="text"
              placeholder="Comma separated e.g., AWS, PMP"
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Bio -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Bio
            </label>
            <textarea
              v-model="form.bio"
              rows="3"
              placeholder="Short professional bio"
              class="input-dark w-full text-primary-900"
            ></textarea>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
              class="input-dark w-full text-primary-900"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Confirm Password
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              required
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
            <span v-if="loading" class="flex items-center gap-2">
              <Loader class="animate-spin w-5 h-5" />
              Signing up...
            </span>
            <span v-else>Sign Up</span>
          </button>

          <!-- Login link -->
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
          :to="{ name: 'Home' }"
          class="block text-center text-accent-400 hover:text-accent-300 mt-4 font-semibold"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
/* ✅ YOUR ORIGINAL SCRIPT — UNCHANGED */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/core/api/http.js';
import Swal from 'sweetalert2';
import { Loader } from 'lucide-vue-next';

import { Vue3Lottie } from 'vue3-lottie';
import signupAnimation from '@/assets/animations/expert-signup-animation.json';

const ExpertIllustration = new URL(
  '@/assets/images/expert-signup-illustration.png',
  import.meta.url,
).href;

const router = useRouter();
const form = ref({
  name: '',
  email: '',
  phone: '',
  photo: null,
  cvPdf: null,
  specialization: '',
  bio: '',
  experience: 0,
  education: '',
  certifications: '',
  password: '',
  confirmPassword: '',
});
const loading = ref(false);
const error = ref('');

const handlePhotoUpload = (e) => {
  form.value.photo = e.target.files[0] || null;
};
const handleCVUpload = (e) => {
  form.value.cvPdf = e.target.files[0] || null;
};

const handleSignup = async () => {
  error.value = '';

  const requiredFields = [
    'name',
    'email',
    'phone',
    'photo',
    'cvPdf',
    'password',
    'confirmPassword',
  ];
  for (const f of requiredFields)
    if (!form.value[f]) {
      error.value = 'Please fill all required fields.';
      return;
    }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Password and Confirm Password must match.';
    return;
  }

  loading.value = true;

  try {
    const payload = new FormData();
    payload.append('role', 'Expert');
    payload.append('name', form.value.name);
    payload.append('email', form.value.email);
    payload.append('phone', form.value.phone);
    payload.append('password', form.value.password);
    payload.append('specialization', form.value.specialization);
    payload.append('bio', form.value.bio);
    payload.append('experience', Number(form.value.experience));
    payload.append('education', form.value.education);

    if (form.value.certifications) {
      form.value.certifications
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => payload.append('certifications[]', c));
    }

    payload.append('photo', form.value.photo);
    payload.append('cvPdf', form.value.cvPdf);

    const { data } = await authApi.signupExpert(payload, true);

    if (data.status === 'pending_admin_review') {
      await Swal.fire({
        icon: 'info',
        title: 'Signup Successful',
        html: 'Your account has been created! Admin approval is required before login.',
        confirmButtonText: 'OK',
      });
      router.push('/pending-approval');
    } else {
      error.value = data.message || 'Signup failed. Please try again.';
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

.file-input-dark {
  @apply w-full px-4 py-2
         rounded-xl
         bg-primary-900
         border border-primary-700
         text-primary-300
         cursor-pointer
         transition-all duration-300;
}

.file-input-dark:hover {
  @apply border-accent-500;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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
