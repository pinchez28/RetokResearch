<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mission & Vision -->
    <section id="about" class="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Heading -->
      <div class="text-center mb-16 animate-fadeUp">
        <h1
          class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#001bb7] mb-4"
        >
          About <span class="text-[#FF8040]">Retok</span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-700">
          Learn about our mission, vision, and core values that drive excellence
          in research collaboration.
        </p>
      </div>

      <!-- Mission & Vision Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="animate-fadeLeft">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-[#001bb7]">
            Our Mission
          </h2>
          <p class="text-gray-700 text-base sm:text-lg">{{ mission }}</p>
        </div>

        <div class="animate-fadeRight">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-[#001bb7]">
            Our Vision
          </h2>
          <p class="text-gray-700 text-base sm:text-lg">{{ vision }}</p>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section
      class="py-16 bg-[#001bb7] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl"
    >
      <h2
        class="text-3xl sm:text-4xl md:text-4xl font-bold mb-12 text-white animate-fadeUp"
      >
        Core Values
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
      >
        <div
          v-for="(value, index) in coreValues"
          :key="index"
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition animate-fadeUp"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <h3 class="font-bold text-lg sm:text-xl mb-2 text-[#001bb7]">
            {{ value.title }}
          </h3>
          <p class="text-gray-600 text-sm sm:text-base">
            {{ value.description }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/api.js';

const mission = ref('');
const vision = ref('');
const coreValues = ref([]);

const fetchAbout = async () => {
  try {
    const res = await axios.get('/about');
    const about = res.data.about;
    if (about) {
      mission.value = about.mission;
      vision.value = about.vision;
      coreValues.value = about.coreValues || [];
    }
  } catch (err) {
    console.error('Failed to load About page:', err);
  }
};

onMounted(fetchAbout);
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

@keyframes fadeLeft {
  0% {
    opacity: 0;
    transform: translateX(-25px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fadeLeft {
  animation: fadeLeft 1s ease-out forwards;
}

@keyframes fadeRight {
  0% {
    opacity: 0;
    transform: translateX(25px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fadeRight {
  animation: fadeRight 1s ease-out forwards;
}

.shadow-3xl {
  box-shadow: 0 35px 60px rgba(0, 27, 183, 0.25);
}
</style>
