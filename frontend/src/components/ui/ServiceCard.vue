<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
  >
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-xl font-semibold text-gray-800">{{ service.title }}</h4>
      <span class="text-gray-500 text-sm">{{ service.price || '' }}</span>
    </div>
    <p class="text-gray-600 text-sm">{{ service.shortDescription }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
});
</script>
