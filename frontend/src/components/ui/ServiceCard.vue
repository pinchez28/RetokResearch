<template>
  <div
    class="service-card relative group"
    @click="$emit('click')"
    :style="{ background: cardGradient }"
  >
    <!-- Main Card Content -->
    <div class="card-content">
      <!-- Service Icon/Image Area -->
      <div class="icon-container">
        <slot name="icon">
          <div class="default-icon">
            <svg class="icon-svg" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
              />
            </svg>
          </div>
        </slot>
      </div>

      <!-- Text Content -->
      <div class="text-content">
        <!-- Title with responsive typography -->
        <h3 class="service-title">
          {{ service.title || 'Untitled Service' }}
        </h3>

        <!-- Description with responsive typography -->
        <p class="service-description">
          {{ service.shortDescription || 'No description available' }}
        </p>

        <!-- Mobile-only price indicator -->
        <div class="mobile-price-indicator md:hidden bg-green-700">
          <span class="mobile-price-text">{{ mobileFormattedPrice }}</span>
        </div>

        <!-- Tags/Categories -->
        <div v-if="service.tags?.length" class="tags-container">
          <span v-for="tag in service.tags.slice(0, 2)" :key="tag" class="tag">
            {{ tag }}
          </span>
          <span v-if="service.tags.length > 2" class="tag-more">
            +{{ service.tags.length - 2 }}
          </span>
        </div>
      </div>

      <!-- Hover/Active State Indicator -->
      <div class="hover-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      shortDescription: '',
      priceRange: '',
      tags: [],
    }),
  },
  cardGradient: {
    type: String,
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click']);

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

const mobileFormattedPrice = computed(() => {
  if (!props.service.priceRange) return '';

  let clean = props.service.priceRange.replace(/\$/g, '').trim();

  if (clean.includes('-')) {
    const [min, max] = clean.split('-').map((n) => Number(n.trim()));
    if (!isNaN(min) && !isNaN(max)) {
      return `Ksh ${formatCompactNumber(min)}-${formatCompactNumber(max)}`;
    }
  }

  const numeric = Number(clean);
  if (!isNaN(numeric)) {
    return `Ksh ${formatCompactNumber(numeric)}`;
  }

  return `Ksh ${clean}`;
});

const formatCompactNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return number.toString();
};
</script>

<style scoped>
/* Base Card Styles */
.service-card {
  border-radius: 1.25rem;
  overflow: visible; /* Changed from hidden to visible for badge */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  isolation: isolate;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Price Badge Container - Fixed positioning */
.price-badge-container {
  position: absolute;
  z-index: 20;
  pointer-events: none; /* Allow clicks through to card */
}

/* Desktop positioning */
@media (min-width: 768px) {
  .price-badge-container {
    top: 0.75rem;
    right: 0.75rem;
  }
}

/* Tablet positioning */
@media (max-width: 1023px) and (min-width: 641px) {
  .price-badge-container {
    top: 0.5rem;
    right: 0.5rem;
  }
}

/* Mobile positioning - Move badge lower to avoid collision */
@media (max-width: 640px) {
  .price-badge-container {
    top: 0.75rem; /* Moved down from -0.5rem */
    right: 0.75rem;
  }
}

/* Price Badge */
.price-badge {
  background: rgba(255, 255, 255, 0.95);
  color: #059669;
  font-weight: 700;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  text-align: center;

  /* Desktop font size */
  font-size: 0.875rem;
  line-height: 1.25;
}

/* Responsive badge sizing */
@media (max-width: 1023px) and (min-width: 641px) {
  .price-badge {
    padding: 0.25rem 0.625rem;
    font-size: 0.8125rem;
  }
}

/* Mobile badge - smaller and moved */
@media (max-width: 640px) {
  .price-badge {
    padding: 0.1875rem 0.5rem;
    font-size: 0.75rem;
    /* Hide on mobile since we show mobile price indicator */
    display: none;
  }
}

/* Mobile Price Indicator */
.mobile-price-indicator {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  max-width: fit-content;
}

.mobile-price-text {
  color: white;
  font-weight: 700;
  font-size: 0.8125rem;
  white-space: nowrap;
}

/* Card Content */
.card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10; /* Above badge on mobile */
}

/* Ensure padding accounts for badge */
@media (max-width: 640px) {
  .card-content {
    padding-top: 1.5rem; /* Extra space for mobile badge */
  }
}

/* Responsive padding */
@media (max-width: 640px) {
  .card-content {
    padding: 1rem;
  }
}

/* Compact variant */
@media (max-width: 640px) {
  .service-card.compact .card-content {
    padding: 0.75rem;
  }
}

/* Icon Container */
.icon-container {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

/* Mobile icon sizing */
@media (max-width: 640px) {
  .default-icon {
    width: 2rem;
    height: 2rem;
  }

  .icon-svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .service-card.compact .default-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .service-card.compact .icon-svg {
    width: 1rem;
    height: 1rem;
  }
}

/* Text Content */
.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Service Title */
.service-title {
  font-weight: 800;
  line-height: 1.2;
  color: #111827;
  margin: 0;
  word-break: break-word;
  hyphens: auto;

  /* Desktop */
  font-size: 1.25rem;
  line-height: 1.3;
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 641px) {
  .service-title {
    font-size: 1.125rem;
    line-height: 1.25;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .service-title {
    font-size: 1rem;
    line-height: 1.25;
    padding-right: 2.5rem; /* Space for price badge */
  }

  .service-card.compact .service-title {
    font-size: 0.9375rem;
    padding-right: 0;
  }
}

/* Service Description */
.service-description {
  font-weight: 500;
  line-height: 1.4;
  color: #4b5563;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;

  /* Desktop */
  font-size: 0.9375rem;
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 641px) {
  .service-description {
    font-size: 0.875rem;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .service-description {
    font-size: 0.8125rem;
    -webkit-line-clamp: 2;
    line-height: 1.3;
  }

  .service-card.compact .service-description {
    font-size: 0.75rem;
    -webkit-line-clamp: 1;
  }
}

/* Tags Container */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: auto; /* Push to bottom */
  padding-top: 0.5rem;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.1875rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  white-space: nowrap;
}

.tag-more {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.1875rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
}

/* Mobile tags */
@media (max-width: 640px) {
  .tags-container {
    gap: 0.25rem;
  }

  .tag,
  .tag-more {
    font-size: 0.5625rem;
    padding: 0.125rem 0.25rem;
  }
}

/* Hover Indicator */
.hover-indicator {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
  pointer-events: none;
}

.service-card:hover .hover-indicator {
  opacity: 1;
}

/* Card Height Management */
.service-card {
  min-height: 160px;
}

@media (max-width: 1024px) and (min-width: 641px) {
  .service-card {
    min-height: 140px;
  }
}

@media (max-width: 640px) {
  .service-card {
    min-height: 120px;
  }

  .service-card.compact {
    min-height: 100px;
  }
}

/* Ensure content doesn't overflow */
.text-content {
  overflow: hidden;
}

/* Touch optimization */
@media (max-width: 640px) {
  .service-card {
    -webkit-tap-highlight-color: transparent;
  }

  .service-title,
  .service-description {
    user-select: none;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }

  .service-card:hover .hover-indicator {
    opacity: 0;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .service-title {
    color: #f9fafb;
  }

  .service-description {
    color: #d1d5db;
  }

  .price-badge {
    background: rgba(0, 0, 0, 0.8);
    color: #34d399;
  }

  .mobile-price-indicator {
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
