<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Pending Client Jobs</h1>

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
            {{ job.client?.user?.email || 'N/A' }} | Phone:
            {{ job.client?.phone || 'N/A' }} | Date:
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
            {{ selectedJob.client?.user?.email || 'N/A' }}
          </p>
          <p>
            <span class="font-semibold">Phone:</span>
            {{ selectedJob.client?.phone || 'N/A' }}
          </p>
          <p>
            <span class="font-semibold">Deadline:</span>
            {{ formatDate(selectedJob.deadline) || 'Not set' }}
          </p>

          <!-- Branch Dropdown -->
          <div class="mt-4">
            <label class="font-semibold">Branch</label>
            <select
              v-model="adminBranch"
              class="border rounded px-2 py-1 w-full mt-1"
            >
              <option value="">Select Branch</option>
              <option v-for="b in branches" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>

          <!-- Category Dropdown -->
          <div class="mt-4">
            <label class="font-semibold">Category</label>

            <!-- Academic -->
            <div v-if="adminBranch === 'Academic Research'">
              <select
                v-model="adminCategory"
                class="border rounded px-2 py-1 w-full mt-1"
              >
                <option value="">Select Category</option>
                <option v-for="c in academicCategories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>

            <!-- Industrial -->
            <div v-if="adminBranch === 'Industrial Research'">
              <select
                v-model="adminCategory"
                class="border rounded px-2 py-1 w-full mt-1"
              >
                <option value="">Select Category</option>
                <option v-for="c in industrialCategories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>
          </div>

          <!-- Skills input for admin -->
          <div class="mt-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '@/utils/api.js';
import Swal from 'sweetalert2';

const pendingJobs = ref([]);
const loading = ref(true);
const selectedJob = ref(null);

// Admin-defined price, skills, branch, category
const adminPrice = ref({ min: 0, max: 0 });
const adminSkills = ref('');
const adminBranch = ref('');
const adminCategory = ref('');

// Branches
const branches = ['Academic Research', 'Industrial Research'];

// Categories
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

// Format date
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

// Fetch pending jobs
const fetchPendingJobs = async () => {
  loading.value = true;
  try {
    const response = await adminApi.getPendingJobs();
    pendingJobs.value = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
  } catch (err) {
    console.error('Failed to fetch pending jobs:', err);
    Swal.fire('Error', 'Failed to fetch pending jobs', 'error');
  } finally {
    loading.value = false;
  }
};

// Open modal
const openJobModal = (job) => {
  selectedJob.value = job;

  adminPrice.value.min = job.pricingRange?.min || 0;
  adminPrice.value.max = job.pricingRange?.max || 0;

  adminSkills.value = (job.skillsRequired || []).join(', ');

  adminBranch.value = job.branch || '';
  adminCategory.value = job.category || '';
};

// Close modal
const closeJobModal = () => {
  selectedJob.value = null;
};

// Approve job
const approveJob = async (job) => {
  if (!adminBranch.value) {
    Swal.fire('Validation Error', 'Please select a branch.', 'warning');
    return;
  }
  if (!adminCategory.value) {
    Swal.fire('Validation Error', 'Please select a category.', 'warning');
    return;
  }
  if (adminPrice.value.min <= 0 || adminPrice.value.max <= 0) {
    Swal.fire('Validation Error', 'Enter valid price range.', 'warning');
    return;
  }
  if (!adminSkills.value.trim()) {
    Swal.fire('Validation Error', 'Please specify required skills.', 'warning');
    return;
  }

  try {
    await adminApi.reviewJob(job._id, {
      branch: adminBranch.value,
      category: adminCategory.value,
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

// Reject job
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
input:focus,
select:focus {
  outline: 2px solid #3b82f6;
}
</style>
