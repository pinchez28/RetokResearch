<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row bg-primary-900 text-primary-200 py-12 sm:py-20 px-4 sm:px-6 lg:px-28"
  >
    <!-- LEFT PANEL -->
    <div
      class="hidden lg:flex lg:w-1/2 sticky top-24 h-[calc(100vh-6rem)] bg-primary-800/60 backdrop-blur-xl border border-primary-700 rounded-l-3xl shadow-premium-dark flex-col justify-start items-center pt-12 px-10 space-y-6"
    >
      <h1 class="text-4xl lg:text-5xl font-extrabold text-accent-400">
        Join as a Research Expert
      </h1>

      <p class="text-primary-300 text-2xl text-center">
        Sign up to collaborate and earn by providing research services seamlessly.
      </p>

      <Vue3Lottie
        :animationData="signupAnimation"
        :loop="true"
        :speed="0.85"
        class="w-[320px] max-w-full opacity-90 lottie-float"
      />
    </div>

    <!-- FORM CARD -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div
        class="max-w-3xl w-full bg-primary-800/70 backdrop-blur-xl border border-primary-700 rounded-3xl shadow-premium-dark p-10 space-y-6"
      >
        <!-- Heading -->
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-extrabold text-accent-400">Service Provider Signup</h1>
          <p class="text-primary-300 text-2xl">
            Join our platform to collaborate and earn on research projects. Create your
            professionl profile.
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
              placeholder="Username"
              required
              class="input-dark w-full"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-primary-300 mb-2"> Email </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email Address"
              required
              class="input-dark w-full"
            />
          </div>

          <!-- Phone -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2"> Phone </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="Phone Number"
              required
              class="input-dark w-full"
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
              placeholder="Specialization Skill"
              class="input-dark w-full"
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
              placeholder="0"
              class="input-dark w-full"
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
              placeholder="Top Level of Education"
              class="input-dark w-full"
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
              placeholder="Certifications"
              class="input-dark w-full"
            />
          </div>

          <!-- Bio -->
          <div class="col-span-1 sm:col-span-2">
            <label class="block text-sm font-medium text-primary-300 mb-2"> Bio </label>
            <AutoTextArea
              v-model="form.bio"
              placeholder="Full Biography"
              class="input-dark w-full"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              required
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

          <!-- Confirm Password -->
          <div class="relative">
            <label class="block text-sm font-medium text-primary-300 mb-2">
              Confirm Password
            </label>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm Password"
              required
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

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="col-span-1 sm:col-span-2 btn-primary"
          >
            <Loader v-if="loading" class="animate-spin w-5 h-5" />
            <span v-if="loading">Signing up...</span>
            <span v-else>Sign Up</span>
          </button>

          <!-- Login link -->
          <p class="col-span-1 sm:col-span-2 text-sm text-primary-300 text-center">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authApi } from "@/core/api/http.js";
import Swal from "sweetalert2";
import { Loader, Eye, EyeOff } from "lucide-vue-next";
import { Vue3Lottie } from "vue3-lottie";
import signupAnimation from "@/assets/animations/expert-signup-animation.json";
import AutoTextArea from "@/components/shared/AutoTextArea.vue";

const router = useRouter();
const loading = ref(false);

// Password toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Form state
const form = ref({
  name: "",
  email: "",
  phone: "",
  photo: null,
  cvPdf: null,
  specialization: "",
  bio: "",
  experience: 0,
  education: "",
  certifications: "",
  password: "",
  confirmPassword: "",
});

// File uploads
const handlePhotoUpload = (e) => {
  form.value.photo = e.target.files?.[0] || null;
};
const handleCVUpload = (e) => {
  form.value.cvPdf = e.target.files?.[0] || null;
};

// Signup handler
const handleSignup = async () => {
  const { name, email, phone, photo, cvPdf, password, confirmPassword } = form.value;

  // Required validation
  if (!name || !email || !phone || !photo || !cvPdf || !password || !confirmPassword) {
    return Swal.fire({
      icon: "warning",
      title: "Missing Required Fields",
      text: "Please fill all required fields.",
      confirmButtonColor: "#ECB365",
    });
  }

  if (password !== confirmPassword) {
    return Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "Password and Confirm Password must match.",
      confirmButtonColor: "#ECB365",
    });
  }

  loading.value = true;

  try {
    // Prepare payload
    const payload = new FormData();
    payload.append("role", "Expert");
    payload.append("name", name);
    payload.append("email", email);
    payload.append("phone", phone);
    payload.append("password", password);
    payload.append("specialization", form.value.specialization);
    payload.append("bio", form.value.bio);
    payload.append("experience", Number(form.value.experience));
    payload.append("education", form.value.education);

    if (form.value.certifications) {
      form.value.certifications
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => payload.append("certifications[]", c));
    }

    payload.append("photo", photo);
    payload.append("cvPdf", cvPdf);

    // API request
    const { data } = await authApi.signupExpert(payload, true);
    console.log("✅ Signup response:", data);

    if (data?.success) {
      // Show success Swal and wait for confirmation
      await Swal.fire({
        icon: "success",
        title: "Signup Successful",
        html:
          "Your account has been created successfully.<br><br>Please verify your email before login.",
        confirmButtonColor: "#ECB365",
      });

      // Redirect after user clicks OK
      router.push("/verify-email");
    } else {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: data?.message || "Signup failed. Please try again.",
        confirmButtonColor: "#ECB365",
      });
    }
  } catch (err) {
    console.error("❌ Signup Error:", err);
    console.error("❌ Response:", err.response?.data);

    Swal.fire({
      icon: "error",
      title: "Signup Failed",
      text:
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.",
      confirmButtonColor: "#ECB365",
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
