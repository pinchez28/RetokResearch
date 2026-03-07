<template>
  <div
    class="bg-neutral-white p-4 rounded-lg shadow border-l-4 hover:shadow-md transition cursor-pointer group relative"
    :class="notification.read ? 'border-neutral-gray-300' : 'border-accent-500'"
    @click="$emit('click', notification)"
  >
    <button
      @click.stop="$emit('delete', notification._id)"
      class="absolute top-3 right-3 text-neutral-gray-400 hover:text-accent-500 transition-colors"
      :disabled="deleting"
      title="Delete notification"
    >
      <svg
        v-if="deleting"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>

    <div class="flex justify-between items-start pr-6">
      <div>
        <p class="font-semibold text-primary-900">{{ notification.title }}</p>
        <p class="text-sm text-primary-700 mt-1">{{ notification.message }}</p>
        <p class="text-xs text-primary-300 mt-2">
          {{ formatDate(notification.createdAt) }}
        </p>
      </div>
      <span
        v-if="!notification.read"
        class="px-2 py-1 text-xs rounded-full bg-accent-500 text-neutral-white font-semibold"
      >
        New
      </span>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from "@/core/utils/formatters";

defineProps({
  notification: {
    type: Object,
    required: true,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click", "delete"]);
</script>
