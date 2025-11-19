<template>
  <div
    class="p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    :style="cardGradient"
  >
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-xl font-semibold text-white">{{ service.title }}</h4>
      <span class="text-white/80 text-sm">{{ service.price || "" }}</span>
    </div>
    <p class="text-white/90 text-sm">{{ service.shortDescription }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  service: { type: Object, required: true },
  index: { type: Number, default: 0 },
  branchType: { type: String, default: "academic" },
});

// Define gradient sets per branch
const branchGradients = {
  academic: [
    "linear-gradient(135deg, #001BB7, #0046FF)",
    "linear-gradient(135deg, #0046FF, #001BB7)",
  ],
  industrial: [
    "linear-gradient(135deg, #FF8040, #F5F1DC)",
    "linear-gradient(135deg, #F5F1DC, #FF8040)",
  ],
};

const cardGradient = computed(() => {
  const gradients = branchGradients[props.branchType] || branchGradients.academic;
  return `background: ${gradients[props.index % gradients.length]};`;
});
</script>

<style scoped>
/* Smooth hover scale for card */
div:hover {
  transform: translateY(-5px) scale(1.02);
}
</style>
