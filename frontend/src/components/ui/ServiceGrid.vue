<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ServiceCard
      v-for="(service, index) in services"
      :key="service._id"
      :service="service"
      :branch-type="branchType"
      class="animate-fadeIn cursor-pointer"
      :style="{ animationDelay: `${index * 0.1}s` }"
      @click="$emit('click', service)"
    />
  </div>
</template>

<script setup>
import ServiceCard from "./ServiceCard.vue";

const props = defineProps({
  services: { type: Array, required: true },
  branchType: { type: String, default: "academic" },
});
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
