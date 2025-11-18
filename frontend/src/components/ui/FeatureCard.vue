<template>
  <div
    class="whyus-card p-6 rounded-xl shadow-md transition-all duration-300 ease-out cursor-pointer transform"
    :class="{
      'bg-white shadow-xl -translate-y-2': isHovered,
      'bg-gray-50': !isHovered,
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="icon mb-4 text-6xl text-primary text-center">
      <slot name="icon"></slot>
    </div>

    <h3 class="text-xl font-bold mb-2 text-center">{{ title }}</h3>
    <p class="text-gray-700 text-center">{{ description }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const isHovered = ref(false);
</script>

<style scoped>
.whyus-card {
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.whyus-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}
</style>
