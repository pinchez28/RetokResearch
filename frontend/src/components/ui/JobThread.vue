<template>
  <div class="border rounded-xl bg-white shadow-sm">
    <!-- HEADER -->
    <div
      class="flex justify-between items-center px-4 py-3 bg-gray-50 cursor-pointer"
      @click="open = !open"
    >
      <div>
        <h4 class="font-semibold text-gray-800">
          {{ jobTitle }}
        </h4>
        <p class="text-sm text-gray-500">{{ notifications.length }} updates</p>
      </div>

      <span
        v-if="unreadCount"
        class="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full"
      >
        {{ unreadCount }}
      </span>
    </div>

    <!-- BODY -->
    <div v-if="open" class="divide-y">
      <NotificationCard
        v-for="n in notifications"
        :key="n._id"
        :notification="n"
        @click="$emit('handleNotificationClick', n)"
        @delete="$emit('deleteNotification', n._id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NotificationCard from '@/components/ui/NotificationCard.vue';

defineProps({
  jobTitle: String,
  notifications: Array,
  unreadCount: Number,
});

const open = ref(false);
</script>
