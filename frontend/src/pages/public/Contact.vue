<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Contact Hero -->
    <section
      id="contact"
      class="bg-[#001bb7] text-white py-28 text-center rounded-b-3xl"
    >
      <h1 class="text-5xl text-white md:text-6xl font-extrabold animate-fadeUp">
        Get in Touch
      </h1>
      <p
        class="mt-6 text-lg md:text-xl text-[#f5f1dc] animate-fadeUp delay-150"
      >
        Have questions or want to collaborate? Reach out to us!
      </p>
    </section>

    <!-- Contact Form -->
    <section
      class="py-24 max-w-3xl mx-auto px-6 bg-gray-300 rounded-3xl shadow-2xl shadow-black/20 animate-fadeUp delay-300 transform hover:-translate-y-1 transition-all duration-300 -mt-20 relative z-10"
    >
      <form @submit.prevent="submitContactForm" class="grid gap-6">
        <input
          v-model="name"
          type="text"
          placeholder="Your Name"
          required
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Your Email"
          required
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg"
        />
        <textarea
          v-model="message"
          placeholder="Your Message"
          rows="6"
          required
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg"
        ></textarea>
        <button
          type="submit"
          :disabled="loading"
          class="bg-[#FF8040] hover:bg-[#FFA366] text-[#333] font-bold py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50"
        >
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/utils/api.js'; // Axios instance pointing to your API

const name = ref('');
const email = ref('');
const message = ref('');
const loading = ref(false);

const submitContactForm = async () => {
  if (!name.value || !email.value || !message.value) return;

  loading.value = true;

  try {
    await api.post('/guest-requests', {
      name: name.value,
      email: email.value,
      description: message.value,
      service: 'Contact Message', // label it clearly
      topic: 'Contact Form Submission', // optional for admin view
    });

    alert('Your message has been sent successfully!');
    name.value = '';
    email.value = '';
    message.value = '';
  } catch (err) {
    console.error(err);
    alert('Failed to send message. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeUp {
  animation: fadeUp 1s ease-out forwards;
}
.delay-150 {
  animation-delay: 0.15s;
}
.delay-300 {
  animation-delay: 0.3s;
}
</style>
