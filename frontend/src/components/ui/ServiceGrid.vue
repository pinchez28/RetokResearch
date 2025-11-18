<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <ServiceCard
      v-for="service in services"
      :key="service._id"
      :service="service"
    />
  </div>
</template>

<script setup>
import ServiceCard from './ServiceCard.vue';

const props = defineProps({
  services: { type: Array, required: true },
});
</script>
