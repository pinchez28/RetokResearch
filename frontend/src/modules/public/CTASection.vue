<template>
  <section
    class="relative w-full min-h-[650px] flex flex-col items-center justify-center overflow-hidden"
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
    </video>

    <!-- Brand Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-700/80 to-primary-800/90"
    ></div>

    <!-- Accent Glow Blobs -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-accent-500/30 blur-3xl"
      ></div>

      <div
        class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-400/30 blur-3xl"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-6 md:px-12 max-w-4xl">
      <h2
        class="animate-fadeUp font-extrabold text-neutral-white drop-shadow-lg mb-6 text-4xl md:text-5xl"
      >
        Take Your Research To The Next Level
      </h2>

      <p
        class="text-lg md:text-xl text-primary-200 animate-fadeUp delay-150 mb-8"
      >
        Get expert-driven academic or industrial research assistance with fast
        turnaround and guaranteed quality.
      </p>

      <div
        class="flex flex-col sm:flex-row justify-center gap-6 animate-fadeUp delay-300"
      >
        <!-- CTA Button -->
        <button
          class="relative overflow-hidden bg-accent-500 hover:bg-accent-400 text-primary-900 font-extrabold uppercase py-4 px-10 rounded-2xl shadow-float-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-lg"
          @click="openSignup()"
        >
          Join Our Research Warriors Team
        </button>

        <!-- Learn More -->
        <button
          class="px-8 py-3 rounded-2xl text-lg font-bold border border-primary-300 text-neutral-white hover:bg-primary-600/40 hover:border-accent-400 transition-all duration-300"
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
