<template>
  <div class="p-6 bg-[#F5F5F5] min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">My Projects</h1>

    <!-- Filters & Search -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <input
        type="text"
        placeholder="Search projects..."
        v-model="searchQuery"
        class="px-4 py-2 border rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
      />

      <div class="flex gap-2">
        <select
          v-model="filterStatus"
          class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          v-model="filterCategory"
          class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <!-- Project List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in paginatedProjects"
        :key="project.id"
        class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-800">
            {{ project.title }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Posted by: {{ project.clientName }}
          </p>
        </div>

        <div class="mt-4 text-gray-600 flex flex-col gap-1 text-sm">
          <div><strong>Category:</strong> {{ project.category }}</div>
          <div><strong>Budget:</strong> ${{ project.budget }}</div>
          <div>
            <strong>Deadline:</strong> {{ formatDate(project.deadline) }}
          </div>
          <div>
            <strong>Status:</strong>
            <span
              :class="{
                'text-green-600 font-semibold': project.status === 'Active',
                'text-gray-500 font-medium': project.status === 'Completed',
                'text-red-600 font-semibold': project.status === 'Overdue',
              }"
            >
              {{ project.status }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button
            class="px-3 py-1 bg-[#001BB7] text-white rounded hover:bg-[#0046FF] transition"
            @click="viewProject(project.id)"
          >
            View
          </button>
          <button
            class="px-3 py-1 bg-[#FF8040] text-white rounded hover:bg-[#FFA366] transition"
            @click="submitProposal(project.id)"
          >
            Submit Proposal
          </button>
        </div>
      </div>
    </div>

    <!-- No Projects -->
    <p
      v-if="filteredProjects.length === 0"
      class="text-gray-500 mt-6 text-center"
    >
      No projects found.
    </p>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8 gap-2 flex-wrap">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded-md bg-[#001BB7] text-white disabled:bg-gray-400"
      >
        Prev
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-3 py-1 rounded-md',
          currentPage === page
            ? 'bg-[#FF8040] text-[#001BB7]'
            : 'bg-white text-gray-700 border',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-md bg-[#001BB7] text-white disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const projects = ref([
  {
    id: 1,
    title: 'Build a Vue 3 Admin Dashboard',
    clientName: 'TechCorp',
    category: 'Web Development',
    budget: 1200,
    deadline: '2025-12-10',
    status: 'Active',
    createdAt: '2025-11-20',
  },
  {
    id: 2,
    title: 'Design a Mobile App UI/UX',
    clientName: 'CreativeStudio',
    category: 'Design',
    budget: 800,
    deadline: '2025-12-01',
    status: 'Completed',
    createdAt: '2025-11-18',
  },
  {
    id: 3,
    title: 'API Integration for E-commerce',
    clientName: 'ShopEasy',
    category: 'Backend Development',
    budget: 600,
    deadline: '2025-12-15',
    status: 'Active',
    createdAt: '2025-11-22',
  },
  {
    id: 4,
    title: 'Frontend React Upgrade',
    clientName: 'WebSolutions',
    category: 'Web Development',
    budget: 500,
    deadline: '2025-12-05',
    status: 'Overdue',
    createdAt: '2025-11-21',
  },
]);

const searchQuery = ref('');
const filterStatus = ref('');
const filterCategory = ref('');

const itemsPerPage = 3;
const currentPage = ref(1);

// Compute unique categories
const categories = computed(() => {
  return [...new Set(projects.value.map((p) => p.category))];
});

// Filtered projects
const filteredProjects = computed(() => {
  return projects.value
    .filter(
      (p) =>
        (!filterStatus.value || p.status === filterStatus.value) &&
        (!filterCategory.value || p.category === filterCategory.value) &&
        (!searchQuery.value ||
          p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          p.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Pagination calculations
const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / itemsPerPage)
);
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProjects.value.slice(start, start + itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Actions
const viewProject = (id) => console.log('View project', id);
const submitProposal = (id) => console.log('Submit proposal', id);

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
</script>

<style scoped>
div.bg-white:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
</style>

