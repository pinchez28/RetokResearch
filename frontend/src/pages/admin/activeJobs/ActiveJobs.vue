<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">Active Jobs</h1>

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
        <option value="in-progress">In Progress</option>
        <option value="awaiting-client">Awaiting Client</option>
        <option value="awaiting-expert">Awaiting Expert</option>
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
            <th class="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in filteredJobs"
            :key="job.id"
            class="border-b hover:bg-[#F5F1DC]/40 transition"
          >
            <td class="py-3 px-4 font-semibold">{{ job.title }}</td>
            <td class="py-3 px-4">{{ job.client }}</td>
            <td class="py-3 px-4">{{ job.expert }}</td>

            <td class="py-3 px-4">
              <span
                class="px-3 py-1 text-sm font-semibold rounded-md"
                :style="{
                  backgroundColor: statusColors[job.status],
                  color: '#001BB7',
                }"
              >
                {{ formatStatus(job.status) }}
              </span>
            </td>

            <td class="py-3 px-4">{{ job.deadline }}</td>

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

            <td class="py-3 px-4 text-center">
              <button
                class="px-4 py-2 rounded-md font-semibold text-[#001BB7]"
                style="background-color: #d4af37"
                @click="openJob(job)"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="filteredJobs.length === 0"
      class="text-center py-10 text-lg font-semibold text-[#001BB7]"
    >
      No active jobs found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/* ============================
   DUMMY DATA (API READY)
============================ */
const jobs = ref([
  {
    id: 1,
    title: 'Research Proposal Writing',
    client: 'John Doe',
    expert: 'Dr. Smith',
    status: 'in-progress',
    deadline: '2025-02-05',
    progress: 65,
  },
  {
    id: 2,
    title: 'Literature Review Assistance',
    client: 'Mariam N.',
    expert: 'Prof. Adams',
    status: 'awaiting-client',
    deadline: '2025-02-08',
    progress: 40,
  },
  {
    id: 3,
    title: 'Data Analysis Support',
    client: 'Kevin O.',
    expert: 'Dr. Lee',
    status: 'revision',
    deadline: '2025-02-03',
    progress: 80,
  },
  {
    id: 4,
    title: 'Assignment Tutoring Session',
    client: 'Sarah M.',
    expert: 'Tutor Alex',
    status: 'awaiting-expert',
    deadline: '2025-02-10',
    progress: 10,
  },
]);

/* ============================
   FILTERS + SEARCH
============================ */
const searchQuery = ref('');
const statusFilter = ref('');

const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.expert.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      statusFilter.value === '' || job.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

/* ============================
   STATUS COLOR MAPPING
============================ */
const statusColors = {
  'in-progress': '#FFA366',
  'awaiting-client': '#D4AF37',
  'awaiting-expert': '#FF8040',
  revision: '#0046FF',
};

const formatStatus = (status) =>
  status.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/* ============================
   VIEW DETAILS
============================ */
const openJob = (job) => {
  router.push(`/admin/activejobs/${job.id}`);
};
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}
</style>
