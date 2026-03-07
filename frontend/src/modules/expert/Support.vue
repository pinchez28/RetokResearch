<template>
  <div class="bg-white p-8 rounded-3xl shadow-2xl">
    <h2 class="text-3xl font-bold text-[#001bb7] mb-4">Support</h2>
    <p class="text-gray-600 mb-4">
      Contact support if you have questions about assignments or your account.
    </p>
    <form @submit.prevent="submitMessage" class="space-y-4">
      <input
        v-model="subject"
        type="text"
        placeholder="Subject"
        class="w-full p-3 border rounded-lg"
        required
      />
      <textarea
        v-model="message"
        rows="5"
        placeholder="Your message..."
        class="w-full p-3 border rounded-lg"
        required
      ></textarea>
      <button
        type="submit"
        class="bg-[#001bb7] text-white px-6 py-3 rounded-lg hover:bg-[#0033ff] transition"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const subject = ref('');
const message = ref('');

const submitMessage = () => {
  alert(
    `Message submitted!\nSubject: ${subject.value}\nMessage: ${message.value}`
  );
  subject.value = '';
  message.value = '';
};
</script>

