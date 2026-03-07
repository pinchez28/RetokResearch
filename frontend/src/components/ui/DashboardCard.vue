<template>
  <div
    class="bg-white shadow-lg rounded-2xl p-5 border-t-4 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
    :class="[borderColor, loading ? 'opacity-50 cursor-wait' : '']"
    @click="handleClick"
  >
    <!-- Header: Title + Icon -->
    <div class="flex items-center justify-between">
      <h3 class="text-gray-600 text-sm font-medium">{{ title }}</h3>
      <div v-if="icon" class="p-2 rounded-lg" :class="iconBg">
        <component :is="icon" class="h-5 w-5" :class="iconColor" />
      </div>
    </div>

    <!-- Main Value or Loading -->
    <p class="text-3xl font-bold mt-3">
      <span v-if="!loading">{{ value }}</span>
      <span v-else class="animate-pulse">--</span>
    </p>

    <!-- Optional Subtitle -->
    <p v-if="subtitle && !loading" class="text-xs text-gray-500 mt-1">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
import { Bell } from 'lucide-vue-next';

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  borderColor: { type: String, default: 'border-blue-500' },
  icon: { type: [Object, Function, String], default: Bell },
  iconColor: { type: String, default: 'text-blue-600' },
  iconBg: { type: String, default: 'bg-blue-50' },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

const handleClick = () => {
  if (!props.loading) emit('click');
};
</script>

<style scoped>
/* Optional smooth hover animation for the top border */
.border-t-4 {
  transition: border-color 0.3s;
}
</style>
