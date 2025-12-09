<!-- /components/Spinner.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
  >
    <div
      class="loader border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"
    ></div>
  </div>
</template>

<script setup></script>

<style scoped>
.loader {
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

