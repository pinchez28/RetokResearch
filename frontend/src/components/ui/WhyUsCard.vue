<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-start border border-gray-200 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
  >
    <!-- Icon -->
    <div
      v-if="icon"
      class="bg-blue-100 text-blue-700 rounded-full p-4 mb-4 text-3xl flex items-center justify-center"
    >
      <component :is="icon" />
    </div>

    <!-- Title -->
    <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
      {{ title }}
    </h3>

    <!-- Short Description -->
    <p class="text-gray-600 mb-4 leading-relaxed">
      {{ description }}
    </p>

    <!-- Features List -->
    <ul
      v-if="features?.length"
      class="list-disc list-inside text-gray-700 space-y-1 mb-4"
    >
      <li v-for="(item, idx) in features" :key="idx">{{ item }}</li>
    </ul>

    <!-- Optional CTA button -->
    <button
      v-if="ctaText"
      @click="$emit('ctaClick')"
      class="mt-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
    >
      {{ ctaText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  features: Array,
  icon: [Object, Function], // <-- fix here
  ctaText: String,
});
</script>
