<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
  >
    <HowItWorksCard
      v-for="(step, index) in steps"
      :key="index"
      :step="step"
      :style="{ transitionDelay: index * 150 + 'ms' }"
    />
  </div>
</template>

<script setup>
import HowItWorksCard from './HowItWorksCard.vue';

const props = defineProps({
  steps: { type: Array, required: true },
});
</script>
