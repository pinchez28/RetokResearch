<template>
  <div
    class="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 backdrop-blur-lg"
    :style="{ background: cardGradient }"
    @click="$emit('click')"
  >
    <div class="p-4 flex flex-col gap-2 min-h-[130px]">
      <div class="flex items-start justify-between">
        <!-- Title: Responsive font size using clamp -->
        <h4
          class="font-extrabold leading-snug"
          :style="{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: '#111' }"
        >
          {{ service.title || 'Untitled Service' }}
        </h4>

        <!-- Price: responsive text -->
        <span
          class="text-green-700 font-bold bg-white/70 px-2 py-1 rounded-full shadow"
          :style="{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }"
        >
          {{ formattedPrice }}
        </span>
      </div>

      <!-- Description: responsive -->
      <p
        class="font-extrabold line-clamp-3 mt-1/2"
        :style="{ fontSize: 'clamp(0.875rem, 1.8vw, 1.125rem)', color: '#000' }"
      >
        {{ service.shortDescription || 'No description available' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  service: { type: Object, required: true },

  cardGradient: {
    type: String,
    default:
      'linear-gradient(135deg, rgba(255,140,200,0.9), rgba(90,180,255,0.9))',
  },
});

const formattedPrice = computed(() => {
  if (!props.service.priceRange) return '';

  let clean = props.service.priceRange.replace(/\$/g, '').trim();

  if (clean.includes('-')) {
    const [min, max] = clean.split('-').map((n) => Number(n.trim()));
    if (!isNaN(min) && !isNaN(max)) {
      return `Ksh ${min.toLocaleString()} - Ksh ${max.toLocaleString()}`;
    }
  }

  const numeric = Number(clean);
  if (!isNaN(numeric)) {
    return `Ksh ${numeric.toLocaleString()}`;
  }

  return `Ksh ${clean}`;
});
</script>

