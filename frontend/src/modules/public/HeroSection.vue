<template>
  <section
    id="hero"
    class="hero-section relative w-full h-screen lg:min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 pt-[110px] lg:pt-[120px] pb-16"
    aria-labelledby="hero-heading"
  >
    <!-- Animated Brick Grid Background -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="brick-grid">
        <div
          v-for="n in 120"
          :key="n"
          class="brick"
          :style="{ '--i': n }"
        ></div>
      </div>
    </div>

    <!-- Hero content -->
    <div
      class="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto h-full px-4 sm:px-6 md:px-10 lg:px-20 mt-10"
    >
      <div class="text-center lg:text-left text-white space-y-6 lg:w-1/2">
        <h1
          id="hero-heading"
          class="text-[2rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.6rem] font-extrabold leading-tight drop-shadow-lg animate-fadeUp text-green-100"
        >
          Get Research Help from
          <span class="text-accent-500">Top Rated Experts</span>
        </h1>

        <p
          class="text-base sm:text-lg md:text-xl max-w-lg mx-auto lg:mx-0 text-white/90 animate-fadeUp delay-150"
        >
          Post your research topic, get matched with top experts, and track
          progress easily.
        </p>

        <div
          class="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fadeUp delay-300 w-full"
        >
          <!-- Start Now Button -->
          <button
            class="bg-accent-500 hover:bg-accent-400 text-primary-900 font-extrabold uppercase py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 animate-bounce text-lg"
            @click="() => openSignup('client')"
          >
            Start Now
          </button>

          <!-- Learn More Button -->
          <button
            class="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold border-2 border-white text-white hover:bg-primary-800 transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60"
            @click="scrollToSection('about')"
          >
            Learn More
          </button>
        </div>
      </div>

      <div
        class="relative lg:w-1/2 w-full flex justify-center animate-fadeUp delay-200"
      >
        <img
          src="@/assets/images/hero.jpg"
          alt="Research Illustration"
          class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-2xl object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

function setVh() {
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight / 100}px`,
  );
}

onMounted(() => {
  setVh();
  window.addEventListener('resize', setVh);
});

const router = useRouter();
const route = useRoute();

// CTA click: open signup overlay
const openSignup = (type = 'client') => {
  if (window.openSignupOverlay) {
    window.openSignupOverlay(type);
  } else {
    console.warn('Signup overlay is not initialized');
  }
};

// Scroll to section
const scrollToSection = async (id) => {
  if (route.path === '/') {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  await router.push({ path: '/', query: { scrollTo: id } });
};
</script>

<style scoped>
.hero-section {
  height: calc(var(--vh, 1vh) * 100);
}

/* ============================= */
/* Brick Grid Background */
/* ============================= */

.brick-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 6px;
  padding: 40px;
}

/* ============================= */
/* Enhanced Brick Grid */
/* ============================= */

.brick {
  position: relative;
  border-radius: 10px;

  background: linear-gradient(
    135deg,
    rgba(0, 224, 255, 0.35),
    rgba(255, 128, 64, 0.35)
  );

  backdrop-filter: blur(6px);
  box-shadow:
    0 0 10px rgba(0, 224, 255, 0.35),
    0 0 20px rgba(255, 128, 64, 0.25),
    inset 0 0 8px rgba(255, 255, 255, 0.15);

  transform: translateY(40px) scale(0.9);
  opacity: 0;

  animation: assemble 7s cubic-bezier(0.22, 0.9, 0.35, 1) infinite;
  animation-delay: calc(var(--i) * 0.04s);
}

/* Subtle light sweep */
.brick::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.25) 0%,
    transparent 40%,
    transparent 60%,
    rgba(255, 255, 255, 0.2) 100%
  );
  opacity: 0.4;
  pointer-events: none;
}

/* Enhanced animation */
@keyframes assemble {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.85);
  }

  20% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }

  50% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }

  80% {
    opacity: 0.2;
    transform: translateY(-50px) scale(0.9);
  }

  100% {
    opacity: 0;
    transform: translateY(-50px) scale(0.85);
  }
}

@keyframes assemble {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.85);
  }

  20% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }

  50% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }

  80% {
    opacity: 0;
    transform: translateY(-40px) scale(0.85);
  }

  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.85);
  }
}

/* Fade-up animation */
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
  animation: fadeUp 900ms cubic-bezier(0.22, 0.9, 0.35, 1) forwards;
}

.delay-150 {
  animation-delay: 150ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .brick,
  .animate-fadeUp {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  h1 {
    font-size: 1.9rem !important;
    line-height: 1.25 !important;
  }
  p {
    max-width: 95%;
  }
}
</style>
