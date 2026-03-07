<template>
  <div
    v-if="stat"
    :class="['border rounded-lg p-4', stat.color || '', stat.bgColor || '']"
  >
    <div class="flex items-center gap-2">
      <component
        v-if="stat.icon && iconMap[stat.icon]"
        :is="iconMap[stat.icon]"
        :class="stat.iconColor || ''"
        class="w-6 h-6"
      />
      <h3 class="font-bold text-lg">{{ stat.title || "N/A" }}</h3>
    </div>
    <p class="text-2xl font-extrabold">{{ stat.value ?? 0 }}</p>
    <p class="text-gray-500 text-sm">{{ stat.description || "" }}</p>
  </div>
</template>

<script setup>
import { Briefcase, CheckCircle, MessageSquare } from "lucide-vue-next";

const props = defineProps({
  stat: { type: Object, required: false }, // not required
});

const iconMap = {
  briefcase: Briefcase,
  "check-circle": CheckCircle,
  "message-square": MessageSquare,
};
</script>
