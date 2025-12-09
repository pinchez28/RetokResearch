<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold text-[#001BB7]">Support</h1>
    <p class="text-gray-600">
      Have questions or need assistance? Send us a message and our team will
      respond promptly.
    </p>

    <!-- Support Form -->
    <form
      @submit.prevent="submitSupport"
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

      <!-- Message -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Message</label>
        <textarea
          v-model="message"
          rows="6"
          placeholder="Describe your issue or question"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="text-right">
        <button
          type="submit"
          :disabled="loading"
          class="bg-[#FF8040] hover:bg-[#FFA366] text-white font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50"
        >
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/utils/api.js';

const name = ref('');
const email = ref('');
const message = ref('');
const loading = ref(false);

const submitSupport = async () => {
  if (!name.value || !email.value || !message.value) return;

  loading.value = true;
  try {
    await axios.post('/support/messages', {
      name: name.value,
      email: email.value,
      message: message.value,
      source: 'Client',
    });

    // Clear form
    name.value = '';
    email.value = '';
    message.value = '';

    alert('Your message has been sent. Our support team will respond soon.');
  } catch (err) {
    console.error('Failed to send support message', err);
    alert('Failed to send message. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Tailwind handles most styling */
</style>

