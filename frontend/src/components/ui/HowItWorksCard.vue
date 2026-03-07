<template>
  <div
    ref="elRef"
    :class="[
      'bg-white p-6 rounded-2xl shadow-md transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    ]"
  >
    <!-- Number Circle -->
    <div
      class="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold mx-auto"
    >
      {{ step.number }}
    </div>

    <!-- Title -->
    <h3 class="text-xl font-semibold mb-2 text-center">{{ step.title }}</h3>

    <!-- Description -->
    <p class="text-gray-600 text-center">{{ step.description }}</p>
  </div>
</template>

<script setup>
import { useScrollAnimation } from '@/utils/useScrollAnimation.js';

const props = defineProps({
  step: { type: Object, required: true },
});

const { elRef, isVisible } = useScrollAnimation();
</script>

