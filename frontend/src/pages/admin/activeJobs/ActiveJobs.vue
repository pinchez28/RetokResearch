<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">Active Jobs</h1>

      ```
      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search jobs, clients or experts..."
        class="px-4 py-2 border rounded-md w-64 focus:outline-none"
      />
    </div>

    <!-- FILTER BAR -->
    <div class="flex items-center space-x-4 mb-6">
      <label class="font-semibold">Filter Status:</label>
      <select v-model="statusFilter" class="px-3 py-2 border rounded-md">
        <option value="">All</option>
        <option value="in_progress">In Progress</option>
        <option value="approved_for_bidding">Approved for Bidding</option>
        <option value="assigned">Assigned</option>
        <option value="completed">Completed</option>
        <option value="revision">Revision</option>
      </select>
    </div>

    <!-- JOB TABLE -->
    <div class="overflow-x-auto rounded-lg shadow bg-white">
      <table class="min-w-full text-left">
        <thead class="bg-[#001BB7] text-[#F5F1DC]">
          <tr>
            <th class="py-3 px-4">Job Title</th>
            <th class="py-3 px-4">Client</th>
            <th class="py-3 px-4">Expert</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Deadline</th>
            <th class="py-3 px-4">Progress</th>
            <th class="py-3 px-4">Pricing & Skills</th>
            <th class="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in paginatedJobs"
            :key="job._id"
            class="border-b hover:bg-[#F5F1DC]/40 transition"
          >
            <td class="py-3 px-4 font-semibold">{{ job.title }}</td>
            <td class="py-3 px-4">{{ job.client?.name || 'N/A' }}</td>
            <td class="py-3 px-4">
              {{ job.assignedExpert?.name || 'Unassigned' }}
            </td>

            <!-- STATUS DROPDOWN -->
            <td class="py-3 px-4">
              <select
                v-model="job.status"
                @change="updateJobStatus(job)"
                class="px-2 py-1 border rounded-md"
              >
                <option value="approved_for_bidding">
                  Approved for Bidding
                </option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="revision">Revision</option>
              </select>
            </td>

            <td class="py-3 px-4">
              {{
                job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : 'N/A'
              }}
            </td>

            <td class="py-3 px-4">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="h-3 rounded-full transition-all"
                  :style="{
                    width: job.progress + '%',
                    backgroundColor: '#FF8040',
                  }"
                ></div>
              </div>
            </td>

            <!-- ADMIN PRICING & SKILLS -->
            <td class="py-3 px-4">
              <div class="flex flex-col space-y-1">
                <div class="flex space-x-2">
                  <input
                    type="number"
                    v-model.number="job.pricingRange.min"
                    placeholder="Min"
                    class="w-16 px-1 border rounded-md"
                    @change="updateJob(job)"
                  />
                  <input
                    type="number"
                    v-model.number="job.pricingRange.max"
                    placeholder="Max"
                    class="w-16 px-1 border rounded-md"
                    @change="updateJob(job)"
                  />
                </div>
                <input
                  type="text"
                  v-model="job.skillsInput"
                  placeholder="Skills (comma-separated)"
                  class="px-1 border rounded-md"
                  @change="updateJob(job)"
                />
              </div>
            </td>

            <!-- ACTION BUTTONS -->
            <td class="py-3 px-4 text-center space-x-2">
              <button
                class="px-3 py-1 rounded-md font-semibold text-white bg-green-500"
                @click="openAssign(job)"
              >
                Assign Expert
              </button>
              <button
                class="px-3 py-1 rounded-md font-semibold text-white bg-red-500"
                @click="deleteJob(job._id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-md"
      >
        Previous
      </button>
      <span>Page {{ currentPage }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage * pageSize >= filteredJobs.length"
        class="px-3 py-1 border rounded-md"
      >
        Next
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="filteredJobs.length === 0"
      class="text-center py-10 text-lg font-semibold text-[#001BB7]"
    >
      No active jobs found.
    </div>
    ```
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';

const router = useRouter();
const jobs = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = 10;

const socket = io('http://localhost:4000');
const token = localStorage.getItem('token'); // replace with your auth token

// -------------------- FETCH ACTIVE JOBS --------------------
const fetchJobs = async () => {
  try {
    const { data } = await axios.get(
      'http://localhost:4000/api/admin/jobs/active',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    jobs.value = data.data.map((job) => ({
      ...job,
      skillsInput: job.skillsRequired.join(', '),
    }));
  } catch (err) {
    console.error('Failed to fetch active jobs:', err);
  }
};

onMounted(() => {
  fetchJobs();

  // Join admin room for notifications
  socket.emit('joinRoom', { userId: 'admin', role: 'admin' });

  socket.on('notification', (msg) => {
    console.log('New notification:', msg);
    fetchJobs(); // optional: refresh table on live update
  });
});

// -------------------- FILTER + PAGINATION --------------------
const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.client?.name
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      job.assignedExpert?.name
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      !statusFilter.value || job.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredJobs.value.slice(start, start + pageSize);
});

const nextPage = () => {
  currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// -------------------- JOB ACTIONS --------------------
const updateJobStatus = async (job) => {
  try {
    await axios.put(
      `http://localhost:4000/api/admin/jobs/${job._id}/update`,
      { status: job.status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error(err);
  }
};

const updateJob = async (job) => {
  try {
    const skillsArray = job.skillsInput.split(',').map((s) => s.trim());
    await axios.put(
      `http://localhost:4000/api/admin/jobs/${job._id}/update`,
      { pricingRange: job.pricingRange, skillsRequired: skillsArray },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error(err);
  }
};

const openAssign = (job) => {
  router.push(`/admin/assign-expert/${job._id}`);
};

const deleteJob = async (jobId) => {
  if (!confirm('Are you sure you want to delete this job?')) return;
  try {
    await axios.delete(`http://localhost:4000/api/admin/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    jobs.value = jobs.value.filter((j) => j._id !== jobId);
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}
</style>
