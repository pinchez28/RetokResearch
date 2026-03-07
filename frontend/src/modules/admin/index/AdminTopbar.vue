<template>
  <header class="bg-primary-900 text-neutral-white shadow-md sticky top-0 z-50">
    <div class="max-w-full px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between">
      <!-- LEFT SECTION -->
      <div class="flex items-center space-x-3">
        <!-- Hamburger / Close (mobile only) -->
        <button
          @click="toggleSidebarHandler"
          class="lg:hidden p-2 rounded hover:bg-primary-800/40 transition"
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

        <!-- Logo / title -->
        <router-link
          to="/admin"
          class="font-semibold tracking-wide text-responsive-base sm:text-responsive-lg text-primary-200 no-underline"
        >
          Admin Panel
        </router-link>
      </div>

      <!-- RIGHT SECTION -->
      <div class="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
        <!-- Notifications -->
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <Bell class="w-5 h-5 sm:w-6 sm:h-6 text-neutral-white" />

          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-accent-500 text-neutral-white text-xs font-bold rounded-full px-1.5 py-0.5"
          >
            {{ unreadCount }}
          </span>

          <!-- Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto bg-neutral-white text-primary-900 rounded shadow-lg p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold text-responsive-sm"> Notifications </span>
            </div>

            <ul class="space-y-2">
              <li
                v-for="n in notifications"
                :key="n._id"
                @click="goToNotification(n)"
                class="p-2 rounded cursor-pointer hover:bg-primary-100 flex justify-between items-center text-responsive-xs sm:text-responsive-sm"
                :class="{ 'bg-primary-100': !n.read }"
              >
                <div>
                  <p class="font-medium">
                    {{ n.title }}
                  </p>
                  <p class="text-primary-300 text-xs">
                    {{ formatDate(n.createdAt) }}
                  </p>
                </div>

                <span
                  v-if="!n.read"
                  class="bg-accent-500 w-2 h-2 rounded-full inline-block"
                ></span>
              </li>
            </ul>

            <p
              v-if="notifications.length === 0"
              class="text-primary-300 mt-2 text-responsive-xs"
            >
              No notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@/core/store/notificationStore.js";
import { Bell } from "lucide-vue-next";
import { useUIStore } from "@/core/store/uiStore";

const emit = defineEmits(["open-notification"]);

const notificationStore = useNotificationStore();
const { notifications, unreadCount } = storeToRefs(notificationStore);
const showNotifications = ref(false);

// ---------------- Notifications ----------------
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const goToNotification = async (notif) => {
  await notificationStore.markAsRead(notif._id);
  emit("open-notification", notif);
};

// ---------------- Sidebar ----------------
const uiStore = useUIStore();
const { state, toggleSidebar } = uiStore;

// Use the reactive store state
const sidebarOpen = computed(() => state.sidebarOpen);

const toggleSidebarHandler = () => {
  toggleSidebar(); // toggles the sidebar in store
};

// ---------------- Format date ----------------
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
</script>
