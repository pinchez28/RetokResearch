<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    <WhyUsCard
      v-for="(reason, index) in reasons"
      :key="index"
      :title="reason.title"
      :description="reason.description"
      :style="{ transitionDelay: index * 150 + 'ms' }"
    >
      <template #icon>
        <span class="text-6xl">{{ reason.icon }}</span>
      </template>
    </WhyUsCard>
  </div>
</template>

<script setup>
import FeatureCard from './TopRatedExpertCard.vue';

const props = defineProps({
  reasons: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
/* Optional: staggered fade-in for cards */
</style>
