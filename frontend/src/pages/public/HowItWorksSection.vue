<template>
  <section
    id="howitworks"
    class="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
  >
    <!-- Video Background -->
    <video
      ref="bgVideo"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      muted
      loop
      playsinline
    >
      <source src="/bgs/howitworks_bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl w-full px-4 sm:px-6 lg:px-20 text-center">
      <h2
        class="animate-fadeUp font-extrabold text-white drop-shadow-lg"
        style="font-size: clamp(2rem, 5vw, 4rem)"
      >
        How It Works
      </h2>
      <p
        class="mt-4 sm:mt-6 text-white animate-fadeUp delay-150 drop-shadow-md mx-auto"
        style="font-size: clamp(1rem, 2.5vw, 1.5rem); max-width: 40rem"
      >
        Simple 5-step process to get matched with top research experts.
      </p>

      <div
        class="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="(step, idx) in steps"
          :key="step.number"
          class="step-card rounded-2xl p-5 sm:p-6 shadow-lg text-white flex flex-col items-center text-center animate-fadeUp delay-150"
          :class="colorClasses[idx % colorClasses.length]"
        >
          <!-- Step Number -->
          <div class="font-extrabold mb-3" style="font-size: clamp(2rem, 4vw, 3rem)">
            {{ step.number }}
          </div>
          <!-- Step Title -->
          <h3 class="font-semibold mb-2" style="font-size: clamp(1rem, 2.2vw, 1.25rem)">
            {{ step.title }}
          </h3>
          <!-- Step Description -->
          <p style="font-size: clamp(0.875rem, 1.8vw, 1rem)">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const steps = [
  {
    number: 1,
    title: "Submit Your Topic",
    description: "Share your research topic and requirements in detail.",
  },
  {
    number: 2,
    title: "Review Experts",
    description: "Browse qualified experts and view their profiles.",
  },
  {
    number: 3,
    title: "Get Matched",
    description: "We match you with top-rated research experts instantly.",
  },
  {
    number: 4,
    title: "Collaborate",
    description: "Communicate, review drafts, and provide feedback seamlessly.",
  },
  {
    number: 5,
    title: "Track Progress",
    description: "Monitor task completion and final submission easily.",
  },
];

// Assign colorful backgrounds for cards
const colorClasses = [
  "bg-gradient-to-br from-blue-500 to-indigo-500",
  "bg-gradient-to-br from-green-400 to-teal-500",
  "bg-gradient-to-br from-pink-500 to-purple-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-red-400 to-pink-500",
];

const bgVideo = ref(null);

onMounted(() => {
  if (bgVideo.value) {
    bgVideo.value.play().catch(() => {});
    bgVideo.value.loop = true;
  }
});
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

/* Step card hover effect */
.step-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
}

/* Responsive adjustments */
section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
