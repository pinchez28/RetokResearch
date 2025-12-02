<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Pending Client Jobs</h1>

    ```
    <div v-if="loading" class="text-gray-500 text-center">Loading...</div>

    <div v-else>
      <div v-if="pendingJobs.length" class="space-y-4">
        <div
          v-for="job in pendingJobs"
          :key="job._id"
          @click="openJobModal(job)"
          class="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
        >
          <h2 class="font-bold text-lg">{{ job.title }}</h2>
          <p class="text-gray-600 mt-1 truncate">{{ job.description }}</p>
          <p class="text-sm text-gray-400 mt-1">
            Submitted by: {{ job.client?.name || 'Unknown Client' }} | Email:
            {{ job.client?.email || 'N/A' }} | Date:
            {{ formatDate(job.createdAt) }}
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center">No pending jobs.</div>
    </div>

    <!-- Job Details Modal -->
    <div
      v-if="selectedJob"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-auto z-50"
    >
      <div
        class="bg-white mt-20 max-w-3xl w-full p-6 rounded-lg shadow-lg text-left"
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">{{ selectedJob.title }}</h2>
          <button
            @click="closeJobModal"
            class="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        <div class="space-y-3">
          <p>
            <span class="font-semibold">Description:</span>
            {{ selectedJob.description }}
          </p>
          <p>
            <span class="font-semibold">Client:</span>
            {{ selectedJob.client?.name || 'Unknown' }}
          </p>
          <p>
            <span class="font-semibold">Email:</span>
            {{ selectedJob.client?.email || 'N/A' }}
          </p>
          <p>
            <span class="font-semibold">Deadline:</span>
            {{ formatDate(selectedJob.deadline) || 'Not set' }}
          </p>

          <!-- Skills input for admin -->
          <div class="mt-2">
            <label class="font-semibold mb-1"
              >Skills Required (comma-separated)</label
            >
            <input
              type="text"
              v-model="adminSkills"
              placeholder="e.g. JavaScript, Node.js"
              class="border rounded px-2 py-1 w-full"
            />
          </div>

          <!-- Admin Price Input -->
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div class="flex flex-col">
              <label class="font-semibold mb-1">Minimum Price (KSh)</label>
              <input
                type="number"
                v-model.number="adminPrice.min"
                placeholder="Enter min price"
                class="border rounded px-2 py-1 w-full"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-semibold mb-1">Maximum Price (KSh)</label>
              <input
                type="number"
                v-model.number="adminPrice.max"
                placeholder="Enter max price"
                class="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="approveJob(selectedJob)"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Approve
          </button>
          <button
            @click="rejectJob(selectedJob)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
    ```
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '@/utils/api.js';
import Swal from 'sweetalert2';

const pendingJobs = ref([]);
const loading = ref(true);
const selectedJob = ref(null);

// Admin-defined price range and skills
const adminPrice = ref({ min: 0, max: 0 });
const adminSkills = ref('');

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

const fetchPendingJobs = async () => {
  loading.value = true;
  try {
    const response = await adminApi.getPendingJobs();
    // Backend returns { success: true, data: [...] }
    pendingJobs.value = Array.isArray(
      response.data?.data || response.data?.data
    )
      ? response.data.data
      : response.data || [];
  } catch (err) {
    console.error('Failed to fetch pending jobs:', err);
    Swal.fire('Error', 'Failed to fetch pending jobs', 'error');
  } finally {
    loading.value = false;
  }
};

const openJobModal = (job) => {
  selectedJob.value = job;
  adminPrice.value.min = job.clientProposedPrice || 0;
  adminPrice.value.max = job.clientProposedPrice || 0;
  adminSkills.value = (job.skillsRequired || []).join(', ');
};

const closeJobModal = () => {
  selectedJob.value = null;
};

const approveJob = async (job) => {
  if (adminPrice.value.min <= 0 || adminPrice.value.max <= 0) {
    Swal.fire(
      'Validation Error',
      'Please enter valid min and max prices.',
      'warning'
    );
    return;
  }
  if (!adminSkills.value.trim()) {
    Swal.fire('Validation Error', 'Please specify skills required.', 'warning');
    return;
  }
  try {
    await adminApi.reviewJob(job._id, {
      minPrice: adminPrice.value.min,
      maxPrice: adminPrice.value.max,
      skillsRequired: adminSkills.value.split(',').map((s) => s.trim()),
    });
    pendingJobs.value = pendingJobs.value.filter((j) => j._id !== job._id);
    closeJobModal();
    Swal.fire('Success', 'Job approved successfully', 'success');
  } catch (err) {
    console.error('Failed to approve job:', err);
    Swal.fire('Error', 'Failed to approve job', 'error');
  }
};

const rejectJob = async (job) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will reject the job.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject it!',
  });
  if (!result.isConfirmed) return;

  try {
    await adminApi.reviewJob(job._id, { status: 'rejected' });
    pendingJobs.value = pendingJobs.value.filter((j) => j._id !== job._id);
    closeJobModal();
    Swal.fire('Rejected', 'Job rejected successfully', 'success');
  } catch (err) {
    console.error('Failed to reject job:', err);
    Swal.fire('Error', 'Failed to reject job', 'error');
  }
};

onMounted(fetchPendingJobs);
</script>

<style scoped>
input:focus {
  outline: 2px solid #3b82f6;
}
</style>
