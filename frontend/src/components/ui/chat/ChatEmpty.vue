<template>
  <div class="flex flex-col items-center justify-center h-full text-primary-700">
    <p class="text-sm text-accent-500">
      {{ mainMessage }}
    </p>
    <p class="text-xs mt-1 text-primary-800">
      {{ subMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  adminMode: { type: Boolean, default: false },
  chatOpen: { type: Boolean, default: true }, // chat open/in progress
});

const mainMessage = computed(() => {
  if (props.adminMode) {
    return "No conversation yet to moderate";
  } else if (!props.chatOpen) {
    return "Chat will open once the assignment starts.";
  } else {
    return "No messages yet";
  }
});

const subMessage = computed(() => {
  if (props.adminMode) {
    return "Waiting for messages from participants";
  } else if (!props.chatOpen) {
    return "Participants can start sending messages once the assignment starts.";
  } else {
    return "Start the conversation when ready";
  }
});
</script>
