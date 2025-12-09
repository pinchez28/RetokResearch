<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 mt-10 mb -10 px-4"
  >
    <div
      class="bg-gray-900 text-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
    >
      <h2 class="text-3xl font-extrabold text-white text-center">
        Client Signup
      </h2>
      <p class="text-sm text-white text-center">
        Sign up to request and track research services.
      </p>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block mb-1 font-extrabold text-white">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="John Doe"
            class="input text-black"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-white"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="you@example.com"
            class="input text-black"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 font-extrabold text-white">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            required
            placeholder="+254 700 000000"
            class="input text-black"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-extrabold text-white">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Enter password"
            class="input text-black"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block mb-1 font-extrabold text-white"
            >Confirm Password</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm password"
            class="input text-black"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#FF8040] text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-[#0046FF] transition disabled:opacity-50 font-semibold"
        >
          <span v-if="loading">Signing up...</span>
          <span v-else>Sign Up</span>
        </button>

        <!-- Login link -->
        <div class="text-center mb-4 text-sm">
          Already have an account?
          <router-link
            to="/login"
            class="text-green-600 hover:underline font-semibold"
            >Login</router-link
          >
        </div>
      </form>

      <!-- Back to Home -->
      <div class="text-center mt-4 text-sm">
        <router-link to="/" class="text-yellow-500 hover:underline"
          >Back to Home</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

const role = 'Client'; // sent to backend

const handleSignup = async () => {
  error.value = '';

  // --- Frontend validation
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
    // --- Payload for backend
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      role,
    };

    const { data } = await axios.post(
      'http://localhost:4000/api/auth/clients/signup',
      payload
    );

    // --- Save token & user safely
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // --- Navigate to client dashboard
      router.push('/client');
    } else {
      error.value = 'Signup failed. Invalid server response.';
    }
  } catch (err) {
    console.error(err);

    // --- Safely read backend message
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Signup failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  background-color: #ffffff;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.input:focus {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #001bb7;
}
</style>

