<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <!-- Contact Hero -->
    <section class="bg-[#001bb7] text-white py-28 text-center">
      <h1 class="text-5xl md:text-6xl font-extrabold animate-fadeUp">
        Contact Us
      </h1>
      <p class="mt-6 text-lg md:text-xl text-gray-200 animate-fadeUp delay-150">
        Have questions or want to collaborate? Reach out to us!
      </p>
    </section>

    <!-- Contact Form -->
    <section
      class="py-24 max-w-3xl mx-auto px-6 bg-white rounded-3xl shadow-2xl animate-fadeUp delay-300"
    >
      <form class="grid gap-6">
        <input
          type="text"
          placeholder="Your Name"
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#001bb7]"
        />
        <input
          type="email"
          placeholder="Your Email"
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#001bb7]"
        />
        <textarea
          placeholder="Your Message"
          rows="6"
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#001bb7]"
        ></textarea>
        <button
          type="submit"
          class="bg-[#ff8040] hover:bg-[#ffa366] text-[#333] font-bold py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-lg"
        >
          Send Message
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/Navbar.vue';
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
