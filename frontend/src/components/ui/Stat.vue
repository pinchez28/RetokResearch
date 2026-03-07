<template>
  <div class="bg-white rounded-xl border shadow-sm p-4">
    <p class="text-xs text-gray-500 uppercase tracking-wide">
      {{ label }}
    </p>
    <p class="text-lg font-bold text-gray-800 mt-1">
      {{ value ?? "—" }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
});
</script>
