<template>
  <div
    class="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 backdrop-blur-lg"
    :style="{ background: cardGradient }"
    @click="$emit('click')"
  >
    <div class="p-4 flex flex-col gap-2 min-h-[130px]">
      <div class="flex items-start justify-between">
        <h4 class="text-lg font-extrabold text-gray-900 leading-snug">
          {{ service.title || 'Untitled Service' }}
        </h4>

        <span
          class="text-green-700 text-sm font-bold bg-white/70 px-2 py-1 rounded-full shadow"
        >
          {{ formattedPrice }}
        </span>
      </div>

      <p
        class="text-black text-sm leading-snug font-extrabold line-clamp-3 mt-1/2"
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

/*
  Price Formatter → Always Output:
  Ksh 1,000 – Ksh 5,000
  OR
  Ksh 2,500
*/
const formattedPrice = computed(() => {
  if (!props.service.priceRange) return '';

  let clean = props.service.priceRange.replace(/\$/g, '').trim();

  // handle ranges like "1000-3000"
  if (clean.includes('-')) {
    const [min, max] = clean.split('-').map((n) => Number(n.trim()));
    if (!isNaN(min) && !isNaN(max)) {
      return `Ksh ${min.toLocaleString()} - Ksh ${max.toLocaleString()}`;
    }
  }

  // handle single value
  const numeric = Number(clean);
  if (!isNaN(numeric)) {
    return `Ksh ${numeric.toLocaleString()}`;
  }

  // fallback if it's a string
  return `Ksh ${clean}`;
});
</script>
