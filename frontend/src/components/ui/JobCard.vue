<template>
  <div
    class="job-card rounded-2xl p-5 shadow-lg cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-fadeUp"
    :style="{ background: gradient }"
    @click="$emit('click')"
  >
    <div class="font-bold text-white text-lg mb-2">
      {{ job.title || "Untitled Job" }}
    </div>
    <p class="text-white text-sm line-clamp-3 mb-3">
      {{ job.description || "No description provided." }}
    </p>
    <div class="text-white font-medium text-sm">
      <span class="mr-2">Budget:</span> Ksh {{ job.pricingRange?.min || 0 }} -
      {{ job.pricingRange?.max || 0 }}
    </div>
    <div class="text-white text-xs mt-2">
      Submitted by: {{ job.client?.name || "Unknown Client" }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  job: {
    type: Object,
    required: true,
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
    ["#4f46e5", "#3b82f6"],
    ["#16a34a", "#86efac"],
    ["#f59e0b", "#fcd34d"],
    ["#ec4899", "#f472b6"],
    ["#0ea5e9", "#38bdf8"],
    ["#f97316", "#fb923c"],
  ];
  const index = (props.branchIndex + props.categoryIndex) % colors.length;
  return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
});
</script>

<style scoped>
.job-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.job-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeUp {
  animation: fadeUp 1s ease-out forwards;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
