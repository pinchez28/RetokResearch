<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold text-[#001BB7]">Your Profile</h1>
    <p class="text-gray-600">
      Update your personal details and contact information.
    </p>

    <form
      @submit.prevent="updateProfile"
      class="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
    >
      <!-- Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Email Address</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Phone Number</label>
        <input
          v-model="phone"
          type="tel"
          placeholder="Enter phone number"
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Company / Organization -->
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Organization (optional)</label
        >
        <input
          v-model="organization"
          type="text"
          placeholder="Company or organization"
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Update Button -->
      <div class="text-right">
        <button
          type="submit"
          :disabled="loading"
          class="bg-[#FF8040] hover:bg-[#FFA366] text-white font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50"
        >
          {{ loading ? 'Updating...' : 'Update Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/api.js';

const name = ref('');
const email = ref('');
const phone = ref('');
const organization = ref('');
const loading = ref(false);

// Fetch existing profile on mount
onMounted(async () => {
  try {
    const res = await axios.get('/client/profile'); // make sure backend route exists
    const data = res.data;
    name.value = data.name || '';
    email.value = data.email || '';
    phone.value = data.phone || '';
    organization.value = data.organization || '';
  } catch (err) {
    console.error('Failed to fetch profile', err);
  }
});

const updateProfile = async () => {
  loading.value = true;
  try {
    await axios.patch('/client/profile', {
      name: name.value,
      email: email.value,
      phone: phone.value,
      organization: organization.value,
    });
    alert('Profile updated successfully!');
  } catch (err) {
    console.error('Failed to update profile', err);
    alert('Failed to update profile. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Tailwind handles most styling; add tweaks if needed */
</style>
