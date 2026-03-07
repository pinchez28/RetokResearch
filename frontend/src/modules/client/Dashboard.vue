<template>
  <div class="p-6 md:p-10 space-y-8 min-h-screen">
    <!-- ================= WELCOME SECTION ================= -->
    <section
      class="bg-primary-900 text-neutral-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-white">
          Welcome, {{ clientName }} 👋
        </h1>
        <p class="mt-2 text-base md:text-lg text-primary-200 font-light">
          Track assignments, manage payments, and communicate with experts
          easily.
        </p>
      </div>
    </section>

    <!-- ================= STATS CARDS ================= -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Active Projects"
        :value="stats.active"
        icon="briefcase"
        border-color="#0046FF"
        @click="goToProjects('active')"
      />
      <DashboardCard
        title="Completed"
        :value="stats.completed"
        icon="check-circle"
        border-color="#001BB7"
        @click="goToProjects('completed')"
      />
      <DashboardCard
        title="Pending Payments"
        :value="stats.pendingPayments"
        icon="credit-card"
        border-color="#FF8040"
        @click="goToPayments"
      />
      <DashboardCard
        title="Unread Notifications"
        :value="notificationStore.unreadCount"
        icon="notification"
        border-color="#0046FF"
        :description="
          notificationStore.unreadCount > 0
            ? 'Requires attention'
            : 'All caught up'
        "
        @click="scrollToNotifications"
      />
    </section>

    <!-- ================= PROJECTS SECTION ================= -->
    <JobsSection
      :jobs="projects"
      :loading="loadingProjects"
      :current-page="currentPage"
      :total-pages="totalPages"
      @view="viewProject"
      @prev-page="prevPage"
      @next-page="nextPage"
    />

    <!-- ================= NOTIFICATIONS ================= -->
    <section
      ref="notificationsRef"
      class="bg-neutral-white rounded-xl shadow-md p-6 relative"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold text-primary-900">Notifications</h3>
        <button
          v-if="hasNotifications"
          @click="clearAllNotifications"
          :disabled="clearingNotifications"
          class="text-accent-500 hover:text-accent-400 font-medium"
        >
          {{ clearingNotifications ? 'Clearing...' : 'Clear All' }}
        </button>
      </div>

      <!-- Grouped notifications -->
      <div v-if="hasNotifications" class="space-y-6 max-h-96 overflow-y-auto">
        <NotificationGroup
          v-if="jobNotifications.length"
          title="Projects"
          :notifications="jobNotifications"
          color="blue"
          @clickNotification="handleNotificationClick"
          @delete="deleteNotification"
        />
        <NotificationGroup
          v-if="paymentNotifications.length"
          title="Payments"
          :notifications="paymentNotifications"
          color="yellow"
          @clickNotification="handleNotificationClick"
          @delete="deleteNotification"
        />
        <NotificationGroup
          v-if="systemNotifications.length"
          title="System Updates"
          :notifications="systemNotifications"
          color="gray"
          @clickNotification="handleNotificationClick"
          @delete="deleteNotification"
        />
      </div>

      <div v-else class="text-center py-8 text-primary-200">
        <p class="text-lg">No notifications yet</p>
        <p class="text-sm mt-1">You're all caught up!</p>
      </div>

      <!-- 🔔 Notification Splash -->
      <NotificationSplash />
    </section>

    <!-- ================= CTA ================= -->
    <section
      class="bg-accent-500 text-neutral-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between"
    >
      <h3 class="text-xl font-semibold">Need help with a new assignment?</h3>
      <RouterLink
        to="/client/post-job"
        class="mt-3 md:mt-0 bg-neutral-white text-accent-500 font-semibold px-5 py-2 rounded-lg hover:bg-primary-200 transition"
      >
        Post a Project
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import { useAuthStore } from '@/core/store/auth.js';
import { useNotificationStore } from '@/core/store/notificationStore';
import DashboardCard from '@/components/ui/DashboardCard.vue';
import JobsSection from '@/components/ui/JobsSection.vue';
import NotificationGroup from '@/components/ui/NotificationGroup.vue';
import NotificationSplash from '@/components/ui/NotificationSplash.vue';
import { clientApi } from '@/core/api/http.js';

/* ================= STATE ================= */
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const clientName = ref('Client');
const stats = ref({ active: 0, completed: 0, pendingPayments: 0 });
const projects = ref([]);
const loadingProjects = ref(true);
const clearingNotifications = ref(false);

/* ================= PAGINATION ================= */
const currentPage = ref(1);
const pageSize = 6;
const totalPages = ref(1);

/* ================= NOTIFICATIONS ================= */
const notificationsRef = ref(null);

const groupedNotifications = computed(
  () =>
    notificationStore.groupedNotifications || {
      job: [],
      payment: [],
      system: [],
    },
);
const jobNotifications = computed(() => groupedNotifications.value.job || []);
const paymentNotifications = computed(
  () => groupedNotifications.value.payment || [],
);
const systemNotifications = computed(
  () => groupedNotifications.value.system || [],
);
const hasNotifications = computed(
  () =>
    jobNotifications.value.length ||
    paymentNotifications.value.length ||
    systemNotifications.value.length,
);

const handleNotificationClick = async (notification) => {
  if (!notification.read) await notificationStore.markAsRead(notification._id);

  if (notification.type === 'job') router.push('/client/projects');
  if (notification.type === 'payment') router.push('/client/payments');
};

const deleteNotification = (id) => notificationStore.remove(id);
const clearAllNotifications = () => notificationStore.clearAll();
const scrollToNotifications = () =>
  notificationsRef.value?.scrollIntoView({ behavior: 'smooth' });

/* ================= API FUNCTIONS ================= */
const fetchStats = async () => {
  try {
    const { data } = await clientApi.getStats();
    stats.value = data?.stats || stats.value;
  } catch (err) {
    console.error('Fetch stats error:', err);
    Swal.fire('Error', 'Failed to fetch stats', 'error');
  }
};

const fetchProjects = async () => {
  loadingProjects.value = true;
  try {
    const { data } = await clientApi.getMyJobs({
      page: currentPage.value,
      limit: pageSize,
    });
    projects.value = data?.projects || [];
    totalPages.value = data?.totalPages || 1;
  } catch (err) {
    console.error('Fetch projects error:', err);
    Swal.fire('Error', 'Failed to fetch projects', 'error');
  } finally {
    loadingProjects.value = false;
  }
};

/* ================= NAVIGATION ================= */
const viewProject = (project) => router.push(`/client/projects/${project._id}`);
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProjects();
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchProjects();
  }
};
const goToProjects = (status) =>
  router.push(`/client/projects?status=${status}`);
const goToPayments = () => router.push('/client/payments');

/* ================= INIT ================= */
onMounted(async () => {
  try {
    if (!authStore.isInitialized) await authStore.initialize();
    await nextTick();

    if (authStore.isClient && authStore.user?.profile?.name) {
      clientName.value = authStore.user.profile.name;
    }

    await Promise.all([
      fetchStats(),
      fetchProjects(),
      notificationStore.loadNotifications(),
    ]);
  } catch (err) {
    console.error('Dashboard initialization failed:', err);
  }
});
</script>
