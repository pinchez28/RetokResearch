<template>
  <section class="notifications-section py-2 w-full space-y-6">
    <!-- 🧰 JOB THREADS -->
    <div v-if="jobThreads.length">
      <h3 class="group-title">🧰 Job Updates</h3>

      <div class="space-y-4 max-h-[400px] overflow-y-auto">
        <JobThread
          v-for="thread in jobThreads"
          :key="thread.jobId"
          :jobTitle="thread.jobTitle"
          :notifications="thread.notifications"
          :unreadCount="thread.unreadCount"
          @handleNotificationClick="handleClick"
          @deleteNotification="handleDelete"
        />
      </div>
    </div>

    <!-- 💰 PAYMENT -->
    <div v-if="groups.payment.length">
      <h3 class="group-title">💰 Payments</h3>
      <div class="space-y-4 max-h-[400px] overflow-y-auto">
        <NotificationCard
          v-for="n in groups.payment"
          :key="n._id"
          :notification="n"
          :deleting="deletingNotification === n._id"
          @click="handleClick(n)"
          @delete="handleDelete(n._id)"
        />
      </div>
    </div>

    <!-- ⚙️ SYSTEM -->
    <div v-if="groups.system.length">
      <h3 class="group-title">⚙️ System</h3>
      <div class="space-y-4 max-h-[400px] overflow-y-auto">
        <NotificationCard
          v-for="n in groups.system"
          :key="n._id"
          :notification="n"
          :deleting="deletingNotification === n._id"
          @click="handleClick(n)"
          @delete="handleDelete(n._id)"
        />
      </div>
    </div>

    <!-- EMPTY -->
    <div
      v-if="!jobThreads.length && !groups.payment.length && !groups.system.length"
      class="text-primary-400 mt-10"
    >
      No notifications yet.
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import NotificationCard from "@/components/ui/NotificationCard.vue";
import JobThread from "@/components/ui/JobThread.vue";

/* === PROPS === */
const props = defineProps({
  groups: {
    type: Object,
    required: true,
  },
  threadedJobs: {
    type: Array,
    required: true,
  },
  deletingNotification: {
    type: [String, Number],
    default: null,
  },
});

/* === EMITS === */
const emit = defineEmits(["handleNotificationClick", "deleteNotification"]);

/* === COMPUTED === */
const jobThreads = computed(() => props.threadedJobs);

/* === HANDLERS === */
const handleClick = (notification) => {
  emit("handleNotificationClick", notification);
};

const handleDelete = (id) => {
  emit("deleteNotification", id);
};
</script>

<style scoped>
.notifications-section {
  max-width: 800px;
}

.group-title {
  font-weight: 600;
  color: var(--color-primary-700);
  margin-bottom: 0.5rem;
}
</style>
