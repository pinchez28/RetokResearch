<template>
  <header class="bg-[#001BB7] text-white shadow-md sticky top-0 z-50">
    <div class="max-w-full px-6 py-3 flex items-center justify-between">
      <!-- LOGO / TITLE -->
      <RouterLink
        to="/client/dashboard"
        class="text-xl font-semibold tracking-wide"
      >
        Client Panel
      </RouterLink>

      <!-- RIGHT SIDE ACTIONS -->
      <div class="flex items-center space-x-6">
        <!-- NOTIFICATIONS -->
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <Bell class="w-6 h-6 text-white" />
          <span
            v-if="unreadCount.value > 0"
            class="absolute -top-1 -right-1 bg-[#FF8040] text-white text-xs font-bold rounded-full px-1.5 py-0.5"
          >
            {{ unreadCount.value }}
          </span>

          <!-- DROPDOWN -->
          <div
            v-if="showNotifications.value"
            class="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg p-3 max-h-80 overflow-y-auto z-50"
          >
            <p
              v-if="notificationList.value.length === 0"
              class="text-sm text-gray-500"
            >
              No new notifications
            </p>

            <ul v-else class="space-y-2">
              <li
                v-for="(note, index) in notificationList.value"
                :key="index"
                class="text-sm border-b pb-2 last:border-none hover:bg-gray-100 cursor-pointer"
              >
                {{ note.title }} - {{ note.message }}
              </li>
            </ul>
          </div>
        </div>

        <!-- USER MENU -->
        <div class="relative">
          <div
            class="flex items-center space-x-2 cursor-pointer"
            @click="toggleUserMenu"
          >
            <img
              src="https://ui-avatars.com/api/?name=Client&background=0046FF&color=fff"
              class="w-8 h-8 rounded-full border-2 border-white"
            />
            <span class="font-medium hidden md:inline">Client</span>
          </div>

          <!-- USER DROPDOWN -->
          <div
            v-if="showUserMenu.value"
            class="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40 py-2 z-50"
          >
            <RouterLink
              to="/client/profile"
              class="block px-4 py-2 hover:bg-[#F5F1DC]"
            >
              Profile
            </RouterLink>
            <RouterLink
              to="/client/support"
              class="block px-4 py-2 hover:bg-[#F5F1DC]"
            >
              Support
            </RouterLink>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-[#F5F1DC] text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell } from 'lucide-vue-next';
import { socket } from '@/core/api/socket.js';
import axios from 'axios';

// --- state ---
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notificationList = ref([]);
const router = useRouter();

// Computed unread notifications count
const unreadCount = computed(
  () => notificationList.value.filter((n) => !n.read).length
);

// --- functions ---
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await axios.get('http://localhost:4000/api/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ensure we get an array
    if (Array.isArray(res.data)) {
      notificationList.value = res.data;
    } else if (Array.isArray(res.data.notifications)) {
      notificationList.value = res.data.notifications;
    } else {
      console.warn('Notifications API returned non-array:', res.data);
      notificationList.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    notificationList.value = [];
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

// --- lifecycle hooks ---
onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetchNotifications();

  socket.auth = { token };
  socket.connect();
  socket.on('client:new_notification', (data) => {
    if (!notificationList.value) notificationList.value = [];
    notificationList.value.unshift(data);
  });
});

onUnmounted(() => {
  socket.off('client:new_notification');
  socket.disconnect();
});
</script>

<style scoped></style>
