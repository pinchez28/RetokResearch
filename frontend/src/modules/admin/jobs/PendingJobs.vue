<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6"
  >
    <!-- Header -->
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          Pending Job Reviews
        </h1>
        <p class="text-gray-600 text-sm md:text-base">
          Review and approve client job submissions before they go live
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200"
        >
          <div class="text-xs text-gray-500 font-medium">Pending</div>
          <div class="text-xl font-bold text-blue-600">
            {{ pendingJobs.length }}
          </div>
        </div>
        <button
          @click="fetchPendingJobs"
          class="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow"
        >
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="text-center">
        <div class="inline-flex items-center justify-center">
          <div
            class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"
          ></div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Loading pending jobs...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="pendingJobs.length === 0" class="text-center py-16">
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        No Pending Reviews
      </h3>
      <p class="text-gray-500">
        All job requests have been reviewed and processed.
      </p>
    </div>

    <!-- Job cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="job in pendingJobs"
        :key="job._id"
        @click="openJobModal(job)"
        class="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
      >
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6 border-b border-gray-100">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div
                  class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3"
                >
                  {{ job.branch || 'Uncategorized' }}
                </div>
                <h3
                  class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                >
                  {{ job.title }}
                </h3>
              </div>
              <div class="ml-3">
                <span
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium"
                >
                  {{ formatRelativeDate(job.createdAt) }}
                </span>
              </div>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {{ job.description }}
            </p>
          </div>

          <!-- Client Info -->
          <div class="p-6 space-y-3">
            <div class="flex items-center">
              <p class="text-xs text-gray-500 mr-2">Client:</p>
              <p class="font-semibold text-gray-800">
                {{ job.client?.name || 'Unknown' }}
              </p>
            </div>
            <div class="flex items-center">
              <p class="text-xs text-gray-500 mr-2">Email:</p>
              <p class="font-semibold text-gray-800 truncate">
                {{ job.client?.user?.email || 'N/A' }}
              </p>
            </div>
            <div class="flex items-center">
              <p class="text-xs text-gray-500 mr-2">Phone:</p>
              <p class="font-semibold text-gray-800">
                {{ job.client?.phone || 'N/A' }}
              </p>
            </div>
          </div>

          <!-- Action button -->
          <button
            @click.stop="openJobModal(job)"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <i class="fas fa-eye"></i>
            Review Details
          </button>
        </div>
      </div>
    </div>

    <!-- Job Modal - FIXED FOR CENTERING -->
    <div v-if="selectedJob" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm"
          @click="closeJobModal"
        ></div>

        <!-- Center the modal -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <!-- Modal Container -->
        <div
          class="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-5xl sm:w-full mx-auto my-8"
        >
          <!-- Modal Header -->
          <div
            class="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between"
          >
            <h3 class="text-xl font-bold text-white truncate">
              {{ selectedJob.title }}
            </h3>
            <button
              @click="closeJobModal"
              class="ml-6 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Modal Body with scrolling -->
          <div class="px-8 py-8 max-h-[75vh] overflow-y-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Job & Client Info -->
              <div class="lg:col-span-2 space-y-8">
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 class="font-bold text-gray-800 mb-2">Job Description</h4>
                  <p class="text-gray-700 whitespace-pre-wrap">
                    {{ selectedJob.description }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Client Info -->
                  <div class="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 class="font-bold text-gray-800 mb-2">
                      Client Information
                    </h4>
                    <p class="mb-2">
                      <strong class="text-gray-600">Name:</strong>
                      <span class="ml-2">{{
                        selectedJob.client?.name || 'N/A'
                      }}</span>
                    </p>
                    <p class="mb-2">
                      <strong class="text-gray-600">Email:</strong>
                      <span class="ml-2">{{
                        selectedJob.client?.user?.email || 'N/A'
                      }}</span>
                    </p>
                    <p>
                      <strong class="text-gray-600">Phone:</strong>
                      <span class="ml-2">{{
                        selectedJob.client?.phone || 'N/A'
                      }}</span>
                    </p>
                  </div>

                  <!-- Job Details -->
                  <div class="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 class="font-bold text-gray-800 mb-2">Job Details</h4>
                    <p class="mb-2">
                      <strong class="text-gray-600">Submitted:</strong>
                      <span class="ml-2">{{
                        formatDate(selectedJob.createdAt)
                      }}</span>
                    </p>
                    <p>
                      <strong class="text-gray-600">Deadline:</strong>
                      <span class="ml-2">{{
                        formatDate(selectedJob.deadline) || 'Flexible'
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Admin Actions -->
              <div class="space-y-8">
                <div
                  class="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
                >
                  <!-- Branch Selection -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                      >Branch *</label
                    >
                    <select
                      v-model="adminBranch"
                      class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select Branch</option>
                      <option v-for="b in branches" :key="b">{{ b }}</option>
                    </select>
                  </div>

                  <!-- Category Selection -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                      >Category *</label
                    >
                    <select
                      v-model="adminCategory"
                      class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      :disabled="!adminBranch"
                    >
                      <option value="">Select Category</option>
                      <option v-for="c in currentCategories" :key="c">
                        {{ c }}
                      </option>
                    </select>
                  </div>

                  <!-- Price Range Section -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-3"
                      >Price Range (KSh) *</label
                    >

                    <!-- Min Price -->
                    <div class="mb-4">
                      <label
                        class="block text-sm font-medium text-gray-600 mb-2"
                        >Minimum Price</label
                      >
                      <div class="relative">
                        <div
                          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                          <span class="text-gray-500">KSh</span>
                        </div>
                        <input
                          type="number"
                          v-model.number="adminPrice.min"
                          placeholder="Enter minimum amount"
                          min="0"
                          step="100"
                          class="w-full pl-14 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Minimum amount experts can bid for this job
                      </p>
                    </div>

                    <!-- Max Price -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-600 mb-2"
                        >Maximum Price</label
                      >
                      <div class="relative">
                        <div
                          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                          <span class="text-gray-500">KSh</span>
                        </div>
                        <input
                          type="number"
                          v-model.number="adminPrice.max"
                          placeholder="Enter maximum amount"
                          :min="adminPrice.min || 0"
                          step="100"
                          class="w-full pl-14 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          :class="{
                            'border-red-300': adminPrice.max < adminPrice.min,
                          }"
                        />
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Maximum amount experts can bid for this job
                      </p>

                      <!-- Validation Message -->
                      <div
                        v-if="
                          adminPrice.max > 0 && adminPrice.max < adminPrice.min
                        "
                        class="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <p class="text-xs text-red-600 font-medium">
                          Maximum price must be greater than or equal to minimum
                          price
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Summary -->
                  <div
                    v-if="canApprove"
                    class="mt-2 p-4 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <p class="text-sm font-semibold text-green-800 mb-1">
                      Price Range Set ✓
                    </p>
                    <p class="text-lg font-bold text-green-900">
                      KSh {{ formatNumber(adminPrice.min) }} -
                      {{ formatNumber(adminPrice.max) }}
                    </p>
                    <p class="text-xs text-green-600 mt-1">
                      Experts can bid within this range
                    </p>
                  </div>
                  <div v-else class="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p class="text-sm text-gray-600">
                      Fill all fields above to enable approval
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-4">
                  <button
                    @click="approveJob"
                    :disabled="!canApprove || isApproving"
                    :class="[
                      'w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                      !canApprove || isApproving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:-translate-y-0.5',
                    ]"
                  >
                    <i v-if="isApproving" class="fas fa-spinner fa-spin"></i>
                    <i v-else class="fas fa-check-circle"></i>
                    {{ isApproving ? 'Approving...' : 'Approve Job' }}
                  </button>

                  <button
                    @click="rejectJob"
                    :disabled="isRejecting"
                    :class="[
                      'w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                      isRejecting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:-translate-y-0.5',
                    ]"
                  >
                    <i v-if="isRejecting" class="fas fa-spinner fa-spin"></i>
                    <i v-else class="fas fa-times-circle"></i>
                    {{ isRejecting ? 'Rejecting...' : 'Reject Job' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminApi } from '@/core/api/http.js';
import Swal from 'sweetalert2';

// Pending jobs
const pendingJobs = ref([]);
const loading = ref(true);
const selectedJob = ref(null);

// Loading states for actions
const isApproving = ref(false);
const isRejecting = ref(false);

// Admin fields
const adminPrice = ref({ min: 0, max: 0 });
const adminBranch = ref('');
const adminCategory = ref('');

// Branches & categories
const branches = ['Academic Research', 'Industrial Research'];
const academicCategories = [
  'Essays',
  'Thesis',
  'Dissertations',
  'SPSS',
  'Statistics',
  'Research Proposals',
  'Assignments',
  'Academic Editing',
];
const industrialCategories = [
  'Data Analysis',
  'AI & Machine Learning',
  'Business Research',
  'Technical Writing',
  'Market Research',
  'Software Development',
  'Engineering Reports',
  'Design & Prototyping',
];

const currentCategories = computed(() =>
  adminBranch.value === 'Academic Research'
    ? academicCategories
    : industrialCategories,
);

// Validation
const canApprove = computed(
  () =>
    adminBranch.value &&
    adminCategory.value &&
    adminPrice.value.min > 0 &&
    adminPrice.value.max >= adminPrice.value.min,
);

// Fetch jobs
const fetchPendingJobs = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getPendingJobs();
    pendingJobs.value = Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch pending jobs',
      toast: true,
      position: 'top-end',
      timer: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Modal handlers
const openJobModal = (job) => {
  selectedJob.value = job;
  adminPrice.value.min = job.pricingRange?.min || 0;
  adminPrice.value.max = job.pricingRange?.max || 0;
  adminBranch.value = job.branch || '';
  adminCategory.value = job.category || '';
};

const closeJobModal = () => {
  selectedJob.value = null;
  adminPrice.value = { min: 0, max: 0 };
  adminBranch.value = '';
  adminCategory.value = '';
  isApproving.value = false;
  isRejecting.value = false;
};

// Approve Job
const approveJob = async () => {
  if (!canApprove.value || isApproving.value) return;

  isApproving.value = true;

  try {
    await adminApi.reviewJob(selectedJob.value._id, {
      minPrice: adminPrice.value.min,
      maxPrice: adminPrice.value.max,
      branch: adminBranch.value,
      category: adminCategory.value,
    });

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Job Approved!',
      text: 'The job has been approved and is now live.',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });

    // Remove from list and close modal
    pendingJobs.value = pendingJobs.value.filter(
      (j) => j._id !== selectedJob.value._id,
    );
    closeJobModal();
  } catch (err) {
    console.error('Approve error:', err);
    Swal.fire({
      icon: 'error',
      title: 'Approval Failed',
      text:
        err.response?.data?.message ||
        'Failed to approve job. Please try again.',
    });
  } finally {
    isApproving.value = false;
  }
};

// Reject Job
const rejectJob = async () => {
  if (isRejecting.value) return;

  const { value: reason } = await Swal.fire({
    title: 'Reject Job',
    input: 'textarea',
    inputPlaceholder: 'Reason for rejection...',
    inputValidator: (value) => {
      if (!value || value.trim().length < 10) {
        return 'Please provide a reason (at least 10 characters)';
      }
      return null;
    },
    showCancelButton: true,
    confirmButtonText: 'Confirm Reject',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  });

  if (!reason) return;

  isRejecting.value = true;

  try {
    await adminApi.rejectJob(selectedJob.value._id, { reason });

    Swal.fire({
      icon: 'success',
      title: 'Job Rejected',
      text: 'The job has been rejected and the client has been notified.',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });

    pendingJobs.value = pendingJobs.value.filter(
      (j) => j._id !== selectedJob.value._id,
    );
    closeJobModal();
  } catch (err) {
    console.error('Reject error:', err);
    Swal.fire({
      icon: 'error',
      title: 'Rejection Failed',
      text:
        err.response?.data?.message ||
        'Failed to reject job. Please try again.',
    });
  } finally {
    isRejecting.value = false;
  }
};

// Utilities
const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return hours === 1 ? '1 hour ago' : hours + ' hours ago';
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : days + ' days ago';
};

const formatNumber = (num) => num?.toLocaleString() || '0';

onMounted(fetchPendingJobs);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
