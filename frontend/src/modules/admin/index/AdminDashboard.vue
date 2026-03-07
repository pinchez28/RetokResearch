<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- HEADER -->
    <section
      class="bg-primary-900 text-neutral-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-gray-50">
          Welcome, Admin 👋
        </h1>
        <p class="mt-2 text-base md:text-lg opacity-90 text-neutral-gray-50 font-light">
          Manage clients, experts, requests, and platform activity.
        </p>
      </div>
    </section>

    <!-- STATS -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Clients"
        :value="totalClients"
        icon="user"
        border-color="#064663"
      />

      <DashboardCard
        title="Total Experts"
        :value="totalExperts"
        icon="user-check"
        border-color="#ECB365"
      />

      <DashboardCard
        title="Active Projects"
        :value="activeProjects"
        icon="briefcase"
        border-color="#041C32"
      />

      <DashboardCard
        title="Unread Notifications"
        :value="notificationStore.unreadCount"
        icon="notification"
        border-color="#20A4B0"
        :description="
          notificationStore.unreadCount > 0 ? 'Requires attention' : 'All caught up'
        "
      />
    </section>

    <!-- 🔔 REUSABLE NOTIFICATIONS -->
    <section class="pt-6">
      <NotificationGroup />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import DashboardCard from "@/components/ui/DashboardCard.vue";
import NotificationGroup from "@/components/ui/NotificationGroup.vue";
import { useNotificationStore } from "@/core/store/notificationStore";
import { adminApi, setAccessToken } from "@/core/api/http.js";
import { useAuthStore } from "@/core/store/auth.js";
import Swal from "sweetalert2";

// Stores
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

// Stats
const totalClients = ref(0);
const totalExperts = ref(0);
const activeProjects = ref(0);

// ---------------------------
// Fetch admin dashboard data safely
// ---------------------------
const fetchDashboardData = async () => {
  try {
    // Ensure getJobsSummary exists
    if (typeof adminApi.getJobsSummary !== "function") {
      console.warn("adminApi.getJobsSummary is missing!");
      return;
    }

    const [clientsRes, expertsRes, jobsSummaryRes] = await Promise.all([
      adminApi.getClients().catch(() => ({ data: {} })),
      adminApi.getExperts().catch(() => ({ data: {} })),
      adminApi.getJobsSummary().catch(() => ({ data: {} })),
    ]);

    totalClients.value = clientsRes?.data?.total ?? 0;
    totalExperts.value = expertsRes?.data?.total ?? 0;
    activeProjects.value = jobsSummaryRes?.data?.active ?? 0;

    // Load notifications safely
    if (notificationStore.loadNotifications) await notificationStore.loadNotifications();
  } catch (err) {
    console.error("Admin dashboard error:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load admin dashboard data.",
    });
  }
};

// ---------------------------
// On mounted
// ---------------------------
onMounted(async () => {
  try {
    // Initialize auth if not done
    if (!authStore.isInitialized) await authStore.initialize();

    // Set Axios memory token
    setAccessToken(localStorage.getItem("token") || null);

    // Wait for next tick to ensure interceptors are ready
    await nextTick();

    // Fetch dashboard data
    await fetchDashboardData();
  } catch (err) {
    console.error("Admin dashboard initialization failed:", err);
  }
});
</script>
