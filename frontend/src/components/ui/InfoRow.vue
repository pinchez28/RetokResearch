<template>
  <div class="flex items-center space-x-2 text-gray-700">
    <span>{{ icon }}</span>
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: "" },
  text: { type: String, default: "" },
});
</script>
