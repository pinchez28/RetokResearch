<template>
  <div class="text-center py-16 text-gray-500">
    <p class="text-lg font-medium">{{ title }}</p>
    <p class="text-sm mt-1">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
