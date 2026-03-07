<template>
  <header class="bg-primary-900 text-neutral-white shadow-md sticky top-0 z-50">
    <div class="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
      <!-- LEFT: Hamburger + Title -->
      <div class="flex items-center space-x-3">
        <!-- Hamburger (mobile only) -->
        <button
          @click="toggleSidebar"
          class="md:hidden p-2 rounded hover:bg-white/10 transition"
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

        <!-- Title -->
        <router-link
          to="/client"
          class="font-semibold text-lg sm:text-xl md:text-2xl tracking-wide text-neutral-white no-underline"
        >
          Client Panel
        </router-link>
      </div>

      <!-- RIGHT: Notifications + User (lg only) -->
      <div class="hidden lg:flex items-center space-x-5">
        <!-- Notifications -->
        <div class="relative" ref="notificationRef">
          <button
            @click="toggleNotifications"
            class="relative p-2 rounded-full hover:bg-white/10 transition"
          >
            <Bell class="w-6 h-6 text-neutral-white" />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 bg-accent-500 text-neutral-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
            >
              {{ unreadCount }}
            </span>
          </button>

          <div
            v-if="showNotifications"
            class="absolute right-0 mt-3 w-72 bg-neutral-white text-primary-900 rounded-lg shadow-xl p-3 z-50 border"
          >
            <div class="flex justify-between mb-2">
              <span class="font-semibold">Notifications</span>
              <span class="text-xs text-accent-500 font-semibold">
                {{ unreadCount }} unread
              </span>
            </div>

            <ul
              v-if="notifications.length"
              class="space-y-2 max-h-72 overflow-y-auto"
            >
              <li
                v-for="note in notifications"
                :key="note._id"
                @click="handleNotificationClick(note)"
                class="p-2 rounded cursor-pointer hover:bg-primary-800"
                :class="{ 'bg-primary-800': !note.read }"
              >
                <p class="font-medium text-neutral-white">{{ note.title }}</p>
                <p class="text-sm text-primary-200">{{ note.message }}</p>
                <p class="text-xs text-primary-200/70 mt-1">
                  {{ formatDate(note.createdAt) }}
                </p>
              </li>
            </ul>

            <p v-else class="text-sm text-primary-200 text-center py-4">
              No notifications
            </p>
          </div>
        </div>

        <!-- User Menu (lg only) -->
        <div class="relative" ref="userRef">
          <button @click="toggleUserMenu" class="flex items-center space-x-2">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 p-0.5"
            >
              <div
                class="w-full h-full rounded-full bg-neutral-white flex items-center justify-center"
              >
                <User class="w-5 h-5 text-primary-600" />
              </div>
            </div>

            <div class="flex flex-col items-start">
              <span class="text-sm font-semibold text-neutral-white">{{
                clientName
              }}</span>
              <span class="text-xs text-primary-200/70">Client Account</span>
            </div>

            <ChevronDown
              class="w-4 h-4 transition-transform text-neutral-white"
              :class="{ 'rotate-180': showUserMenu }"
            />
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-3 w-48 bg-neutral-white text-primary-900 rounded-lg shadow-xl py-2 border"
          >
            <router-link
              to="/client/profile"
              class="block px-4 py-2 hover:bg-primary-200/20"
              @click="showUserMenu = false"
            >
              Profile
            </router-link>

            <router-link
              to="/client/support"
              class="block px-4 py-2 hover:bg-primary-200/20"
              @click="showUserMenu = false"
            >
              Support
            </router-link>

            <div class="border-t my-1 border-primary-700"></div>

            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-accent-500 hover:bg-accent-400"
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Bell, User, ChevronDown } from 'lucide-vue-next';
import { useNotificationStore } from '@/core/store/notificationStore.js';
import { useUIStore } from '@/core/store/uiStore.js';
import { clientApi } from '@/core/api/http.js';
import Swal from 'sweetalert2';

const router = useRouter();

// Notification store
const notificationStore = useNotificationStore();
const { notifications, unreadCount } = storeToRefs(notificationStore);

// Sidebar UI store
const uiStore = useUIStore();
const { toggleSidebar, state } = uiStore;
const sidebarOpen = computed(() => state.sidebarOpen);

// Dropdowns
const showNotifications = ref(false);
const showUserMenu = ref(false);

// Client profile
const clientName = ref('Client');

// Refs for click outside
const notificationRef = ref(null);
const userRef = ref(null);

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Toggle dropdowns
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
};
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

// Handle notification click
const handleNotificationClick = async (note) => {
  if (!note.read) await notificationStore.markAsRead(note._id);
  if (note.link) router.push(note.link);
  showNotifications.value = false;
};

// Logout
const logout = () => {
  Swal.fire({
    title: 'Logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#001BB7',
  }).then((res) => {
    if (res.isConfirmed) {
      localStorage.clear();
      router.push('/login');
    }
  });
};

// Fetch client profile
const fetchClientProfile = async () => {
  try {
    const { data } = await clientApi.getProfile();
    clientName.value = data?.data?.name || 'Client';
  } catch (err) {
    console.error(err);
  }
};

// Close dropdowns on outside click
const handleClickOutside = (e) => {
  if (notificationRef.value && !notificationRef.value.contains(e.target)) {
    showNotifications.value = false;
  }
  if (userRef.value && !userRef.value.contains(e.target)) {
    showUserMenu.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await fetchClientProfile();
  await notificationStore.loadNotifications();
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
