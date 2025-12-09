<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Completed Jobs</h1>

    <!-- Filters / Search -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by Job ID, Client, Expert..."
        class="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
      />
      <select
        v-model="filterStatus"
        class="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
      >
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="disputed">Disputed</option>
      </select>
    </div>

    <!-- Jobs Table -->
    <div class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#001BB7] text-white">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('id')"
            >
              Job ID
              <span>{{ getSortIcon("id") }}</span>
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('client')"
            >
              Client
              <span>{{ getSortIcon("client") }}</span>
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('expert')"
            >
              Expert
              <span>{{ getSortIcon("expert") }}</span>
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('date')"
            >
              Completed Date
              <span>{{ getSortIcon("date") }}</span>
            </th>
            <th scope="col" class="px-4 py-3 text-left">Status</th>
            <th scope="col" class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="job in paginatedJobs"
            :key="job.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2">{{ job.id }}</td>
            <td class="px-4 py-2">{{ job.client }}</td>
            <td class="px-4 py-2">{{ job.expert }}</td>
            <td class="px-4 py-2">{{ job.date }}</td>
            <td class="px-4 py-2">
              <span
                :class="{
                  'bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm':
                    job.status === 'completed',
                  'bg-red-200 text-red-800 px-2 py-1 rounded-full text-sm':
                    job.status === 'disputed',
                }"
              >
                {{ job.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <button
                @click="viewDetails(job)"
                class="bg-[#FF8040] text-[#001BB7] px-3 py-1 rounded-md hover:bg-[#FFA366] transition"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Dummy jobs data
const jobs = ref([
  {
    id: "JOB-001",
    client: "Alice Johnson",
    expert: "John Doe",
    date: "2025-11-27",
    status: "completed",
  },
  {
    id: "JOB-002",
    client: "Bob Smith",
    expert: "Jane Doe",
    date: "2025-11-26",
    status: "completed",
  },
  {
    id: "JOB-003",
    client: "Charlie Lee",
    expert: "Mark Spencer",
    date: "2025-11-25",
    status: "disputed",
  },
  // add more dummy jobs here
]);

// Filters
const searchQuery = ref("");
const filterStatus = ref("");

// Sorting
const sortKey = ref("");
const sortAsc = ref(true);

const sortedJobs = computed(() => {
  let filtered = jobs.value.filter((job) => {
    const query = searchQuery.value.toLowerCase();
    return (
      job.id.toLowerCase().includes(query) ||
      job.client.toLowerCase().includes(query) ||
      job.expert.toLowerCase().includes(query)
    );
  });

  if (filterStatus.value) {
    filtered = filtered.filter((job) => job.status === filterStatus.value);
  }

  if (sortKey.value) {
    filtered.sort((a, b) => {
      if (a[sortKey.value] < b[sortKey.value]) return sortAsc.value ? -1 : 1;
      if (a[sortKey.value] > b[sortKey.value]) return sortAsc.value ? 1 : -1;
      return 0;
    });
  }

  return filtered;
});

// Pagination
const currentPage = ref(1);
const perPage = 5;
const totalPages = computed(() => Math.ceil(sortedJobs.value.length / perPage));

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return sortedJobs.value.slice(start, start + perPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Sorting handler
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const getSortIcon = (key) => {
  if (sortKey.value !== key) return "⇅";
  return sortAsc.value ? "↑" : "↓";
};

// View details placeholder
const viewDetails = (job) => {
  alert(`Viewing details for Job ${job.id}`);
};
</script>

<style scoped>
/* Optional: sticky table header on scroll */
table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>

