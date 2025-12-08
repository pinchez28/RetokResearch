<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- Header -->
    <header
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-[#001BB7]">My Jobs</h1>
        <p class="text-gray-600 mt-1">
          Manage your jobs, applications, and communications with experts.
        </p>
      </div>
    </header>

    <!-- Jobs Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="job in jobs"
        :key="job._id"
        class="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer"
      >
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-bold text-[#001BB7] truncate">
            {{ job.title }}
          </h2>
          <span
            :class="badgeClass(job.status)"
            class="px-3 py-1 text-xs font-semibold rounded-full"
          >
            {{ formatStatus(job.status) }}
          </span>
        </div>

        <p class="text-gray-600 mt-2 truncate">
          {{ job.description || job.summary }}
        </p>

        <div
          class="flex justify-between items-center mt-4 text-sm text-gray-500"
        >
          <span>
            Proposed Price:
            {{
              job.clientProposedPrice
                ? 'KES ' + job.clientProposedPrice
                : job.pricingRange
                ? 'KES ' + job.pricingRange.min + ' - ' + job.pricingRange.max
                : '—'
            }}
          </span>
          <span
            >Due:
            {{
              job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'
            }}</span
          >
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <!-- View Job Modal -->
          <button
            @click="viewJob(job)"
            class="px-4 py-2 rounded-xl bg-[#001BB7] text-white font-semibold hover:bg-[#0025FF] transition"
          >
            View Details
          </button>

          <!-- Applications button -->
          <button
            v-if="
              job.status === 'approved_for_bidding' && job.applications?.length
            "
            @click="
              $router.push({
                name: 'ClientJobApplications',
                params: { jobId: job._id },
                state: { job }, // <-- pass the job object
              })
            "
            class="px-4 py-2 rounded-xl bg-[#0046FF] text-white font-semibold hover:bg-[#0055FF] transition"
          >
            Applications ({{ job.applications.length }})
          </button>
        </div>
      </div>
    </section>

    <!-- Job Details Modal -->
    <div
      v-if="showJobModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-[#001BB7]">
            {{ selectedJob.title }}
          </h2>
          <button
            @click="closeJobModal"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <p>
            <strong>Description:</strong>
            {{ selectedJob.description || 'No description' }}
          </p>
          <p>
            <strong>Budget:</strong>
            {{
              selectedJob.clientProposedPrice
                ? 'KES ' + selectedJob.clientProposedPrice
                : selectedJob.pricingRange
                ? 'KES ' +
                  selectedJob.pricingRange.min +
                  ' - ' +
                  selectedJob.pricingRange.max
                : '—'
            }}
          </p>
          <p>
            <strong>Due Date:</strong>
            {{
              selectedJob.deadline
                ? new Date(selectedJob.deadline).toLocaleDateString()
                : '—'
            }}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              :class="[
                'px-2 py-1 rounded-full',
                badgeClass(selectedJob.status),
              ]"
            >
              {{ formatStatus(selectedJob.status) }}
            </span>
          </p>
          <p>
            <strong>Assigned Expert:</strong>
            {{ selectedJob.assignedExpert?.name || 'Not assigned yet' }}
          </p>
          <p v-if="selectedJob.applications?.length">
            <strong>Applications:</strong> {{ selectedJob.applications.length }}
          </p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="closeJobModal"
            class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            v-if="selectedJob.pendingPayment"
            @click="goToPayments(selectedJob)"
            class="px-4 py-2 rounded-xl bg-[#FF8040] text-white hover:bg-[#FFA366]"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/api.js';
import Swal from 'sweetalert2';

const backendURL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

const jobs = ref([]);
const selectedJob = ref(null);
const showJobModal = ref(false);

// Fetch jobs
const loadJobs = async () => {
  try {
    const { data } = await axios.get(`${backendURL}/api/client/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    jobs.value = data.jobs.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log('Jobs loaded:', jobs.value);
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Failed to load jobs', 'error');
  }
};

// Job modals
const viewJob = (job) => {
  selectedJob.value = job;
  showJobModal.value = true;
};
const closeJobModal = () => (showJobModal.value = false);

// Payments
const goToPayments = (job) =>
  Swal.fire('Payment', `Redirect to payment for "${job.title}"`, 'info');

// Badge colors
const badgeClass = (status) => {
  switch (status) {
    case 'open':
      return 'bg-[#0046FF] text-white';
    case 'in_progress':
      return 'bg-[#001BB7] text-white';
    case 'submitted':
      return 'bg-[#0046FF] text-white';
    case 'approved_for_bidding':
      return 'bg-[#FF8040] text-white';
    case 'completed':
      return 'bg-green-600 text-white';
    case 'cancelled':
      return 'bg-gray-400 text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

// Format status for display
const formatStatus = (status) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

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
