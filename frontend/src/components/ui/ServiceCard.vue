<template>
  <div
    class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    <!-- Icon -->
    <div
      class="w-10 h-10 mb-3 flex items-center justify-center rounded-full bg-blue-100 mx-auto"
    >
      <component :is="service.icon" class="w-6 h-6 text-blue-700" />
    </div>

    <!-- Title -->
    <h4 class="text-lg font-semibold text-center mb-2">{{ service.title }}</h4>

    <!-- Description -->
    <p class="text-gray-600 text-center">{{ service.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  service: { type: Object, required: true },
});
</script>

<style scoped>
.service-card {
  background-color: #ffffff; /* Keep white */
  border-radius: 1.5rem; /* rounded-2xl */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* stronger shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* lift effect */
}

/* Optional: subtle border for depth */
.service-card h3 {
  border-left: 4px solid #1e3a8a; /* Indigo-900 for contrast */
  padding-left: 0.75rem;
}
</style>
