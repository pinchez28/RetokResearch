<template>
  <button
    :disabled="loading || disabled"
    class="px-4 py-2 rounded-xl font-medium transition"
    :class="variantClass"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "primary" },
  loading: Boolean,
  disabled: Boolean,
});

const variantClass = computed(() => {
  return {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  }[props.variant];
});
</script>
