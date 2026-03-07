<template>
  <div class="p-6 md:p-10 space-y-8 min-h-screen">
    <!-- HEADER -->
    <section
      class="bg-primary-900 text-neutral-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center"
    >
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-white">
            Welcome, {{ expertName }} 👋
          </h1>
          <p class="mt-2 opacity-90 font-light text-gray-200">
            Track your projects, earnings, and find new opportunities.
          </p>

          <div class="mt-3 flex gap-4">
            <span class="px-3 py-1 bg-white/20 rounded-full text-sm">{{
              expertSpecialization
            }}</span>
            <span class="px-3 py-1 bg-warning-200/20 rounded-full text-sm"
              >{{ stats.approvalRate || '0%' }} Success Rate</span
            >
          </div>
        </div>

        <div class="mt-4 md:mt-0 text-right">
          <p class="text-2xl font-bold text-white">
            KES {{ stats.totalEarnings?.toLocaleString() || 0 }}
          </p>
          <p class="text-sm opacity-80 text-white">Total Earnings</p>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Active Projects"
        :value="stats.activeProjects || 0"
        icon="project"
        @click="router.push('/expert/assignments')"
      />
      <DashboardCard
        title="Pending Proposals"
        :value="stats.pendingProposals || 0"
        icon="proposal"
        @click="router.push('/expert/proposals')"
      />
      <DashboardCard
        title="Completed Jobs"
        :value="stats.completedJobs || 0"
        icon="completed"
        @click="router.push('/expert/projects?status=completed')"
      />
      <DashboardCard
        title="Unread Notifications"
        :value="notificationStore.unreadCount || 0"
        icon="notification"
        :description="
          notificationStore.unreadCount > 0
            ? 'Requires attention'
            : 'All caught up'
        "
        @click="scrollToNotifications"
      />
    </section>

    <!-- AVAILABLE JOBS -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Available Jobs</h2>
      <JobsSection
        :jobs="availableJobs"
        :loading="loadingJobs"
        @viewJob="goToAvailableJobs"
      />
    </section>

    <!-- PROPOSALS -->
    <ProposalsSection
      v-if="visibleProposals.length > 0"
      :proposals="visibleProposals"
      :loading="loadingProposals"
      @viewProposalDetails="viewProposalDetails"
      @confirmJob="confirmJob"
    />

    <!-- NOTIFICATIONS -->
    <section ref="notificationsRef" class="bg-white rounded-xl shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold">Notifications</h3>
        <button
          v-if="hasNotifications"
          @click="clearAllNotifications"
          class="text-red-600 hover:text-red-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div v-if="hasNotifications" class="space-y-6 max-h-96 overflow-y-auto">
        <NotificationGroup
          v-if="jobNotifications.length"
          title="Jobs & Projects"
          :notifications="jobNotifications"
          color="blue"
          @clickNotification="handleNotificationClick"
          @delete="deleteNotification"
        />
        <NotificationGroup
          v-if="paymentNotifications.length"
          title="Payments & Earnings"
          :notifications="paymentNotifications"
          color="yellow"
          @clickNotification="handleNotificationClick"
          @delete="deleteNotification"
        />
        <NotificationGroup
          v-if="systemNotifications.length"
          title="System & Updates"
          :notifications="systemNotifications"
          color="gray"
          @clickNotification="handleNotificationClick"
          @delete="deleteNotification"
        />
      </div>

      <div v-else class="text-center text-gray-500 py-8">
        You're all caught up 🎉
      </div>
      <NotificationSplash />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/core/api/http';
import { useNotificationStore } from '@/core/store/notificationStore';
import { expertApi } from '@/core/api/http.js';

import DashboardCard from '@/components/ui/DashboardCard.vue';
import JobsSection from '@/components/ui/JobsSection.vue';
import ProposalsSection from '@/components/ui/ProposalsSection.vue';
import NotificationGroup from '@/components/ui/NotificationGroup.vue';
import NotificationSplash from '@/components/ui/NotificationSplash.vue';

/* ================= ROUTER & STORE ================= */
const router = useRouter();
const notificationStore = useNotificationStore();

/* ================= STATE ================= */
const loadingProfile = ref(true);

const expertName = ref('');
const expertSpecialization = ref('');

const stats = ref({
  activeProjects: 0,
  pendingProposals: 0,
  completedJobs: 0,
  totalEarnings: 0,
  approvalRate: '0%',
});

const availableJobs = ref([]);
const proposals = ref([]);

const loadingJobs = ref(true);
const loadingProposals = ref(true);

const notificationsRef = ref(null);

/* ================= NOTIFICATIONS ================= */
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

  if (notification.type === 'job') router.push('/expert/assignments');

  if (notification.type === 'payment') router.push('/expert/earnings');
};

const deleteNotification = (id) => notificationStore.remove(id);

const clearAllNotifications = () => notificationStore.clearAll();

const scrollToNotifications = () =>
  notificationsRef.value?.scrollIntoView({
    behavior: 'smooth',
  });

/* ================= PROPOSAL VISIBILITY ================= */
const PROPOSAL_VISIBILITY_DAYS = 7;

const visibleProposals = computed(() => {
  const cutoff = Date.now() - PROPOSAL_VISIBILITY_DAYS * 86400000;

  return (proposals.value || []).filter((p) => {
    if (p.job?.status === 'assigned') return true;

    const created = new Date(p.createdAt).getTime();
    return created >= cutoff;
  });
});

/* ================= API CALLS ================= */

const fetchExpertProfile = async () => {
  try {
    const response = await expertApi.getProfile();
    const expert = response?.data;

    if (expert) {
      expertName.value = expert.name ?? '';
      expertSpecialization.value = expert.specialization ?? '';
    }
  } catch (err) {
    console.error('Failed to fetch expert profile:', err);
  } finally {
    loadingProfile.value = false;
  }
};

const fetchStats = async () => {
  try {
    const { data } = await api.get('/expert/stats');
    if (data?.success) stats.value = data.stats || stats.value;
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
};

const fetchAvailableJobs = async () => {
  loadingJobs.value = true;
  try {
    const { data } = await api.get('/expert/jobs', {
      params: { status: 'approved_for_bidding' },
    });
    availableJobs.value = data.jobs || [];
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    availableJobs.value = [];
  } finally {
    loadingJobs.value = false;
  }
};

const fetchProposals = async () => {
  loadingProposals.value = true;
  try {
    const { data } = await api.get('/expert/proposals');
    proposals.value = data.proposals || [];
  } catch (err) {
    console.error('Failed to fetch proposals:', err);
    proposals.value = [];
  } finally {
    loadingProposals.value = false;
  }
};

/* ================= ACTIONS ================= */

const confirmJob = async (jobId) => {
  try {
    await api.post(`/expert/assignments/${jobId}/confirm`);

    await fetchStats();
    await fetchProposals();

    router.push('/expert/assignments');
  } catch (err) {
    console.error('Failed to confirm job:', err);
  }
};

const goToAvailableJobs = () => router.push('/expert/jobs');

const viewProposalDetails = (p) => router.push(`/expert/proposals/${p._id}`);

/* ================= INIT ================= */

onMounted(async () => {
  await Promise.all([
    fetchExpertProfile(),
    fetchStats(),
    fetchAvailableJobs(),
    fetchProposals(),
  ]);

  await notificationStore.loadNotifications();
});
</script>
