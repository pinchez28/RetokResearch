<template>
  <div class="min-h-screen bg-slate-50 px-6 py-8">
    <!-- Back -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-indigo-600"
    >
      <ArrowLeft class="w-4 h-4" />
      Back to projects
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-24 text-slate-500">
      Loading project details…
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-24 text-red-600">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="project" class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div class="flex items-start justify-between gap-6">
          <div>
            <h1 class="text-2xl font-semibold text-slate-800">
              {{ project.title }}
            </h1>
            <p class="mt-1 text-slate-600 max-w-3xl">
              {{ project.description }}
            </p>
          </div>
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            :class="statusBadgeClass"
          >
            <CircleDot class="w-3.5 h-3.5" />
            {{ project.status }}
          </span>
        </div>

        <!-- Meta -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <p><strong>Deadline:</strong> {{ formatDate(project.dueDate) }}</p>
          <p><strong>Budget:</strong> {{ project.budget || "N/A" }}</p>
          <p><strong>Assigned At:</strong> {{ formatDate(project.assignedAt) }}</p>
          <p><strong>Started At:</strong> {{ formatDate(project.startedAt) }}</p>
          <p>
            <strong>Submitted At:</strong>
            {{ project.submittedAt ? formatDate(project.submittedAt) : "—" }}
          </p>
          <p>
            <strong>Expert:</strong>
            {{ project.expert?.name || "Not assigned" }}
          </p>
        </div>
      </section>

      <!-- Final Submission -->
      <section
        v-if="project.finalWorkUrl"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center gap-4"
      >
        <h2 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText class="w-5 h-5 text-indigo-600" />
          Final Submission
        </h2>

        <!-- Big Animated Icon -->
        <Download
          :class="downloadIconClass"
          class="w-16 h-16 mb-3 transition-transform"
        />

        <!-- Download / Payment Button -->
        <button
          @click="handleDownload"
          :disabled="downloading"
          :class="downloadButtonClass"
        >
          <span v-if="downloading" class="flex items-center gap-2">
            <Loader2 class="w-5 h-5 animate-spin" />
            Downloading...
          </span>
          <span v-else>
            {{ project.paymentConfirmed ? "Download Now" : "Go to Payment" }}
          </span>
        </button>

        <!-- Info Text -->
        <p
          v-if="!project.paymentConfirmed"
          class="mt-2 text-xs text-slate-500 text-center"
        >
          Payment must be confirmed before accessing the final submission.
        </p>
      </section>

      <!-- Revision Portal -->
      <section
        v-if="project.status === 'downloaded' && revisionWindowOpen"
        class="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 flex flex-col items-center gap-4"
      >
        <h3 class="text-lg font-extrabold text-amber-700 uppercase">
          Request Revision (Available for 48 hours)
        </h3>
        <textarea
          v-model="revisionNote"
          placeholder="Write your revision note..."
          class="w-full border border-slate-300 rounded-lg p-3 text-sm"
        ></textarea>
        <button
          @click="submitRevision"
          class="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Submit Revision
        </button>
      </section>

      <!-- Chat -->
      <section
        v-if="assignment?.chatThreadId && isChatActive"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <MessageSquare class="w-5 h-5 text-indigo-600" />
          <h3 class="text-sm font-semibold text-slate-800">Project Communication</h3>
        </div>
        <div class="h-[520px]">
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
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { clientApi, chatApi } from "@/core/api/http";
import { useAuthStore } from "@/core/store/auth";

/* Icons */
import {
  ArrowLeft,
  CircleDot,
  FileText,
  Download,
  MessageSquare,
  Loader2,
} from "lucide-vue-next";

/* Components */
import ChatThread from "@/components/ui/chat/ChatThread.vue";

/* Route & Auth */
const route = useRoute();
const router = useRouter();
const projectId = route.params.projectId;
const authStore = useAuthStore();
const currentUserId = authStore.user?._id;
const currentUserRole = authStore.user?.role;
const isAdmin = computed(() => currentUserRole === "Admin");

/* State */
const project = ref(null);
const loading = ref(true);
const error = ref("");
const downloading = ref(false);
const revisionNote = ref("");
const requestingConfirmation = ref(false);

/* Chat */
const chatThread = ref(null);
const chatMessages = ref([]);
const chatParticipants = ref([]);
const chatLoading = ref(false);

/* Computed */
const assignment = computed(() =>
  project.value
    ? {
        chatThreadId: project.value.chatThreadId,
        status: project.value.status,
      }
    : null
);

const isChatActive = computed(() =>
  ["in_progress", "appealed_for_revision"].includes(project.value?.status)
);

const statusBadgeClass = computed(() => {
  const map = {
    assigned: "bg-sky-50 text-sky-700",
    in_progress: "bg-indigo-50 text-indigo-700",
    ready: "bg-emerald-50 text-emerald-700",
    downloaded: "bg-blue-50 text-blue-700",
    in_review: "bg-amber-50 text-amber-700",
    appealed_for_revision: "bg-orange-50 text-orange-700",
    completed: "bg-emerald-50 text-emerald-700",
  };
  return map[project.value?.status] || "bg-slate-100 text-slate-700";
});

/* Helpers */
function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
}

/* Revision Window */
const revisionWindowOpen = computed(() => {
  if (!project.value?.downloadedAt) return false;
  const downloadedAt = new Date(project.value.downloadedAt);
  const now = new Date();
  const hoursPassed = (now - downloadedAt) / (1000 * 60 * 60);
  return hoursPassed <= 48 && !project.value.revisionRequestedAt;
});

/* API */
async function loadProject() {
  loading.value = true;
  error.value = "";
  try {
    const res = await clientApi.getProjectById(projectId);
    project.value = res.data.project;

    // Auto-complete project if 48h passed and no revision
    autoCompleteProject();

    if (project.value?.chatThreadId) {
      await fetchChatThread();
    }
  } catch {
    error.value = "Failed to load project details.";
  } finally {
    loading.value = false;
  }
}

async function requestPaymentConfirmation() {
  if (requestingConfirmation.value) return;

  requestingConfirmation.value = true;

  try {
    const res = await clientApi.requestPaymentConfirmation(project.value._id);

    alert(res.data.message || "Request sent to admin");

    project.value.manualPaymentRequested = true;
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message ||
        "Failed to request payment confirmation"
    );
  } finally {
    requestingConfirmation.value = false;
  }
}

async function fetchChatThread() {
  chatLoading.value = true;
  try {
    const res = await chatApi.getThread(project.value.chatThreadId);
    chatThread.value = res.data;
    chatMessages.value = res.data.messages || [];
    chatParticipants.value = res.data.participants || [];
    await nextTick();
  } finally {
    chatLoading.value = false;
  }
}

async function sendMessage(content) {
  if (!content?.trim()) return;
  await chatApi.sendMessage(project.value.chatThreadId, content);
  await fetchChatThread();
}

/* Download / Go to Payment */
async function handleDownload() {
  if (!project.value.paymentConfirmed) {
    router.push({ name: "Payments", params: { projectId } });
    return;
  }

  downloading.value = true;

  try {
    const res = await clientApi.downloadWork(project.value._id);

    const contentDisposition = res.headers["content-disposition"];
    let fileName = "downloaded-file";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match?.[1]) fileName = match[1];
    }

    const blob = res.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    // ✅ Update backend that project is downloaded
    const updateRes = await clientApi.markProjectDownloaded(project.value._id);

    // Merge download updates into existing project instead of replacing it
    project.value = {
      ...project.value,
      ...updateRes.data.project,
      assignment: updateRes.data.assignment || project.value.assignment,
      job: updateRes.data.job || project.value.job,
    };
  } catch (err) {
    console.error("Download failed:", err);
    alert("Download failed. Please try again.");
  } finally {
    downloading.value = false;
  }
}

/* Submit Revision */
async function submitRevision() {
  if (!revisionNote.value.trim()) return alert("Enter a revision note");
  try {
    await clientApi.requestRevision(project.value._id, revisionNote.value.trim());
    alert("Revision requested successfully!");
    project.value.revisionRequestedAt = new Date();
  } catch (err) {
    console.error(err);
    alert("Failed to request revision.");
  }
}

/* Auto-complete project after 48h */
async function autoCompleteProject() {
  if (!project.value.downloadedAt) return;

  const downloadedAt = new Date(project.value.downloadedAt);
  const now = new Date();
  const hoursPassed = (now - downloadedAt) / (1000 * 60 * 60);

  if (hoursPassed > 48 && !project.value.revisionRequestedAt) {
    try {
      const res = await clientApi.completeProject(project.value._id);
      project.value = res.data.project;
      if (res.data.assignment) project.value.assignment = res.data.assignment;
      if (res.data.job) project.value.job = res.data.job;
    } catch (err) {
      console.error("Failed to auto-complete project:", err);
    }
  }
}

/* Animated Classes */
const downloadIconClass = computed(() => {
  if (!project.value) return "";
  return project.value.paymentConfirmed
    ? "text-indigo-500 animate-bounce hover:scale-110"
    : "text-orange-500 animate-pulse hover:scale-105";
});

const downloadButtonClass = computed(() => {
  if (!project.value) return "";
  let base = "px-8 py-3 rounded-xl font-bold shadow-lg transition transform";
  if (downloading.value) base += " opacity-50 cursor-not-allowed";
  if (project.value.paymentConfirmed)
    base +=
      " bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95";
  else
    base +=
      " bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95";
  return base;
});

/* Lifecycle */
onMounted(loadProject);
</script>
