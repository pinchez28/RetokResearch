<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-primary-900">My Jobs</h1>
        <p class="text-primary-700 mt-1">
          Manage your jobs, applications, and communications with experts.
        </p>
      </div>
    </header>

    <!-- Jobs Grid -->
    <section
      v-if="jobs.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
    >
      <div
        v-for="job in jobs"
        :key="job._id"
        class="bg-neutral-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer"
      >
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-bold text-yellow-900 truncate">
            {{ job.title || "Untitled Job" }}
          </h2>

          <span
            class="px-3 py-1 text-xs font-extrabold rounded-full bg-yellow-500 text-accent-800"
            :class="badgeClass(job.status)"
          >
            {{ formatStatus(job.status) }}
          </span>
        </div>

        <!-- Rejected Reason Preview -->
        <p
          v-if="job.status === 'admin_rejected'"
          class="text-red-600 text-xs mt-1 truncate"
        >
          Reason: {{ job.rejectionReason || "—" }}
        </p>

        <div class="flex justify-between items-center mt-4 text-sm text-primary-200">
          <span class="font-bold text-green-600">
            Due:
            {{ job.deadline ? new Date(job.deadline).toLocaleDateString() : "—" }}
          </span>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            @click="viewJob(job)"
            class="px-4 py-2 rounded-xl bg-primary-900 text-neutral-white font-semibold hover:bg-accent-500 transition"
          >
            View Details
          </button>

          <button
            v-if="job.applications?.length"
            @click="goToApplications(job)"
            class="px-4 py-2 rounded-xl bg-green-500 text-neutral-white font-extrabold hover:bg-accent-400 transition"
          >
            Applications ({{ job.applications.length }})
          </button>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-else class="text-center text-primary-200 py-20">No jobs available.</div>

    <!-- Job Details Modal -->
    <div
      v-if="showJobModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-neutral-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-primary-900">
            {{ selectedJob?.title }}
          </h2>
          <button @click="closeJobModal" class="text-primary-200 hover:text-primary-900">
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <p>
            <strong>Description:</strong>
            {{ selectedJob?.description || "No description" }}
          </p>
          <p>
            <strong>Due Date:</strong>
            {{
              selectedJob?.deadline
                ? new Date(selectedJob.deadline).toLocaleDateString()
                : "—"
            }}
          </p>
          <p>
            <strong>Status:</strong>
            <span :class="['px-2 py-1 rounded-full', badgeClass(selectedJob?.status)]">
              {{ formatStatus(selectedJob?.status || "unknown") }}
            </span>
          </p>
          <p>
            <strong>Assigned Expert:</strong>
            {{ selectedJob?.assignedExpert?.name || "Not assigned yet" }}
          </p>
          <p v-if="selectedJob?.applications?.length">
            <strong>Applications:</strong> {{ selectedJob.applications.length }}
          </p>

          <div
            v-if="selectedJob?.status === 'admin_rejected'"
            class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm"
          >
            <p class="font-semibold text-red-700">Rejection Reason from Admin:</p>
            <p class="text-red-600 mt-1">
              {{ selectedJob?.rejectionReason || "No reason provided." }}
            </p>
            <p v-if="selectedJob?.rejectedAt" class="text-primary-200 text-xs mt-2">
              Rejected At:
              {{ new Date(selectedJob.rejectedAt).toLocaleString() }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="closeJobModal"
            class="px-4 py-2 rounded-xl border border-primary-200 hover:bg-primary-100 transition"
          >
            Close
          </button>

          <button
            v-if="selectedJob?.pendingPayment"
            @click="goToPayments(selectedJob)"
            class="px-4 py-2 rounded-xl bg-accent-500 text-neutral-white hover:bg-accent-400 transition"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/core/api/http.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const jobs = ref([]);
const selectedJob = ref(null);
const showJobModal = ref(false);
const router = useRouter();

// ============================
// Fetch jobs
// ============================
const loadJobs = async () => {
  try {
    const { data } = await axios.get("/client/jobs");

    jobs.value = (data.jobs || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load jobs", "error");
  }
};

// ============================
// View job
// ============================
const viewJob = (job) => {
  if (job.status === "in_progress" || job.assignedExpert?._id) {
    router.push({ name: "ClientJobDetails", params: { jobId: job._id } });

    return;
  }

  selectedJob.value = job;
  showJobModal.value = true;
};

const closeJobModal = () => {
  showJobModal.value = false;
};

// ============================
// Navigate to applications
// ============================
const goToApplications = (job) => {
  router.push({
    name: "ClientJobApplications",
    params: { jobId: job._id },
  });
};

// ============================
// Payments placeholder
// ============================
const goToPayments = (job) => {
  Swal.fire("Payment", `Redirect to payment for "${job.title}"`, "info");
};

// ============================
// Badge colors (extended)
// ============================
const badgeClass = (status) => {
  switch (status) {
    case "admin_rejected":
      return "bg-red-600 text-white";
    case "open":
      return "bg-primary-500 text-white"; // instead of #0046FF
    case "in_progress":
      return "bg-primary-900 text-white"; // instead of #001BB7
    case "submitted":
      return "bg-primary-500 text-white";
    case "approved_for_bidding":
      return "bg-accent-500 text-white"; // already semantic
    case "completed":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

// ============================
// Format status
// ============================
const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

// ============================
// Lifecycle
// ============================
onMounted(loadJobs);
</script>

<style scoped>
section > div:hover {
  transform: translateY(-2px);
  transition: all 0.2s;
}

button {
  transition: all 0.2s;
}
</style>
