<template>
  <div class="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
    <!-- ================= HEADER ================= -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0"
    >
      <button
        @click="$router.back()"
        class="px-4 py-2 border rounded-lg bg-white shadow-sm hover:shadow-md text-blue-600 transition"
      >
        ← Back
      </button>

      <div class="flex flex-wrap items-center gap-3">
        <span
          class="px-4 py-1 rounded-full text-sm font-semibold transition"
          :class="healthBadge.class"
        >
          {{ healthBadge.label }}
        </span>

        <button
          @click="assignExpert(job)"
          :disabled="!!job.hiredExpertId"
          class="px-5 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
        >
          Assign Expert
        </button>

        <button
          @click="overrideAssignment"
          class="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Override
        </button>

        <button
          @click="deleteJob(job._id)"
          class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- ================= TITLE ================= -->
    <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
      {{ job.title || "Job Details" }}
    </h1>

    <!-- ================= KPI STRIP ================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <!-- Progress -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h3 class="text-sm text-gray-500 mb-2">Progress</h3>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="h-4 rounded-full transition-all duration-500 ease-in-out"
            :class="progressColor"
            :style="{ width: progressWidth }"
          ></div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-700">{{ progressText }}</p>
      </div>

      <!-- Budget -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h3 class="text-sm text-gray-500 mb-2">Budget</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ proposal?.quote ?? job.pricingRange?.min ?? "—" }}
        </p>
      </div>

      <!-- Delivery -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h3 class="text-sm text-gray-500 mb-2">Delivery</h3>
        <p class="text-2xl font-bold text-blue-600">{{ deliveryText }}</p>
      </div>

      <!-- Risk -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h3 class="text-sm text-gray-500 mb-2">Risk</h3>
        <p class="text-2xl font-bold" :class="riskColor">{{ riskLabel }}</p>
      </div>
    </div>

    <!-- ================= DETAILS GRID ================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <!-- CLIENT DETAILS -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Client</h2>
        <p class="text-gray-600">
          Name:
          <span class="font-medium">{{
            chatParticipants.client?.name || job.client?.name || "—"
          }}</span>
        </p>
        <p class="text-gray-600">
          Email:
          <span class="font-medium">{{
            chatParticipants.client?.email || job.client?.email || "—"
          }}</span>
        </p>
        <p class="text-gray-600">
          Phone:
          <span class="font-medium">{{
            chatParticipants.client?.phone || job.client?.phone || "—"
          }}</span>
        </p>
      </div>

      <!-- EXPERT DETAILS -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Expert</h2>
        <p class="text-gray-600">
          Name:
          <span class="font-medium">{{
            chatParticipants.expert?.name || assignment?.expert?.name || "—"
          }}</span>
        </p>
        <p class="text-gray-600">
          Email:
          <span class="font-medium">{{
            chatParticipants.expert?.email || assignment?.expert?.email || "—"
          }}</span>
        </p>
        <p class="text-gray-600">
          Phone:
          <span class="font-medium">{{
            chatParticipants.expert?.phone || assignment?.expert?.phone || "—"
          }}</span>
        </p>
      </div>

      <!-- ADMIN DETAILS -->
      <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Admin</h2>
        <p class="text-gray-600">
          Name:
          <span class="font-medium">{{ authStore.user?.name || "—" }}</span>
        </p>
        <p class="text-gray-600">
          Email:
          <span class="font-medium">{{ authStore.user?.email || "—" }}</span>
        </p>
      </div>
    </div>

    <!-- ================= DESCRIPTION ================= -->
    <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Description</h2>
      <p class="text-gray-700">
        {{ job.description || "No description provided" }}
      </p>
    </div>

    <!-- ================= CHAT SECTION ================= -->
    <div
      v-if="assignment?.chatThreadId && isInProgress"
      class="mt-10 bg-white rounded-2xl shadow-lg h-[500px] overflow-hidden"
    >
      <ChatThread
        :thread-id="assignment.chatThreadId"
        :messages="chatMessages"
        :participants="chatParticipants"
        :loading="chatLoading"
        :current-user-id="currentUserId"
        :current-user-role="currentUserRole"
        :admin-mode="isAdmin"
        :status="assignment.status"
        @send="sendMessage"
      />
    </div>

    <p v-else-if="!chatThread" class="text-gray-500 text-center py-10">
      No chat thread available.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { adminApi, chatApi } from "@/core/api/http";
import { useAuthStore } from "@/core/store/auth";
import ChatThread from "@/components/ui/chat/ChatThread.vue";

/* ================= ROUTE + AUTH ================= */
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

/* ================= STATE ================= */
const job = ref({});
const assignment = ref(null);
const proposal = ref(null);
const chatThread = ref(null);

const chatMessages = ref([]);
const chatParticipants = ref({ client: null, expert: null, admin: null });
const chatLoading = ref(false);

/* ================= AUTH INFO ================= */
const currentUserId = computed(() => authStore.user?._id || null);
const currentUserRole = "admin";
const isAdmin = true;

/* ================= PROGRESS BASED ON STATUS ================= */
const progressValue = computed(() => {
  switch (job.value.status) {
    case "pending_admin_review":
    case "admin_rejected":
      return 0;
    case "approved_for_bidding":
      return 20;
    case "assigned":
      return 40;
    case "in_progress":
      return 60;
    case "appealed_for_revision":
      return 65;
    case "in_review":
      return 70;
    case "downloaded":
      return 80;
    case "completed":
      return 100;
    default:
      return 0;
  }
});

const progressText = computed(() => `${progressValue.value}%`);
const progressWidth = computed(() => `${progressValue.value}%`);

const deliveryText = computed(() =>
  assignment.value?.deliveryTime ? assignment.value.deliveryTime + " days" : "—"
);

const progressColor = computed(() =>
  progressValue.value < 50
    ? "bg-yellow-500"
    : progressValue.value < 80
    ? "bg-blue-500"
    : "bg-green-600"
);

const isLate = computed(
  () => job.value.deadline && new Date(job.value.deadline) < new Date()
);

const riskLabel = computed(() =>
  isLate.value ? "High" : progressValue.value < 50 ? "Medium" : "Low"
);

const riskColor = computed(() =>
  isLate.value
    ? "text-red-600"
    : progressValue.value < 50
    ? "text-yellow-600"
    : "text-green-600"
);

const healthBadge = computed(() => {
  if (isLate.value) return { label: "Critical", class: "bg-red-100 text-red-700" };
  if (progressValue.value < 50)
    return { label: "At Risk", class: "bg-yellow-100 text-yellow-700" };
  return { label: "Healthy", class: "bg-green-100 text-green-700" };
});

const activeWorkflowStatuses = [
  "assigned",
  "in_progress",
  "ready",
  "downloaded",
  "in_review",
  "appealed_for_revision",
];

const isInProgress = computed(() => activeWorkflowStatuses.includes(job.value.status));

/* ================= ACTIONS ================= */
const fetchJobDetails = async () => {
  try {
    const { data } = await adminApi.getJobById(route.params.jobId);

    console.log("ADMIN JOB DETAILS RESPONSE 👉", data.data);

    job.value = data.data.job;
    assignment.value = data.data.assignment;
    proposal.value = data.data.proposal;
    chatThread.value = data.data.chatThread ?? null;

    if (chatThread.value) {
      chatParticipants.value = {
        client: chatThread.value.clientUser ?? job.value.client ?? null,
        expert: chatThread.value.expertUser ?? assignment.value?.expert ?? null,
        admin: chatThread.value.adminUser ?? authStore.user ?? null,
      };
      chatMessages.value = chatThread.value.messages ?? [];
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load job details", "error");
  }
};

const sendMessage = async (content) => {
  if (!content?.trim() || !assignment.value?.chatThreadId) return;

  try {
    chatLoading.value = true;
    await chatApi.sendMessage(assignment.value.chatThreadId, content);
    const { data } = await chatApi.getThread(assignment.value.chatThreadId);
    chatMessages.value = data.messages ?? [];
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to send message", "error");
  } finally {
    chatLoading.value = false;
  }
};

const assignExpert = (job) =>
  router.push({ name: "AssignExpert", params: { jobId: job._id } });

const overrideAssignment = async () => {
  await Swal.fire("Override applied (placeholder)");
};

const deleteJob = async (id) => {
  const result = await Swal.fire({
    title: "Delete Job?",
    showCancelButton: true,
  });
  if (!result.isConfirmed) return;

  await adminApi.deleteJob(id);
  router.push({ name: "ActiveJobs" });
};

/* ================= LIFECYCLE ================= */
onMounted(fetchJobDetails);
</script>
