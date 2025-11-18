<template>
  <section
    id="hero"
    class="relative w-full min-h-screen lg:h-screen overflow-hidden bg-gradient-to-br from-[#001bb7] via-[#0046ff] to-[#001bb7] pt-[80px] pb-16"
  >
    <!-- Animated Icon Particles -->
    <div
      v-for="(icon, i) in floatingIcons"
      :key="i"
      class="absolute text-white opacity-70"
      :style="{
        top: icon.top + '%',
        left: icon.left + '%',
        width: icon.size + 'px',
        height: icon.size + 'px',
        animation: `float${i % 4} ${
          icon.duration
        }s ease-in-out infinite alternate`,
        transform: `rotate(${icon.rotate}deg)`,
      }"
    >
      <component :is="icon.component" class="w-full h-full" />
    </div>

    <!-- Hero Content -->
    <div
      class="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto h-full px-4 sm:px-6 md:px-12 lg:px-20"
    >
      <div class="text-center lg:text-left text-white space-y-6 lg:w-1/2">
        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg animate-fadeUp"
        >
          Get Research Help from
          <span class="text-[#ff8040]">Top Rated Experts</span>
        </h1>
        <p
          class="text-base sm:text-lg md:text-xl max-w-md mx-auto lg:mx-0 animate-fadeUp delay-150"
        >
          Post your research topic, get matched with top experts, and track
          progress easily.
        </p>
        <div
          class="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fadeUp delay-300"
        >
          <router-link
            to="/signup"
            class="px-6 sm:px-8 py-2 sm:py-3 rounded-xl text-base sm:text-lg font-bold bg-[#ff8040] text-[#333] shadow-lg hover:bg-[#ffa366] transition transform hover:-translate-y-1"
          >
            Start Now
          </router-link>
          <router-link
            to="/about"
            class="px-6 sm:px-8 py-2 sm:py-3 rounded-xl text-base sm:text-lg font-bold border-2 border-white text-white hover:bg-white/20 backdrop-blur-xl transition transform hover:-translate-y-1"
          >
            Learn More
          </router-link>
        </div>
      </div>

      <div class="relative lg:w-1/2 mt-8 lg:mt-0 animate-fadeUp delay-150">
        <img
          src="@/assets/images/hero.jpg"
          alt="Research Illustration"
          class="w-full max-w-md sm:max-w-lg mx-auto lg:mx-0 rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BookOpen, BarChart3, Lightbulb, Users } from 'lucide-vue-next';

const floatingIcons = ref([]);

onMounted(() => {
  const components = [BookOpen, BarChart3, Lightbulb, Users];
  for (let i = 0; i < 40; i++) {
    floatingIcons.value.push({
      component: components[Math.floor(Math.random() * components.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size:
        window.innerWidth < 640
          ? 15 + Math.random() * 15
          : 20 + Math.random() * 30,
      duration: 8 + Math.random() * 8,
      rotate: Math.random() * 360,
    });
  }
});
</script>

<style scoped>
/* Gradient background animation */
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
  animation: fadeUp 1s ease-out forwards;
}
.delay-150 {
  animation-delay: 0.15s;
}
.delay-300 {
  animation-delay: 0.3s;
}

/* Floating icons animations */
@keyframes float0 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes float1 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-35px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes float2 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes float3 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  h1 {
    line-height: 1.2;
  }
  p {
    max-width: 90%;
  }
}
</style>
