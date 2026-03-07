<template>
  <div class="expert-layout flex min-h-screen">
    <!-- Mobile overlay -->
    <div
      v-if="state.sidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed z-50 h-full w-64 bg-[#001BB7] text-[#F5F1DC] shadow-lg transition-transform duration-300 ease-in-out"
      :class="[
        state.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      ]"
    >
      <ExpertSidebar @navigate="closeSidebar" />
    </aside>

    <!-- Content -->
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="{ 'ml-0 lg:ml-64': true }"
    >
      <!-- Topbar -->
      <ExpertNavbar :toggleSidebar="toggleSidebar" :sidebarOpen="state.sidebarOpen" />

      <!-- Notification Splash -->
      <NotificationSplash />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pt-16 p-6 bg-[#F5F1DC] relative">
        <router-view />

        <!-- Animated notification queue -->
        <transition-group
          name="slide-fade"
          tag="div"
          class="fixed top-16 right-6 space-y-2 z-50"
        >
          <div
            v-for="n in notificationQueue"
            :key="n._id"
            class="p-4 rounded shadow-lg cursor-pointer animate-slide-in bg-[#FF8040] text-white"
            @click="openNotification(n)"
          >
            <strong>{{ n.title }}</strong>
            <p class="text-sm">{{ n.message }}</p>
          </div>
        </transition-group>
      </main>

      <!-- Footer -->
      <Footer class="bg-[#001BB7] text-[#F5F1DC]" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import ExpertSidebar from "@/modules/expert/ExpertSidebar.vue";
import ExpertNavbar from "@/modules/expert/ExpertNavbar.vue";
import Footer from "@/components/shared/Footer.vue";
import NotificationSplash from "@/components/ui/NotificationSplash.vue";
import { useUIStore } from "@/core/store/uiStore.js";
import { useNotificationStore } from "@/core/store/notificationStore.js";
import {
  getNotificationSocket,
  disconnectNotificationSocket,
} from "@/core/socket/notificationSocket.js";

const uiStore = useUIStore();
const { state, toggleSidebar, closeSidebar } = uiStore;

const router = useRouter();
const notificationStore = useNotificationStore();
const notificationQueue = ref([]);

watch(
  () => notificationStore.notifications.map((n) => n._id),
  (newIds, oldIds = []) => {
    const addedIds = newIds.filter((id) => !oldIds.includes(id));
    addedIds.forEach((id) => {
      if (notificationQueue.value.some((n) => n._id === id)) return;
      const notif = notificationStore.notifications.find((n) => n._id === id);
      if (!notif) return;
      notificationQueue.value.push(notif);
      setTimeout(() => {
        const index = notificationQueue.value.findIndex((n) => n._id === id);
        if (index !== -1) notificationQueue.value.splice(index, 1);
      }, 5000);
    });
  }
);

const openNotification = (notif) => {
  notificationStore.splashNotification = null;
  switch (notif.type) {
    case "Job":
      router.push("/expert/jobs");
      break;
    default:
      router.push("/expert/dashboard");
  }
};

let socketBound = false;
onMounted(async () => {
  await notificationStore.loadNotifications();
  const socket = getNotificationSocket();
  if (socket && !socketBound) {
    socketBound = true;
    socket.on("expert:new_notification", (notif) => {
      if (notificationStore.notifications.some((n) => n._id === notif._id)) return;
      notificationStore.addNotification(notif);
      notificationStore.triggerSplash(notif);
    });
  }
});

onUnmounted(() => {
  const socket = getNotificationSocket();
  if (socket) socket.off("expert:new_notification");
  disconnectNotificationSocket();
  socketBound = false;
});
</script>
