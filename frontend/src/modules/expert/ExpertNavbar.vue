<template>
  <header class="bg-primary-900 text-white shadow-md sticky top-0 z-50">
    <div
      class="max-w-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between"
    >
      <!-- LEFT: Hamburger + Logo/Title -->
      <div class="flex items-center space-x-3">
        <!-- Hamburger / mobile sidebar toggle -->
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded hover:bg-white/10 transition-colors"
        >
          <svg
            v-if="!sidebarOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Logo / Title -->
        <router-link
          to="/expert/dashboard"
          class="font-semibold text-lg sm:text-xl md:text-2xl tracking-wide text-neutral-white no-underline"
        >
          Expert Panel
        </router-link>
      </div>

      <!-- RIGHT: Notifications + User Profile -->
      <div class="flex items-center space-x-4 sm:space-x-6">
        <!-- Notifications -->
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <div
            class="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {{ unreadCount }}
          </span>

          <!-- Notification Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white text-black rounded-lg shadow-lg p-3 z-50 border border-gray-100"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">Notifications</span>
              <span class="text-xs text-accent-500 font-semibold"
                >{{ unreadCount }} unread</span
              >
            </div>

            <ul v-if="notifications.length" class="space-y-2">
              <li
                v-for="note in notifications"
                :key="note._id"
                @click="handleNotificationClick(note)"
                class="cursor-pointer p-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-50': !note.read }"
              >
                <p class="font-medium text-gray-900">{{ note.title }}</p>
                <p class="text-gray-600 text-sm">{{ note.message }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatDate(note.createdAt) }}
                </p>
              </li>
            </ul>

            <p v-else class="text-gray-500 text-sm text-center py-4">
              No new notifications
            </p>
          </div>
        </div>

        <!-- User Profile -->
        <div class="relative">
          <div
            class="flex items-center space-x-2 cursor-pointer"
            @click="toggleUserMenu"
          >
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-0.5"
            >
              <div
                class="w-full h-full rounded-full bg-white flex items-center justify-center"
              >
                <User class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div class="hidden md:flex flex-col items-start">
              <span class="font-semibold text-sm">{{ expertName }}</span>
              <span class="text-xs text-primary-200/70">Expert Account</span>
            </div>
            <ChevronDown
              class="w-4 h-4 text-white/70 hidden md:block transition-transform"
              :class="{ 'rotate-180': showUserMenu }"
            />
          </div>

          <!-- User Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-xl w-48 py-2 z-50 border border-gray-100"
          >
            <router-link
              to="/expert/profile"
              class="flex items-center px-4 py-2.5 hover:bg-blue-50 text-gray-700 transition-colors"
              @click="showUserMenu = false"
            >
              <User class="w-4 h-4 mr-3 text-gray-500" />
              <span>Profile</span>
            </router-link>

            <router-link
              to="/expert/support"
              class="flex items-center px-4 py-2.5 hover:bg-blue-50 text-gray-700 transition-colors"
              @click="showUserMenu = false"
            >
              <HelpCircle class="w-4 h-4 mr-3 text-gray-500" />
              <span>Support</span>
            </router-link>

            <div class="border-t border-gray-100 mt-1 pt-1">
              <button
                @click="logout"
                class="flex items-center w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut class="w-4 h-4 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Splash -->
    <NotificationSplash />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Bell, User, ChevronDown, HelpCircle, LogOut } from 'lucide-vue-next';
import NotificationSplash from '@/components/ui/NotificationSplash.vue';
import { useNotificationStore } from '@/core/store/notificationStore.js';
import { useUIStore } from '@/core/store/uiStore.js';
import { expertApi } from '@/core/api/http.js';
import {
  getNotificationSocket,
  disconnectNotificationSocket,
} from '@/core/socket/notificationSocket.js';
import Swal from 'sweetalert2';

const router = useRouter();
const notificationStore = useNotificationStore();
const { notifications, unreadCount } = storeToRefs(notificationStore);

const uiStore = useUIStore();
const { toggleSidebar, state } = uiStore;
const sidebarOpen = computed(() => state.sidebarOpen);

const showNotifications = ref(false);
const showUserMenu = ref(false);
const expertName = ref('Expert');

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchExpertProfile = async () => {
  try {
    const response = await expertApi.getProfile();
    expertName.value = response.data?.name || 'Expert';
  } catch (err) {
    console.error(err);
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

const handleNotificationClick = async (note) => {
  if (!note.read) await notificationStore.markAsRead(note._id);
  if (note.link) router.push(note.link);
  showNotifications.value = false;
};

const logout = () => {
  Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#001BB7',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
  }).then((res) => {
    if (res.isConfirmed) {
      const socket = getNotificationSocket();
      if (socket) socket.disconnect();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  });
};

let socketBound = false;
onMounted(async () => {
  await fetchExpertProfile();
  await notificationStore.loadNotifications();

  const socket = getNotificationSocket();
  if (socket && !socketBound) {
    socketBound = true;
    socket.on('expert:new_notification', (notif) => {
      if (notificationStore.notifications.some((n) => n._id === notif._id))
        return;
      notificationStore.addNotification(notif);
      notificationStore.triggerSplash(notif);
    });
  }

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  const socket = getNotificationSocket();
  if (socket) socket.off('expert:new_notification');
  disconnectNotificationSocket();
  socketBound = false;
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative.cursor-pointer') && showNotifications.value)
    showNotifications.value = false;
  if (!e.target.closest('.relative') && showUserMenu.value)
    showUserMenu.value = false;
};
</script>
