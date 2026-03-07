<!-- src/components/ui/QuickActionButton.vue -->
<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="font-semibold px-5 py-2.5 rounded-lg transition flex items-center space-x-2"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <slot name="icon">
      <component v-if="icon" :is="icon" class="h-5 w-5" :class="iconColor" />
    </slot>
    <span><slot /></span>
  </RouterLink>

  <button
    v-else
    class="font-semibold px-5 py-2.5 rounded-lg transition flex items-center space-x-2"
    :class="buttonClasses"
    @click="$emit('click', $event)"
    :disabled="disabled"
  >
    <slot name="icon">
      <component v-if="icon" :is="icon" class="h-5 w-5" :class="iconColor" />
    </slot>
    <span><slot /></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  to: String,
  variant: {
    type: String,
    default: 'solid',
    validator: (value) => ['solid', 'outline', 'ghost'].includes(value),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'white', 'danger', 'warning'].includes(value),
  },
  icon: [String, Object],
  disabled: Boolean,
  fullWidth: Boolean,
});

defineEmits(['click']);

// Button class mapping based on variant and color
const buttonClasses = computed(() => {
  const baseClasses = [
    'font-semibold',
    'px-5',
    'py-2.5',
    'rounded-lg',
    'transition',
    'flex',
    'items-center',
    'space-x-2',
    props.fullWidth ? 'w-full justify-center' : '',
  ];

  // Color mappings
  const colorMap = {
    solid: {
      primary: 'bg-[#001BB7] text-white hover:bg-[#0046FF]',
      secondary: 'bg-[#FF8040] text-white hover:bg-[#FFA366]',
      white: 'bg-white text-[#FF8040] hover:bg-gray-50',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    },
    outline: {
      primary:
        'bg-transparent border border-[#001BB7] text-[#001BB7] hover:bg-[#001BB7]/10',
      secondary:
        'bg-transparent border border-[#FF8040] text-[#FF8040] hover:bg-[#FF8040]/10',
      white: 'bg-transparent border border-white text-white hover:bg-white/10',
      danger:
        'bg-transparent border border-red-600 text-red-600 hover:bg-red-600/10',
      warning:
        'bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10',
    },
    ghost: {
      primary: 'bg-transparent text-[#001BB7] hover:bg-[#001BB7]/10',
      secondary: 'bg-transparent text-[#FF8040] hover:bg-[#FF8040]/10',
      white: 'bg-transparent text-white hover:bg-white/10',
      danger: 'bg-transparent text-red-600 hover:bg-red-600/10',
      warning: 'bg-transparent text-yellow-500 hover:bg-yellow-500/10',
    },
  };

  const variantClasses =
    colorMap[props.variant]?.[props.color] || colorMap.solid.primary;

  if (props.disabled) {
    return [...baseClasses, 'opacity-50 cursor-not-allowed'];
  }

  return [...baseClasses, variantClasses];
});

// Icon color mapping
const iconColor = computed(() => {
  const colorMap = {
    solid: {
      primary: 'text-white',
      secondary: 'text-white',
      white: 'text-[#FF8040]',
      danger: 'text-white',
      warning: 'text-white',
    },
    outline: {
      primary: 'text-[#001BB7]',
      secondary: 'text-[#FF8040]',
      white: 'text-white',
      danger: 'text-red-600',
      warning: 'text-yellow-500',
    },
    ghost: {
      primary: 'text-[#001BB7]',
      secondary: 'text-[#FF8040]',
      white: 'text-white',
      danger: 'text-red-600',
      warning: 'text-yellow-500',
    },
  };

  return colorMap[props.variant]?.[props.color] || 'text-current';
});
</script>
