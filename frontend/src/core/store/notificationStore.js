import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/core/store/auth';
import {
  fetchNotifications,
  markNotificationsRead,
  clearAllNotifications,
  deleteNotification as deleteNotificationApi,
} from '@/core/api/notificationApi.js';
import { initNotificationSocket } from '@/core/socket/notificationSocket.js';

/* ================= DATE HELPERS ================= */
const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const isYesterday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
};

/* ================= TYPE → UI GROUP MAP ================= */
const TYPE_GROUP_MAP = {
  Job: 'job',
  JobPosted: 'job',
  JobUpdated: 'job',
  JobCancelled: 'job',

  ProposalSubmitted: 'job',
  ProposalAccepted: 'job',
  ProposalRejected: 'job',

  ExpertHired: 'job',
  ExpertConfirmed: 'job',
  AssignmentCreated: 'job',
  AssignmentSubmitted: 'job',
  AssignmentApproved: 'job',
  AssignmentRejected: 'job',

  WorkInProgress: 'job',
  JobCompleted: 'job',

  Payment: 'payment',
  PaymentInitiated: 'payment',
  PaymentCompleted: 'payment',
  PaymentFailed: 'payment',

  Payout: 'payment',
  PayoutRequested: 'payment',
  PayoutCompleted: 'payment',

  System: 'system',
  General: 'system',
  AdminAction: 'system',
  AccountUpdate: 'system',

  ExpertSignup: 'system',
  ExpertApproved: 'system',
  ExpertRejected: 'system',

  ClientSignup: 'system',

  GuestRequest: 'job',
  GuestService: 'job',
};

export const useNotificationStore = defineStore('notification', () => {
  /* ================= STATE ================= */
  const notifications = ref([]);
  const splashNotification = ref(null);
  const loading = ref(false);

  /* ================= GETTERS ================= */
  const unreadCount = computed(() =>
    notifications.value.reduce((count, n) => count + (n?.read ? 0 : 1), 0)
  );

  const groupedNotifications = computed(() => {
    return notifications.value.reduce(
      (groups, n) => {
        const group = TYPE_GROUP_MAP[n?.type] || 'system';
        groups[group].push(n);
        return groups;
      },
      {
        job: [],
        payment: [],
        system: [],
      }
    );
  });

  const timeGroupedNotifications = computed(() => {
    return notifications.value.reduce(
      (groups, n) => {
        if (isToday(n?.createdAt)) groups.today.push(n);
        else if (isYesterday(n?.createdAt)) groups.yesterday.push(n);
        else groups.older.push(n);
        return groups;
      },
      {
        today: [],
        yesterday: [],
        older: [],
      }
    );
  });

  const threadedJobNotifications = computed(() => {
    const threads = Object.create(null);

    for (const n of notifications.value) {
      if (!n?.jobId) continue;

      const jobKey = typeof n.jobId === 'object' ? n.jobId._id : n.jobId;
      if (!jobKey) continue;

      if (!threads[jobKey]) {
        threads[jobKey] = {
          jobId: jobKey,
          jobTitle: n.jobTitle || 'Job Updates',
          unreadCount: 0,
          notifications: [],
        };
      }

      threads[jobKey].notifications.push(n);
      if (!n.read) threads[jobKey].unreadCount++;
    }

    return Object.values(threads);
  });

  /* ================= ACTIONS ================= */

  async function loadNotifications() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    loading.value = true;
    try {
      const res = await fetchNotifications();
      const list = Array.isArray(res?.notifications)
        ? res.notifications
        : Array.isArray(res)
        ? res
        : [];
      notifications.value = list.filter((n) => n && !n.deleted);
    } catch (err) {
      if (err?.response?.status === 401) {
        await authStore.logout();
      }
      notifications.value = [];
    } finally {
      loading.value = false;
    }
  }

  // ➕ Add notification (socket / realtime)
  function addNotification(notif) {
    if (!notif?._id) return;

    const exists = notifications.value.some((n) => n._id === notif._id);
    if (exists) return;

    notifications.value.unshift(notif);

    splashNotification.value = notif;
    window.setTimeout(() => {
      splashNotification.value = null;
    }, 4000);
  }

  // 🔄 Mark as read
  async function markAsRead(id) {
    const n = notifications.value.find((n) => n._id === id);
    if (!n || n.read) return;

    n.read = true;
    try {
      await markNotificationsRead([id]);
    } catch {
      n.read = false;
    }
  }

  // 🧹 Delete single notification
  async function remove(id) {
    const previous = notifications.value.slice();
    notifications.value = notifications.value.filter((n) => n._id !== id);

    try {
      await deleteNotificationApi(id);
    } catch {
      notifications.value = previous;
    }
  }

  // 🧹 Clear all notifications
  async function clearAll() {
    const previous = notifications.value.slice();
    notifications.value = [];

    try {
      await clearAllNotifications();
    } catch {
      notifications.value = previous;
    }
  }

  // 🔌 Socket init
  let socketInitialized = false;
  function initSocket(role) {
    if (socketInitialized) return;
    socketInitialized = true;
    initNotificationSocket(role);
  }

  // 🔍 Utility
  function getNotificationById(id) {
    return notifications.value.find((n) => n._id === id);
  }

  /* ================= EXPORT ================= */
  return {
    // state
    notifications,
    splashNotification,
    loading,

    // getters
    unreadCount,
    groupedNotifications,
    timeGroupedNotifications,
    threadedJobNotifications,

    // actions
    loadNotifications,
    addNotification,
    markAsRead,
    remove,
    clearAll,
    initSocket,

    // utils
    getNotificationById,

    // 🔹 LEGACY ALIAS for AdminLayout.vue
    triggerSplash: addNotification,
  };
});
