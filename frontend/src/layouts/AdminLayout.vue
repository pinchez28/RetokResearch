<template>
  <div class="admin-layout flex min-h-screen">
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
      <AdminSidebar @navigate="closeSidebar" />
    </aside>

    <!-- Content -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <!-- Topbar -->
      <AdminTopbar class="bg-[#001BB7] text-[#F5F1DC]" />

      <!-- Notification Splash -->
      <NotificationSplash />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pt-16 p-6 relative">
        <div class="content-wrapper pb-24">
          <router-view />
        </div>

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
import { useNotificationStore } from "@/core/store/notificationStore.js";
import { socket, connectSocket, disconnectSocket, joinRoom } from "@/core/api/socket.js";
import AdminSidebar from "@/modules/admin/index/AdminSidebar.vue";
import AdminTopbar from "@/modules/admin/index/AdminTopbar.vue";
import Footer from "@/components/shared/Footer.vue";
import NotificationSplash from "@/components/ui/NotificationSplash.vue";
import { useUIStore } from "@/core/store/uiStore.js";

// --------------------
// UI STORE (Sidebar) --------------------
const { state, closeSidebar } = useUIStore();

// --------------------
// NOTIFICATIONS --------------------
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
    case "GuestRequest":
      router.push(`/admin/guest-support?requestId=${notif.jobId || ""}`);
      break;
    case "Job":
      router.push("/admin/jobs");
      break;
    case "ExpertSignup":
      router.push("/admin/experts");
      break;
    default:
      router.push("/admin");
  }
};

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
