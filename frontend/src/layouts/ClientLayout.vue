<template>
  <div class="client-layout flex min-h-screen">
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
      <ClientSidebar @navigate="closeSidebar" />
    </aside>

    <!-- Content -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <!-- Topbar -->
      <ClientNavbar />

      <!-- Notification Splash -->
      <NotificationSplash />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pt-16 p-6 relative">
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
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";

import { useUIStore } from "@/core/store/uiStore.js";
import { useNotificationStore } from "@/core/store/notificationStore.js";
import { socket, connectSocket, disconnectSocket, joinRoom } from "@/core/api/socket.js";

import ClientSidebar from "@/modules/client/ClientSidebar.vue";
import ClientNavbar from "@/modules/client/ClientNavbar.vue";
import Footer from "@/components/shared/Footer.vue";
import NotificationSplash from "@/components/ui/NotificationSplash.vue";

// -------------------
// UI STORE (Sidebar)
const { state, closeSidebar } = useUIStore();

// -------------------
// NOTIFICATIONS
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
      router.push("/client/projects");
      break;
    default:
      router.push("/client");
  }
};

// -------------------
// SOCKET
let socketBound = false;
onMounted(async () => {
  await notificationStore.loadNotifications();
  connectSocket();
  joinRoom();

  if (!socketBound) {
    socketBound = true;
    socket.on("notification:new", (notif) => {
      if (notificationStore.notifications.some((n) => n._id === notif._id)) return;
      notificationStore.addNotification(notif);
      notificationStore.triggerSplash(notif);
    });
  }
});

onUnmounted(() => {
  socket.off("notification:new");
  disconnectSocket();
  socketBound = false;
});
</script>

<style scoped>
/* Scrollbar for main content */
main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-thumb {
  background-color: #0046ff;
  border-radius: 4px;
}
main {
  scrollbar-width: thin;
  scrollbar-color: #0046ff #f5f1dc;
}

/* Slide-fade animation for notifications */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
