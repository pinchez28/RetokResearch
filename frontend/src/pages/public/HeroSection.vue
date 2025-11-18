<template>
  <section
    id="hero"
    class="hero-section relative w-full h-screen lg:min-h-screen overflow-hidden bg-gradient-to-br from-[#001bb7] via-[#0046ff] to-[#001bb7] pt-[90px] pb-16"
    aria-labelledby="hero-heading"
  >
    <!-- Floating icons -->
    <div
      v-for="icon in floatingIcons"
      :key="icon.id"
      class="floating-icon absolute pointer-events-none opacity-70 will-change-transform"
      :style="{
        top: icon.top + '%',
        left: icon.left + '%',
        width: icon.size + 'px',
        height: icon.size + 'px',
        '--dx': icon.dx + 'px',
        '--dy': icon.dy + 'px',
        '--dur': icon.duration + 's',
        '--delay': icon.delay + 'ms',
      }"
      aria-hidden="true"
    >
      <component :is="icon.component" class="w-full h-full" />
    </div>

    <!-- Hero content -->
    <div
      class="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto h-full px-4 sm:px-6 md:px-10 lg:px-20"
    >
      <div class="text-center lg:text-left text-white space-y-6 lg:w-1/2">
        <h1
          id="hero-heading"
          class="text-[2rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.6rem] font-extrabold leading-tight drop-shadow-lg animate-fadeUp"
        >
          Get Research Help from
          <span class="text-[#ff8040]">Top Rated Experts</span>
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
          <router-link
            to="/signup"
            class="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold bg-[#ff8040] text-[#333] shadow-xl hover:bg-[#ffa366] transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ffb38a]"
          >
            Start Now
          </router-link>
          <router-link
            to="/about"
            class="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold border-2 border-white text-white hover:bg-white/20 backdrop-blur-xl transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60"
          >
            Learn More
          </router-link>
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
import { ref, onMounted } from 'vue';
import { BookOpen, BarChart3, Lightbulb, Users } from 'lucide-vue-next';

let uid = 0;
const genId = () => ++uid;

const floatingIcons = ref([]);

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

// Number of icons depending on screen size
function computeCount() {
  const w = window.innerWidth;
  if (w < 640) return 20; // mobile
  if (w < 1024) return 45; // tablet/md
  return 70; // desktop/lg
}

// Generate icons with random positions, drift vectors, size, delay
function generateIcons() {
  const components = [BookOpen, BarChart3, Lightbulb, Users];
  const count = computeCount();
  floatingIcons.value = [];
  uid = 0;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = randomBetween(120, 800);
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);
    const duration = Math.round(randomBetween(20, 55));
    const size =
      window.innerWidth < 640
        ? Math.round(randomBetween(12, 22))
        : Math.round(randomBetween(18, 36));
    const rotate = Math.round(randomBetween(0, 360));
    const initialTop = Math.min(100, Math.max(0, Math.random() * 100));
    const initialLeft = Math.min(100, Math.max(0, Math.random() * 100));
    const delay = Math.round(Math.random() * duration * 1000);

    floatingIcons.value.push({
      id: genId(),
      component: components[Math.floor(Math.random() * components.length)],
      top: initialTop,
      left: initialLeft,
      size,
      dx,
      dy,
      duration,
      rotate,
      delay,
    });
  }
}

// Mobile viewport fix: set --vh to handle mobile browser bars
function setVh() {
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight / 100}px`
  );
}

onMounted(() => {
  setVh();
  window.addEventListener('resize', setVh);
  generateIcons();

  let lastBucket = computeCount();
  window.addEventListener('resize', () => {
    const bucket = computeCount();
    if (bucket !== lastBucket) {
      lastBucket = bucket;
      generateIcons();
    }
  });
});
</script>

<style scoped>
/* Use --vh to fill full viewport on mobile */
.hero-section {
  height: calc(var(--vh, 1vh) * 100);
}

/* Background gradient animation */
@keyframes bgShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
section {
  background-size: 200% 200%;
  animation: bgShift 12s ease-in-out infinite;
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

/* Floating icons */
.floating-icon {
  transform-origin: center center;
}
@keyframes drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) rotate(360deg);
    opacity: 1;
  }
}
.floating-icon {
  animation: drift var(--dur) linear var(--delay) infinite;
}

/* Ensure child SVGs fill their container */
.floating-icon > * {
  width: 100%;
  height: 100%;
  display: block;
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .floating-icon,
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
