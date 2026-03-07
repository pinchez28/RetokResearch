<template>
  <section class="bg-neutral-white rounded-xl shadow-md p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-2xl font-semibold text-primary-700">
        {{ title }}
      </h3>

      <button
        v-if="hasUnread"
        @click="notificationStore.markAllAsRead"
        class="text-sm bg-primary-100 hover:bg-primary-200 text-primary-600 px-4 py-2 rounded-lg transition"
      >
        Mark all as read
      </button>
    </div>

    <!-- Notifications -->
    <div v-if="notificationStore.notifications.length > 0" class="space-y-3">
      <div
        v-for="notif in notificationStore.notifications"
        :key="notif._id"
        @click="handleClick(notif)"
        :class="[
          'p-4 rounded-lg border cursor-pointer transition hover:shadow-sm',
          notif.read
            ? 'bg-neutral-50 border-neutral-200'
            : 'bg-primary-50 border-primary-200',
        ]"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium text-primary-900">
              {{ notif.title || "Notification" }}
            </p>
            <p class="text-sm text-primary-700 mt-1">
              {{ notif.message }}
            </p>
            <p class="text-xs text-primary-300 mt-2">
              {{ formatTime(notif.createdAt) }}
            </p>
          </div>

          <button
            @click.stop="notificationStore.remove(notif._id)"
            class="text-accent-500 hover:text-accent-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-8 text-primary-400">
      <p class="text-lg">No notifications</p>
      <p class="text-sm mt-1">You're all caught up 🎉</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/core/store/notificationStore";

/* =========================
   Props
========================= */
defineProps({
  title: {
    type: String,
    default: "Notifications",
  },
});

/* =========================
   State
========================= */
const router = useRouter();
const notificationStore = useNotificationStore();

/* =========================
   Computed
========================= */
const hasUnread = computed(() => notificationStore.notifications.some((n) => !n.read));

/* =========================
   Methods
========================= */
const handleClick = async (notif) => {
  if (!notif.read) {
    await notificationStore.markAsRead(notif._id);
  }

  if (notif.link) {
    router.push(notif.link);
  }
};

const formatTime = (dateString) => {
  if (!dateString) return "Just now";

  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};
</script>
