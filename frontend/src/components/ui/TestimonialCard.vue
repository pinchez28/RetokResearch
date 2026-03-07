<template>
  <div
    ref="elRef"
    :style="{ transitionDelay: index * 150 + 'ms' }"
    :class="[
      'p-6 rounded-2xl bg-white shadow-lg border border-gray-200 transition-all duration-500 ease-out cursor-default',
      'hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-50',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
    ]"
  >
    <!-- Feedback Text -->
    <p class="text-gray-700 italic mb-6 leading-relaxed">
      “{{ testimonial.feedback }}”
    </p>

    <!-- User Info -->
    <div class="flex items-center gap-4">
      <img
        :src="testimonial.photo"
        :alt="testimonial.name"
        class="w-12 h-12 rounded-full object-cover shadow-md"
      />

      <div>
        <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
        <p class="text-gray-500 text-sm">{{ testimonial.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useScrollAnimation } from '@/utils/useScrollAnimation.js';

const props = defineProps({
  testimonial: { type: Object, required: true },
  index: { type: Number, required: true },
});

const { elRef, isVisible } = useScrollAnimation();
</script>

