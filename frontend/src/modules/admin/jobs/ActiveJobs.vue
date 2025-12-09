<template>
  <div class="text-[#001BB7] p-4">
    <!-- PAGE HEADER -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold text-[#001BB7]">Active Jobs</h1>

      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search jobs, clients or experts..."
        class="px-4 py-2 border rounded-md w-full md:w-64 focus:outline-none"
      />
    </div>

    <!-- FILTER BAR -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
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

    <!-- JOB CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="job in paginatedJobs"
        :key="job._id"
        class="border rounded-lg shadow p-4 bg-white cursor-pointer hover:shadow-lg transition"
        @click="openJobModal(job)"
      >
        <h2 class="font-bold text-lg mb-2">{{ job.title }}</h2>
        <p><strong>Client:</strong> {{ job.client?.name || 'N/A' }}</p>
        <p>
          <strong>Expert:</strong>
          {{ job.assignedExpert?.name || 'Unassigned' }}
        </p>
        <p>
          <strong>Status:</strong>
          <span :class="statusColor(job.status)">{{
            formatStatus(job.status)
          }}</span>
        </p>
        <p>
          <strong>Deadline:</strong>
          {{
            job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'
          }}
        </p>

        <!-- Progress Bar -->
        <div class="mt-2">
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all"
              :style="{ width: job.progress + '%', backgroundColor: '#FF8040' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-between items-center mt-6">
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

    <!-- MODAL -->
    <div
      v-if="selectedJob"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="selectedJob = null"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <h2 class="text-2xl font-bold mb-4">{{ selectedJob.title }}</h2>
        <p><strong>Client:</strong> {{ selectedJob.client?.name || 'N/A' }}</p>
        <p>
          <strong>Expert:</strong>
          {{ selectedJob.assignedExpert?.name || 'Unassigned' }}
        </p>
        <p>
          <strong>Status:</strong>
          <span :class="statusColor(selectedJob.status)">{{
            formatStatus(selectedJob.status)
          }}</span>
        </p>
        <p>
          <strong>Deadline:</strong>
          {{
            selectedJob.deadline
              ? new Date(selectedJob.deadline).toLocaleDateString()
              : 'N/A'
          }}
        </p>
        <p>
          <strong>Pricing:</strong> KES
          {{ selectedJob.pricingRange?.min || 0 }} -
          {{ selectedJob.pricingRange?.max || 0 }}
        </p>
        <p>
          <strong>Skills Required:</strong>
          {{ selectedJob.skillsRequired?.join(', ') || 'N/A' }}
        </p>
        <p class="mt-4"><strong>Progress:</strong></p>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            class="h-3 rounded-full transition-all"
            :style="{
              width: selectedJob.progress + '%',
              backgroundColor: '#FF8040',
            }"
          ></div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            class="px-4 py-2 rounded bg-red-500 text-white font-semibold"
            @click="deleteJob(selectedJob._id)"
          >
            Delete Job
          </button>
          <button
            class="px-4 py-2 rounded bg-green-500 text-white font-semibold"
            @click="assignExpert(selectedJob)"
          >
            Assign Expert
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

const jobs = ref([]);
const experts = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = 10;
const selectedJob = ref(null);

const socket = io('http://localhost:4000');
const token = localStorage.getItem('token');

// FETCH JOBS
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
    console.error('Failed to fetch jobs:', err);
  }
};

// FETCH EXPERTS
const fetchExperts = async () => {
  try {
    const { data } = await axios.get(
      'http://localhost:4000/api/admin/experts',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    experts.value = data.data;
  } catch (err) {
    console.error('Failed to fetch experts:', err);
  }
};

onMounted(() => {
  fetchJobs();
  fetchExperts();
  socket.emit('joinRoom', { userId: 'admin', role: 'admin' });
  socket.on('notification', () => {
    fetchJobs();
  });
});

// FILTER + PAGINATION
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

const nextPage = () => currentPage.value++;
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// OPEN MODAL
const openJobModal = (job) => {
  selectedJob.value = job;
};

// STATUS COLORS
const statusColor = (status) => {
  switch (status) {
    case 'approved_for_bidding':
      return 'text-blue-600';
    case 'assigned':
      return 'text-purple-600';
    case 'in_progress':
      return 'text-green-600';
    case 'completed':
      return 'text-gray-600';
    case 'revision':
      return 'text-orange-600';
    default:
      return 'text-black';
  }
};
const formatStatus = (status) => status.replace(/_/g, ' ').toUpperCase();

// ASSIGN EXPERT
const assignExpert = async (job) => {
  const expertOptions = experts.value.map((ex) => ({
    id: ex._id,
    name: ex.name,
  }));
  if (!expertOptions.length)
    return Swal.fire({ icon: 'warning', title: 'No experts available' });

  const { value: selectedExpert } = await Swal.fire({
    title: 'Assign Expert',
    input: 'select',
    inputOptions: expertOptions.reduce((obj, ex) => {
      obj[ex.id] = ex.name;
      return obj;
    }, {}),
    inputPlaceholder: 'Select an expert',
    showCancelButton: true,
  });
  if (!selectedExpert) return;

  try {
    await axios.put(
      `http://localhost:4000/api/admin/jobs/${job._id}/assign`,
      { expertId: selectedExpert },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire({ icon: 'success', title: 'Expert Assigned Successfully' });
    fetchJobs();
    selectedJob.value = null;
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Assignment Failed' });
  }
};

// DELETE JOB
const deleteJob = async (jobId) => {
  const result = await Swal.fire({
    title: 'Delete Job?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Delete',
  });
  if (!result.isConfirmed) return;

  try {
    await axios.delete(`http://localhost:4000/api/admin/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    jobs.value = jobs.value.filter((j) => j._id !== jobId);
    Swal.fire({
      icon: 'success',
      title: 'Job deleted',
      timer: 1500,
      showConfirmButton: false,
    });
    selectedJob.value = null;
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to delete job' });
  }
};
</script>

<style scoped>
/* Keep card scrollable if content is too long */
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}
</style>

