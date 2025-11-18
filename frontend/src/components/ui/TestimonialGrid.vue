<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <TestimonialCard
      v-for="(item, index) in testimonials"
      :key="item.id || index"
      :testimonial="item"
      :index="index"
    />
  </div>
</template>

<script setup>
import TestimonialCard from './TestimonialCard.vue';

const props = defineProps({
  testimonials: { type: Array, required: true },
});
</script>
