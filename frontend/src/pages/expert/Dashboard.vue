<template>
  <div class="p-6 md:p-10 space-y-8 bg-gray-100 min-h-screen">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center">
      <h1 class="text-3xl md:text-4xl font-bold text-[#001BB7]">
        Welcome, {{ user.name || 'Expert' }}
      </h1>
      <p class="mt-2 md:mt-0 text-gray-600">
        Here’s a summary of your current activity
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Assignments -->
      <div
        class="p-6 rounded-2xl flex items-center space-x-4 shadow-lg hover:shadow-2xl transition"
        style="
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
        "
      >
        <div class="p-4 bg-white text-[#6a11cb] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-lg">Total Assignments</h2>
          <p class="mt-1 text-2xl font-bold">{{ assignments.length }}</p>
        </div>
      </div>

      <!-- Active Jobs -->
      <div
        class="p-6 rounded-2xl flex items-center space-x-4 shadow-lg hover:shadow-2xl transition"
        style="
          background: linear-gradient(to right, #ff512f, #dd2476);
          color: white;
        "
      >
        <div class="p-4 bg-white text-[#ff512f] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-lg">Active Jobs</h2>
          <p class="mt-1 text-2xl font-bold">{{ jobs.length }}</p>
        </div>
      </div>

      <!-- Earnings -->
      <div
        class="p-6 rounded-2xl flex items-center space-x-4 shadow-lg hover:shadow-2xl transition"
        style="
          background: linear-gradient(to right, #11998e, #38ef7d);
          color: white;
        "
      >
        <div class="p-4 bg-white text-[#11998e] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 2v2m0 16v2m8-8h-2M4 12H2"
            />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-lg">Earnings</h2>
          <p class="mt-1 text-2xl font-bold">${{ earnings }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Projects Table -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="font-bold text-xl text-[#001BB7] mb-4">Recent Projects</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Project
              </th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Client
              </th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Budget
              </th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Due
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="project in projects"
              :key="project.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ project.title }}</td>
              <td class="px-4 py-2">{{ project.client }}</td>
              <td class="px-4 py-2 capitalize">{{ project.status }}</td>
              <td class="px-4 py-2">${{ project.budget }}</td>
              <td class="px-4 py-2">{{ project.dueDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end space-x-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
const assignments = ref([]);
const jobs = ref([]);
const earnings = ref(0);

const allProjects = ref([
  {
    id: 1,
    title: 'Website Redesign',
    client: 'Acme Corp',
    status: 'active',
    budget: 500,
    dueDate: '2025-12-05',
  },
  {
    id: 2,
    title: 'Mobile App Development',
    client: 'Globex',
    status: 'active',
    budget: 1200,
    dueDate: '2025-12-10',
  },
  {
    id: 3,
    title: 'Logo Design',
    client: 'Initech',
    status: 'completed',
    budget: 300,
    dueDate: '2025-11-30',
  },
  {
    id: 4,
    title: 'Marketing Campaign',
    client: 'Hooli',
    status: 'active',
    budget: 1500,
    dueDate: '2025-12-12',
  },
  {
    id: 5,
    title: 'Backend API',
    client: 'Umbrella',
    status: 'pending',
    budget: 800,
    dueDate: '2025-12-08',
  },
]);

const currentPage = ref(1);
const pageSize = 3;
const totalPages = computed(() =>
  Math.ceil(allProjects.value.length / pageSize)
);
const projects = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return allProjects.value.slice(start, start + pageSize);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(() => {
  assignments.value = [{ id: 1 }, { id: 2 }];
  jobs.value = [{ id: 1 }, { id: 2 }, { id: 3 }];
  earnings.value = 1200;
});
</script>

<style scoped>
tr:hover {
  transition: background-color 0.2s;
}
</style>
