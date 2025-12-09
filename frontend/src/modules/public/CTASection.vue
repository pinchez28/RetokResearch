<template>
  <section
    class="relative w-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
  >
    <!-- Video Background -->
    <video
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      muted
      loop
      playsinline
    >
      <source src="/bgs/cta_bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Gradient Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-purple-600/60 via-pink-500/50 to-yellow-400/60"
    ></div>

    <!-- Floating Shapes -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        class="absolute -left-10 -top-10 w-56 h-56 rounded-full opacity-30 transform rotate-45 bg-gradient-to-br from-pink-400 to-purple-600 blur-2xl"
      ></div>
      <div
        class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full opacity-25 transform rotate-12 bg-gradient-to-br from-yellow-300 to-pink-400 blur-3xl"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-6 md:px-12 max-w-4xl">
      <h2
        class="animate-fadeUp font-extrabold text-white drop-shadow-lg mb-6 text-center text-4xl"
      >
        Take Your Research To The Next Level
      </h2>
      <p class="text-lg md:text-xl text-white/90 animate-fadeUp delay-150 mb-8">
        Get expert-driven academic or industrial research assistance with fast
        turnaround and guaranteed quality.
      </p>

      <div
        class="flex flex-col sm:flex-row justify-center gap-4 animate-fadeUp delay-300"
      >
        <!-- CTA Button -->
        <button
          class="bg-[#FF8040] hover:bg-[#2aac10] hover:text-white text-gray-900 font-extrabold uppercase py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 animate-bounce text-lg"
          @click="openSignup()"
        >
          Post a Research Assignment
        </button>

        <!-- Learn More (scrolls to section) -->
        <button
          class="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold border-2 border-white text-white hover:bg-white/20 transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60"
          @click="scrollToSection('about')"
        >
          Learn More
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// CTA click: trigger global signup overlay
const openSignup = () => {
  if (typeof window.openSignupOverlay === 'function') {
    window.openSignupOverlay();
  } else {
    console.warn('Signup overlay function not defined');
  }
};

// Scroll to section on home page
const scrollToSection = async (id) => {
  if (route.path === '/') {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Navigate to home page first
  await router.push({ path: '/', query: { scrollTo: id } });
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

