<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-gray-50 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up as Client</h2>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="John Doe"
            class="input"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="input"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            required
            placeholder="+254 700 000000"
            class="input"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Enter password"
            class="input"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block mb-1 font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm password"
            class="input"
          />
        </div>

        <!-- Login link before signup form -->
        <div class="text-center mb-4 text-sm">
          Already have an account?
          <router-link
            to="/login"
            class="text-blue-600 hover:underline font-semibold"
          >
            Login
          </router-link>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50 font-semibold"
        >
          <span v-if="loading">Signing up...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>

      <!-- Back to Home link after signup button -->
      <div class="text-center mt-4 text-sm">
        <router-link to="/" class="text-gray-600 hover:underline">
          Back to Home
        </router-link>
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

    const { data } = await axios.post(
      'http://localhost:4000/api/auth/clients/signup',
      payload
    );

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    router.push('/client');
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Signup failed. Try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db; /* light gray border */
  border-radius: 0.75rem;
  outline: none;
  background-color: #f9fafb; /* light field bg */
  transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
}
.input:focus {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
  background-color: #ffffff;
}
</style>
