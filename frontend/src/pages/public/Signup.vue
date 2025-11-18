<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block mb-1 font-medium">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="John Doe"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 font-medium">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="+254 700 000000"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block mb-1 font-medium">I am a</label>
          <select
            v-model="form.role"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>Select role</option>
            <option value="client">Client</option>
            <option value="service_provider">Service Provider</option>
          </select>
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Enter password"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block mb-1 font-medium">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm password"
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p class="text-sm text-gray-500 mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline"
          >Login</router-link
        >
      </p>

      <router-link
        :to="{ name: 'Home' }"
        class="block text-center text-gray-500 mt-2"
      >
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirmPassword: '',
});

const handleSignup = () => {
  const { name, email, phone, role, password, confirmPassword } = form.value;

  if (!name || !email || !phone || !role || !password || !confirmPassword) {
    alert('Please fill all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Normally, call your backend API here
  console.log('Signup data:', form.value);

  alert('Signup successful! Redirecting to login...');
  router.push({ name: 'Login' });
};
</script>
