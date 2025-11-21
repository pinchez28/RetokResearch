<script setup>
defineProps({
  service: {
    type: Object,
    required: true,
  },
  cardGradient: {
    type: String,
    default: 'linear-gradient(to right, #4f46e5, #9333ea)',
  },
});
</script>

<template>
  <div
    class="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10"
    :style="{ background: cardGradient }"
  >
    <div class="p-6 flex flex-col h-full">
      <!-- Title + Price -->
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-white leading-snug">
          {{ service.title || 'Untitled Service' }}
        </h4>

        <span class="text-white/80 text-sm font-medium">
          {{ service.priceRange || '' }}
        </span>
      </div>

      <!-- Short description -->
      <p class="text-white/90 text-sm leading-relaxed">
        {{ service.shortDescription || 'No description available' }}
      </p>
    </div>
  </div>
</template>
