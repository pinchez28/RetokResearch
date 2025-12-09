<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
  >
    <WhyUsCard
      v-for="card in cards"
      :key="card._id"
      :title="card.title"
      :description="card.description"
      :features="card.features"
      :icon="card.icon"
      :ctaText="card.ctaText"
      @ctaClick="card.ctaHandler"
    />
  </div>
</template>

<script setup>
import WhyUsCard from './WhyUsCard.vue';

defineProps({
  cards: Array,
});
</script>

