<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 px-4 py-2 mb-6 bg-white rounded-lg shadow-sm hover:shadow-md text-blue-700 font-medium"
    >
      <ArrowLeft class="w-5 h-5" />
      Back
    </button>

    <!-- Page Title -->
    <h2 class="text-3xl font-bold text-[#001BB7] mb-6">
      {{ assignment?.job?.title || "Assignment Details" }}
    </h2>

    <!-- Assignment Card -->
    <div v-if="assignment" class="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Client Info -->
        <div class="flex items-center gap-3">
          <User class="w-6 h-6 text-blue-600" />
          <p><strong>Client:</strong> {{ assignment.client?.name || "—" }}</p>
        </div>

        <!-- Deadline -->
        <div class="flex items-center gap-3">
          <Calendar class="w-6 h-6 text-blue-600" />
          <p><strong>Deadline:</strong> {{ formatDate(assignment.dueDate) }}</p>
        </div>

        <!-- Status -->
        <div class="flex items-center gap-3">
          <Tag class="w-6 h-6 text-blue-600" />
          <p>
            <strong>Status:</strong>
            <span :class="statusBadgeClass(assignment.status)">
              {{ assignment.status?.replace(/_/g, " ") }}
            </span>
          </p>
        </div>

        <!-- Earnings Overview -->
        <div class="flex items-center gap-3">
          <CreditCard class="w-6 h-6 text-blue-600" />
          <div>
            <p>
              <strong>Client Pays:</strong> Ksh
              {{ assignment.budget?.toLocaleString() || "—" }}
            </p>
            <p><strong>Platform Fee (15%):</strong> Ksh {{ platformFee }}</p>
            <p class="font-semibold text-green-700">
              <strong>You Earn (85%):</strong> Ksh {{ expertEarnings }}
            </p>
          </div>
        </div>

        <!-- Time Remaining -->
        <div
          v-if="isInProgress || isInReview"
          class="flex items-center gap-3 font-semibold text-red-600"
        >
          <Clock class="w-6 h-6" />
          <p>Time Remaining: {{ displayTimeRemaining }}</p>
        </div>
      </div>

      <!-- Job Description -->
      <div class="mt-6">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <FileText class="w-6 h-6 text-blue-600" /> Job Description
        </h3>
        <p class="mt-2 text-gray-700 whitespace-pre-wrap">
          {{ assignment.job?.description || "No description provided." }}
        </p>
      </div>

      <!-- Assignment Actions -->
      <div v-if="isAssigned" class="mt-6">
        <BaseButton :loading="confirming[assignment._id]" @click="confirmAssignment">
          Start Work
        </BaseButton>
      </div>

      <!-- Submit Work -->
      <div v-if="isInProgress" class="mt-6 space-y-4">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <Upload class="w-6 h-6 text-blue-600" /> Submit Finished Work
        </h3>

        <input
          type="file"
          name="finalWork"
          @change="handleFileUpload"
          class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        <BaseButton :loading="submitting" @click="submitWork"> Submit Work </BaseButton>

        <transition name="fade">
          <p
            v-if="submissionSuccess"
            class="text-green-600 font-medium mt-2 flex items-center gap-2"
          >
            <CheckCircle class="w-5 h-5" /> Work submitted successfully!
          </p>
        </transition>
      </div>
    </div>

    <!-- Chat Section -->
    <div
      v-if="assignment?.chatThreadId && isInProgress"
      class="mt-10 bg-white rounded-2xl shadow-lg h-[500px]"
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

    <!-- Loading / Not Found Fallback -->
    <p v-if="loading" class="text-gray-500 text-center mt-6">Loading assignment...</p>

    <p v-if="!assignment && !loading" class="text-gray-500 text-center mt-6">
      Assignment not found.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ChatThread from "@/components/ui/chat/ChatThread.vue";
import { useExpertAssignment } from "@/composables/useExpertAssignment";
import { useAuth } from "@/composables/useAuth";
import { useChat } from "@/composables/chat/useChat";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  CreditCard,
  Clock,
  Upload,
  Tag,
  CheckCircle,
} from "lucide-vue-next";

/* ================= PROPS ================= */
const props = defineProps({
  assignmentId: {
    type: String,
    required: true,
  },
});

/* ================= AUTH ================= */
const { user } = useAuth();
const currentUserId = computed(() => user.value?._id);
const isAdmin = computed(() => user.value?.role === "admin");
const currentUserRole = computed(() => "Expert");

/* ============ ASSIGNMENT LOGIC ============ */
const {
  assignment,
  loading,
  confirming,
  submitting,
  fetchAssignment,
  formatDate,
  statusBadgeClass,
  confirmAssignment,
  handleFileUpload,
  submitWork,
} = useExpertAssignment({ assignmentId: props.assignmentId });

const selectedFile = ref(null);
const submissionSuccess = ref(false);

/* ============ STATUS COMPUTED ============ */
const normalizedStatus = computed(() => assignment.value?.status?.toLowerCase() || "");
const isInProgress = computed(() => normalizedStatus.value === "in_progress");
const isAssigned = computed(() => normalizedStatus.value === "assigned");
const isInReview = computed(() => normalizedStatus.value === "in_review");

/* ============ COUNTDOWN TIMER ============ */
const displayTimeRemaining = ref("Calculating…");
let intervalId = null;

const updateTimeRemaining = () => {
  if (!assignment.value?.dueDate) return;
  const diff = new Date(assignment.value.dueDate) - new Date();
  if (diff <= 0) {
    displayTimeRemaining.value = "Expired";
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  displayTimeRemaining.value = `${d}d ${h}h ${m}m ${s}s`;
};

watch(
  () => assignment.value,
  () => {
    updateTimeRemaining();
    if (intervalId) clearInterval(intervalId);
    if (isInProgress.value) intervalId = setInterval(updateTimeRemaining, 1000);
  },
  { immediate: true }
);

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

/* ============ CHAT ================= */
const chatThreadId = computed(() => {
  const thread = assignment.value?.chatThreadId;
  return typeof thread === "string" ? thread : thread?._id || null;
});

const canAccessChatRef = computed(() => chatThreadId.value && isInProgress.value);

const {
  messages: chatMessages,
  participants: chatParticipants,
  loading: chatLoading,
  sendMessage,
} = useChat(
  chatThreadId,
  canAccessChatRef,
  { _id: currentUserId.value, role: currentUserRole.value },
  isAdmin.value
);

/* ============ EARNINGS ================= */
const platformFee = computed(() =>
  assignment.value?.budget ? Math.round(assignment.value.budget * 0.15) : 0
);
const expertEarnings = computed(() =>
  assignment.value?.budget ? Math.round(assignment.value.budget * 0.85) : 0
);

/* ============ LOAD ASSIGNMENT ================= */
const loadAssignment = async () => {
  submissionSuccess.value = false;
  await fetchAssignment();
};

/* WATCH ASSIGNMENT ID CHANGES */
watch(
  () => props.assignmentId,
  () => loadAssignment(),
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
