<template>
  <section
    id="howitworks"
    class="relative h-[700px] md:h-[800px] flex items-center justify-center"
  >
    <!-- Video Background -->
    <video
      ref="bgVideo"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      muted
      playsinline
      @ended="handleVideoEnd"
    >
      <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto text-center px-6 w-full">
      <h2
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white animate-fadeUp mb-4 drop-shadow-lg"
      >
        How It Works
      </h2>
      <p
        class="mt-2 text-base sm:text-lg md:text-xl text-white animate-fadeUp delay-150 drop-shadow-md"
      >
        Simple 5-step process to get matched with top research experts.
      </p>

      <div
        class="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="step in steps"
          :key="step.number"
          class="bg-white rounded-2xl p-5 sm:p-6 shadow-lg text-black flex flex-col items-center text-center"
        >
          <!-- Step Number -->
          <div
            class="text-3xl sm:text-4xl font-extrabold text-yellow-500 mb-2 sm:mb-3"
          >
            {{ step.number }}
          </div>
          <!-- Step Title -->
          <h3 class="font-semibold text-lg sm:text-base mb-1 sm:mb-2">
            {{ step.title }}
          </h3>
          <!-- Step Description -->
          <p class="text-sm sm:text-xs">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const steps = [
  {
    number: 1,
    title: 'Submit Your Topic',
    description: 'Share your research topic and requirements in detail.',
  },
  {
    number: 2,
    title: 'Review Experts',
    description: 'Browse qualified experts and view their profiles.',
  },
  {
    number: 3,
    title: 'Get Matched',
    description: 'We match you with top-rated research experts instantly.',
  },
  {
    number: 4,
    title: 'Collaborate',
    description: 'Communicate, review drafts, and provide feedback seamlessly.',
  },
  {
    number: 5,
    title: 'Track Progress',
    description: 'Monitor task completion and final submission easily.',
  },
];

const bgVideo = ref(null);

const handleVideoEnd = () => {
  setTimeout(() => {
    bgVideo.value.play();
  }, 5000); // replay after 5s
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

/* Responsive adjustments */
@media (max-width: 768px) {
  section {
    height: 600px;
  }
  h2 {
    line-height: 1.2;
  }
  p {
    max-width: 90%;
    margin: 0 auto;
  }
}
</style>
