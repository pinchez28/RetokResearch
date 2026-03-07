<template>
  <transition name="fade-scale">
    <div
      v-if="splash"
      class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div
        class="bg-neutral-white shadow-lg rounded-xl p-6 w-96 max-w-full border-l-4 border-accent-500 flex items-start gap-3 pointer-events-auto"
      >
        <div class="flex-1">
          <h4 class="font-bold text-primary-900">
            {{ splash.title || "Notification" }}
          </h4>
          <p class="text-primary-700 text-sm">
            {{ splash.message || splash.body || "" }}
          </p>
        </div>
        <button @click="closeSplash" class="text-primary-400 hover:text-primary-800">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";
import { useNotificationStore } from "@/core/store/notificationStore.js";

const notificationStore = useNotificationStore();
const splash = computed(() => notificationStore.splashNotification);

const closeSplash = () => {
  notificationStore.splashNotification = null;
};
</script>

<style scoped>
/* Fade + slight scale animation for splash */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
