<template>
  <div class="max-w-5xl mx-auto p-6 md:p-10 space-y-8 min-h-screen bg-gray-100">
    <!-- ================= JOB HEADER ================= -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-3xl font-bold text-[#001BB7]">
            {{ job.title || "Untitled Job" }}
          </h1>
          <p class="text-gray-500 mt-1">
            Status:
            <span
              :class="badgeClass(job.status)"
              class="px-2 py-1 rounded-full text-white text-sm"
            >
              {{ job.status || "Unknown" }}
            </span>
          </p>
          <p class="text-gray-600 mt-1">
            Total Proposals: {{ job.applicationsCount || 0 }}
          </p>
        </div>
        <button
          @click="goBack"
          class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <!-- Job description (plain text now) -->
      <p class="text-gray-700 mb-4">
        {{ job.description || "No description provided." }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
        <div>
          <strong>Allowed Price Range:</strong>
          <span v-if="job.pricingRange">
            KSh {{ job.pricingRange.min }} – {{ job.pricingRange.max }}
          </span>
          <span v-else>-</span>
        </div>
        <div><strong>Deadline:</strong> {{ formatDate(job.deadline) }}</div>
        <div><strong>Category:</strong> {{ job.category || "-" }}</div>
        <div><strong>Branch:</strong> {{ job.branch || "-" }}</div>
      </div>
    </div>

    <!-- ================= MY PROPOSAL ================= -->
    <div
      v-if="job.hasApplied && job.myProposal"
      class="bg-green-100 text-green-800 rounded-xl p-4 space-y-2"
    >
      <h2 class="font-semibold text-lg">Your Submitted Proposal</h2>
      <p><strong>Quote:</strong> KSh {{ job.myProposal.quote }}</p>
      <p>
        <strong>Estimated Delivery:</strong>
        {{ job.myProposal.estimatedDeliveryDays }} days
      </p>
      <p><strong>Status:</strong> {{ job.myProposal.status }}</p>

      <p class="whitespace-pre-line">{{ job.myProposal.proposalText }}</p>
    </div>

    <!-- ================= APPLY SECTION ================= -->
    <div v-if="!job.hasApplied" class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-semibold text-[#001BB7] mb-4">Submit Your Proposal</h2>

      <form @submit.prevent="submitProposal" class="space-y-6">
        <!-- Proposal Plain Text -->
        <div>
          <label class="block font-semibold mb-2">Proposal</label>
          <AutoTextArea
            v-model="form.proposalText"
            placeholder="Describe an Elaborate Proposal"
            class="border rounded-xl p-3 focus:ring-2 focus:ring-[#001BB7]"
          />
        </div>

        <!-- Quote -->
        <div>
          <label class="block font-semibold mb-1">
            Quote (KSh)
            <span v-if="job.pricingRange" class="text-sm text-gray-500 ml-1">
              ({{ job.pricingRange.min }} – {{ job.pricingRange.max }})
            </span>
          </label>

          <input
            type="number"
            v-model.number="form.quote"
            :min="job.pricingRange?.min"
            :max="job.pricingRange?.max"
            class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-[#001BB7]"
            placeholder="Quote Must be between the range"
            required
          />

          <p v-if="!isQuoteValid" class="text-red-600 text-sm mt-1">
            Quote must be between {{ job.pricingRange.min }} and
            {{ job.pricingRange.max }} KSh
          </p>
        </div>

        <!-- Delivery -->
        <div>
          <label class="block font-semibold mb-1"> Estimated Delivery (days) </label>
          <input
            type="number"
            v-model.number="form.estimatedDeliveryDays"
            min="1"
            class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-[#001BB7]"
            placeholder="How soon can you do this work in days"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="submitting || !isQuoteValid"
          class="w-full bg-[#FF8040] hover:bg-[#26c506] text-gray-900 uppercase font-extrabold py-3 rounded-xl disabled:opacity-50"
        >
          {{ submitting ? "Submitting..." : "Submit Proposal" }}
        </button>
      </form>
    </div>

    <!-- ================= NOTIFICATIONS ================= -->
    <NotificationSplash
      v-if="notificationStore.notifications.length > 0"
      :notifications="notificationStore.notifications"
      @click="handleNotificationClick"
      @clearAll="clearAllNotifications"
      @viewAll="viewAllNotifications"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import NotificationSplash from "@/components/ui/NotificationSplash.vue";
import { useAuthStore } from "@/core/store/auth.js";
import { useNotificationStore } from "@/core/store/notificationStore.js";
import AutoTextArea from "@/components/shared/AutoTextArea.vue";
import { expertApi } from "@/core/api/http.js";

const route = useRoute();
const router = useRouter();
const { emit } = getCurrentInstance();

const jobId = route.params.jobId || route.query.jobId;

const job = ref({});
const submitting = ref(false);

const form = ref({
  proposalText: "",
  quote: null,
  estimatedDeliveryDays: null,
});

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// ================= JOB DETAILS =================
const fetchJobDetails = async () => {
  try {
    const res = await expertApi.getJobById(jobId);
    job.value = res.data.data || {};
    if (job.value.pricingRange?.min) {
      form.value.quote = job.value.pricingRange.min;
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load job details", "error");
  }
};

// ================= VALIDATION =================
const isQuoteValid = computed(() => {
  if (!job.value.pricingRange) return true;
  const { min, max } = job.value.pricingRange;
  return form.value.quote >= min && form.value.quote <= max;
});

// ================= SUBMIT =================
const submitProposal = async () => {
  submitting.value = true;

  try {
    if (form.value.proposalText.length < 30) {
      return Swal.fire({
        title: "Error",
        text: "Proposal must be at least 30 characters",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
    }

    const payload = {
      proposalText: form.value.proposalText,
      quote: form.value.quote,
      estimatedDeliveryDays: form.value.estimatedDeliveryDays,
      expertSnapshot: {
        expertId: authStore.user.expertId, // REQUIRED!
        name: authStore.user.name,
        photo: authStore.user.photo || "",
        specialization: authStore.user.specialization || "",
        experience: authStore.user.experience || 0,
        education: authStore.user.education || "",
        certifications: authStore.user.certifications || [],
        bio: authStore.user.bio || "",
        rating: authStore.user.rating || 0,
      },
    };

    const { data } = await expertApi.applyForJob(job.value._id, payload);

    Swal.fire({
      title: "Success",
      text: "Proposal submitted successfully!",
      icon: "success",
      confirmButtonColor: "#22c55e",
    });

    await fetchJobDetails(); // refresh job data
  } catch (err) {
    console.error("submitProposal error:", err);

    // Extract a friendly backend message
    let msg = "Failed to submit proposal";

    if (err.response?.data?.message) {
      msg = err.response.data.message;
    } else if (err.response?.data?.errors) {
      // Collect all validation errors
      const errors = Object.values(err.response.data.errors)
        .map((e) => e.message || e.kind)
        .join("\n");
      msg = errors || msg;
    } else if (err.message) {
      msg = err.message;
    }

    Swal.fire({
      title: "Error",
      text: msg,
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    submitting.value = false;
  }
};

// ================= HELPERS =================
const goBack = () => router.back();
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

const badgeClass = (status) =>
  ({
    approved_for_bidding: "bg-blue-600",
    assigned: "bg-indigo-700",
    in_progress: "bg-indigo-700",
    ready: "bg-yellow-500",
    completed: "bg-green-600",
    cancelled: "bg-gray-500",
  }[status] || "bg-gray-400");

// ================= NOTIFICATIONS =================
const handleNotificationClick = async (note) => {
  if (!note.read) await notificationStore.markAsRead(note._id);
};

const clearAllNotifications = async () => {
  await notificationStore.clearAll();
};

const viewAllNotifications = () => router.push("/expert/notifications");

// ================= INIT =================
onMounted(async () => {
  await fetchJobDetails();
  await notificationStore.loadNotifications();
});
</script>
