<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Contact Hero -->
    <section id="contact" class="bg-[#001bb7] text-white py-28 text-center rounded-b-3xl">
      <h1 class="text-5xl md:text-6xl font-extrabold animate-fadeUp">Get in Touch</h1>
      <p class="mt-6 text-lg md:text-xl text-[#f5f1dc] animate-fadeUp delay-150">
        Have questions or want to collaborate? Reach out to us!
      </p>
    </section>

    <!-- Contact Form -->
    <section
      class="py-24 max-w-3xl mx-auto px-6 bg-white rounded-3xl shadow-2xl shadow-black/20 animate-fadeUp delay-300 transform hover:-translate-y-1 transition-all duration-300 -mt-20 relative z-10"
    >
      <form class="grid gap-6">
        <input
          type="text"
          placeholder="Your Name"
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg"
        />
        <input
          type="email"
          placeholder="Your Email"
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg"
        />
        <textarea
          placeholder="Your Message"
          rows="6"
          class="border border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow-lg"
        ></textarea>
        <button
          type="submit"
          class="bg-[#FF8040] hover:bg-[#FFA366] text-[#333] font-bold py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl"
        >
          Send Message
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import Navbar from "@/components/navbar/Navbar.vue";
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
