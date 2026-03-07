<template>
  <div class="min-h-screen bg-primary-900 text-neutral-white">
    <!-- Hero Section -->
    <section
      class="py-28 text-center rounded-b-3xl bg-primary-800 border-b border-primary-700"
      id="contact"
    >
      <h1
        class="text-5xl md:text-6xl font-extrabold text-accent-400 animate-fadeUp"
      >
        Get in Touch
      </h1>

      <p
        class="mt-6 text-lg md:text-xl text-primary-300 animate-fadeUp delay-150"
      >
        Write to us!
      </p>
    </section>

    <!-- Contact Form Card -->
    <section
      class="py-24 max-w-3xl mx-auto px-6 bg-primary-800 rounded-3xl shadow-2xl border border-primary-700 animate-fadeUp delay-300 -mt-20 relative z-10"
    >
      <form @submit.prevent="submitRequest" class="grid gap-8">
        <!-- Name -->
        <div class="relative">
          <input
            v-model="name"
            type="text"
            required
            placeholder=" "
            class="peer w-full bg-primary-700 text-neutral-white border border-primary-600 rounded-xl px-4 pt-6 pb-2 transition-all duration-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40 focus:outline-none"
          />
          <label
            class="absolute left-4 top-2 text-sm text-primary-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-primary-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-accent-400"
          >
            Full Name *
          </label>
        </div>

        <!-- Email -->
        <div class="relative">
          <input
            v-model="email"
            type="email"
            required
            placeholder=" "
            class="peer w-full bg-primary-700 text-neutral-white border border-primary-600 rounded-xl px-4 pt-6 pb-2 transition-all duration-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40 focus:outline-none"
          />
          <label
            class="absolute left-4 top-2 text-sm text-primary-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-primary-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-accent-400"
          >
            Email Address *
          </label>
        </div>

        <!-- Phone -->
        <div class="relative">
          <input
            v-model="phone"
            type="tel"
            placeholder=" "
            class="peer w-full bg-primary-700 text-neutral-white border border-primary-600 rounded-xl px-4 pt-6 pb-2 transition-all duration-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40 focus:outline-none"
          />
          <label
            class="absolute left-4 top-2 text-sm text-primary-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-primary-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-accent-400"
          >
            Phone Number (Optional)
          </label>
        </div>

        <!-- Message -->
        <div class="relative">
          <textarea
            v-model="message"
            rows="6"
            required
            placeholder=" "
            class="peer w-full bg-primary-700 text-neutral-white border border-primary-600 rounded-xl px-4 pt-6 pb-3 resize-none transition-all duration-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40 focus:outline-none"
          ></textarea>
          <label
            class="absolute left-4 top-2 text-sm text-primary-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-primary-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-accent-400"
          >
            Full Message *
          </label>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold uppercase py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-xl disabled:opacity-50"
        >
          {{ loading ? 'Submitting...' : 'Submit Your Message' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { guestApi } from '@/core/api/http.js';

const name = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');
const loading = ref(false);

const submitRequest = async () => {
  if (!name.value || !email.value || !message.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Required Fields',
      text: 'Please fill in all required fields.',
      confirmButtonColor: '#001bb7',
    });
  }

  loading.value = true;

  try {
    await guestApi.submitGuestMessage({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      message: message.value.trim(),
    });

    await Swal.fire({
      icon: 'success',
      title: 'Message Sent Successfully',
      text: 'We will get back to you shortly.',
      confirmButtonColor: '#001bb7',
    });

    // Reset form
    name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: 'Something went wrong. Please try again.',
      confirmButtonColor: '#FF8040',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  @apply border border-gray-300 p-4 rounded-xl w-full
  focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg;
}

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
