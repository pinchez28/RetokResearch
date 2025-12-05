<template>
  <div
    class="job-card rounded-2xl p-5 shadow-lg cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-fadeUp flex flex-col justify-between"
    :style="{ background: gradient }"
    @click="$emit('click')"
  >
    <div class="font-bold text-white text-lg">
      {{ job.title || 'Untitled Job' }}
    </div>

    <p class="text-white text-sm line-clamp-3 mt-3 flex-row">
      {{ job.description || 'No description provided.' }}
    </p>

    <!-- 👇 Only show pricing when allowed -->
    <div v-if="showPricing" class="text-white font-medium text-sm mt-4">
      <span class="mr-2">Budget:</span>
      Ksh {{ job.pricingRange?.min || 0 }} - {{ job.pricingRange?.max || 0 }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
  showPricing: {
    type: Boolean,
    default: false, // homepage default
  },
  branchIndex: {
    type: Number,
    default: 0,
  },
  categoryIndex: {
    type: Number,
    default: 0,
  },
});

const gradient = computed(() => {
  const colors = [
    ['#4f46e5', '#3b82f6'],
    ['#16a34a', '#86efac'],
    ['#f59e0b', '#fcd34d'],
    ['#ec4899', '#f472b6'],
    ['#0ea5e9', '#38bdf8'],
    ['#f97316', '#fb923c'],
  ];
  const index = (props.branchIndex + props.categoryIndex) % colors.length;
  return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
});
</script>
