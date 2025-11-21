<template>
  <header
    class="flex items-center justify-between h-16 px-4 sm:px-6 bg-[#001BB7] text-[#F5F1DC] shadow-md fixed top-0 left-0 right-0 z-50"
  >
    <!-- Section Title -->
    <div class="text-lg sm:text-xl md:text-2xl font-bold">
      {{ currentSection }}
    </div>

    <!-- User Actions -->
    <div class="flex items-center space-x-4 relative">
      <!-- Notifications -->
      <button
        @click="toggleDropdown"
        class="relative p-1 hover:bg-[#0046FF] rounded-full transition"
      >
        <!-- Bell Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 sm:h-7 sm:w-7 text-[#F5F1DC]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3c0 .386-.149.735-.395 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        <!-- Notification Count -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-[#FF8040] text-white text-xs font-bold rounded-full px-1 min-w-[18px] text-center"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- Dropdown -->
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-12 w-72 bg-white text-black rounded-lg shadow-lg border overflow-hidden animate-fadeIn"
      >
        <div class="bg-[#001BB7] text-white px-4 py-2 font-semibold">
          Notifications
        </div>

        <div
          v-if="filteredNotifications.length === 0"
          class="p-4 text-center text-gray-500"
        >
          No notifications (last 48 hrs)
        </div>

        <div
          v-for="(n, index) in filteredNotifications"
          :key="index"
          class="p-3 border-b hover:bg-gray-100 cursor-pointer"
          @click="markAsRead(n)"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">
              {{ n.source }}
            </span>

            <span
              v-if="!n.read"
              class="text-xs bg-[#FF8040] text-white px-2 py-0.5 rounded-full"
            >
              New
            </span>
          </div>

          <div class="text-sm text-gray-600">
            {{ n.message }}
          </div>

          <div class="text-xs text-gray-400 mt-1">
            {{ timeAgo(n.timestamp) }}
          </div>
        </div>
      </div>

      <!-- User Avatar -->
      <div class="flex items-center space-x-2">
        <img
          src="@/assets/images/logo.jpg"
          alt="Admin Avatar"
          class="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-[#0046FF]"
        />
        <span class="hidden sm:block font-medium">Admin</span>
      </div>

      <!-- Logout -->
      <button
        @click="logout"
        class="bg-[#FF8040] hover:bg-[#FF9966] text-[#F5F1DC] px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold transition"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';

// Router
const route = useRoute();
const router = useRouter();

// Dropdown state
const dropdownOpen = ref(false);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Notifications
const notifications = ref([]);

// Listen to backend socket
let socket;

onMounted(() => {
  socket = io(import.meta.env.VITE_API_URL);

  socket.on('new_guest_request', (data) => {
    notifications.value.unshift({
      message: data.message,
      source: 'Guest Request',
      timestamp: Date.now(),
      read: false,
    });

    cleanupOldNotifications();
  });

  cleanupOldNotifications();
});

// 48-hour filter
const filteredNotifications = computed(() => {
  const now = Date.now();
  return notifications.value.filter(
    (n) => now - n.timestamp <= 48 * 60 * 60 * 1000
  );
});

// Count unread
const unreadCount = computed(
  () => filteredNotifications.value.filter((n) => !n.read).length
);

// Mark as read
const markAsRead = (n) => {
  n.read = true;
  dropdownOpen.value = false;
  router.push('/admin/guestsupport');
};

// Remove notifications older than 48 hours
const cleanupOldNotifications = () => {
  const now = Date.now();
  notifications.value = notifications.value.filter(
    (n) => now - n.timestamp <= 48 * 60 * 60 * 1000
  );
};

// Human readable “time ago”
const timeAgo = (timestamp) => {
  const diff = (Date.now() - timestamp) / 1000;

  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';

  return Math.floor(diff / 86400) + 'd ago';
};

// Current section computed name
const currentSection = computed(() => {
  if (route.path.startsWith('/admin/homepage')) return 'Homepage Management';
  if (route.path.startsWith('/admin/clients')) return 'Client Dashboard';
  if (route.path.startsWith('/admin/experts')) return 'Expert Dashboard';
  if (route.path.startsWith('/admin/settings')) return 'Admin Settings';
  return 'Admin Dashboard';
});

// Logout
const logout = () => {
  console.log('Logging out...');
  router.push('/login');
};
</script>
<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
