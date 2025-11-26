<template>
  <div
    class="rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_8px_35px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer border border-white/30 backdrop-blur-md"
    :style="{ background: cardGradient }"
    @click="$emit('click')"
  >
    <div class="p-7 flex flex-col h-48 justify-between">
      <div class="flex items-center justify-between">
        <h4
          class="text-xl font-extrabold text-gray-900 leading-snug drop-shadow-sm"
        >
          {{ service.title || 'Untitled Service' }}
        </h4>
        <span
          class="text-gray-900/90 text-sm font-bold bg-white/60 px-3 py-1 rounded-full shadow"
        >
          {{ service.priceRange || '' }}
        </span>
      </div>

      <p
        class="text-gray-900 text-base leading-relaxed font-medium opacity-90 mt-2"
      >
        {{ service.shortDescription || 'No description available' }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  service: { type: Object, required: true },

  // 🌈 Brighter, more alive gradients — perfect against blue background
  cardGradient: {
    type: String,
    default:
      'linear-gradient(135deg, rgba(255, 215, 255, 0.95), rgba(230, 240, 255, 0.95))',
  },
});
</script>
