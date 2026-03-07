<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Job Disputes</h1>

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
        <option value="">All Disputes</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>

    <!-- Disputes Table -->
    <div class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#001BB7] text-white">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('id')"
            >
              Job ID <span>{{ getSortIcon("id") }}</span>
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('client')"
            >
              Client <span>{{ getSortIcon("client") }}</span>
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('expert')"
            >
              Expert <span>{{ getSortIcon("expert") }}</span>
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left cursor-pointer"
              @click="sortBy('date')"
            >
              Dispute Date <span>{{ getSortIcon("date") }}</span>
            </th>
            <th scope="col" class="px-4 py-3 text-left">Reason</th>
            <th scope="col" class="px-4 py-3 text-left">Status</th>
            <th scope="col" class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="job in paginatedDisputes"
            :key="job.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2">{{ job.id }}</td>
            <td class="px-4 py-2">{{ job.client }}</td>
            <td class="px-4 py-2">{{ job.expert }}</td>
            <td class="px-4 py-2">{{ job.date }}</td>
            <td class="px-4 py-2">{{ job.reason }}</td>
            <td class="px-4 py-2">
              <span
                :class="{
                  'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm':
                    job.status === 'pending',
                  'bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm':
                    job.status === 'resolved',
                }"
              >
                {{ job.status }}
              </span>
            </td>
            <td class="px-4 py-2 space-x-2">
              <button
                @click="resolveDispute(job)"
                class="bg-green-200 text-green-800 px-3 py-1 rounded-md hover:bg-green-300 transition"
              >
                Resolve
              </button>
              <button
                @click="contactClient(job)"
                class="bg-blue-200 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-300 transition"
              >
                Contact Client
              </button>
              <button
                @click="contactExpert(job)"
                class="bg-purple-200 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-300 transition"
              >
                Contact Expert
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

// Dummy disputes data
const disputes = ref([
  {
    id: "JOB-003",
    client: "Charlie Lee",
    expert: "Mark Spencer",
    date: "2025-11-25",
    reason: "Payment not released",
    status: "pending",
  },
  {
    id: "JOB-007",
    client: "Alice Johnson",
    expert: "John Doe",
    date: "2025-11-20",
    reason: "Incomplete deliverables",
    status: "resolved",
  },
  {
    id: "JOB-012",
    client: "Bob Smith",
    expert: "Jane Doe",
    date: "2025-11-22",
    reason: "Missed deadline",
    status: "pending",
  },
]);

// Filters
const searchQuery = ref("");
const filterStatus = ref("");

// Sorting
const sortKey = ref("");
const sortAsc = ref(true);

const sortedDisputes = computed(() => {
  let filtered = disputes.value.filter((job) => {
    const query = searchQuery.value.toLowerCase();
    return (
      job.id.toLowerCase().includes(query) ||
      job.client.toLowerCase().includes(query) ||
      job.expert.toLowerCase().includes(query) ||
      job.reason.toLowerCase().includes(query)
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
const totalPages = computed(() => Math.ceil(sortedDisputes.value.length / perPage));

const paginatedDisputes = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return sortedDisputes.value.slice(start, start + perPage);
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

// Actions
const resolveDispute = (job) => {
  alert(`Resolved dispute for Job ${job.id}`);
};
const contactClient = (job) => {
  alert(`Contacting client: ${job.client}`);
};
const contactExpert = (job) => {
  alert(`Contacting expert: ${job.expert}`);
};
</script>

<style scoped>
table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>

