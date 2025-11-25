<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- WELCOME SECTION -->
    <section class="bg-[#001BB7] text-[#F5F1DC] rounded-2xl p-6 shadow-lg">
      <h2 class="text-2xl md:text-3xl font-bold">
        Welcome back, {{ clientName }} 👋
      </h2>
      <p class="mt-2 text-sm md:text-base opacity-90">
        Track assignments, manage payments, and communicate with experts easily.
      </p>
    </section>

    <!-- STATS CARDS -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#0046FF] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Active Projects</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.active }}</p>
      </div>

      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#001BB7] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Completed</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.completed }}</p>
      </div>

      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#FF8040] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Pending Payments</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.pendingPayments }}</p>
      </div>

      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#0046FF] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Messages</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.messages }}</p>
      </div>
    </section>

    <!-- RECENT PROJECTS LIST -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl md:text-2xl font-semibold text-[#001BB7]">
          Recent Projects
        </h2>
        <RouterLink
          to="/client/projects"
          class="text-[#0046FF] hover:underline font-medium"
        >
          View all →
        </RouterLink>
      </div>

      <div
        v-if="paginatedProjects.length === 0"
        class="bg-white p-6 rounded-2xl shadow text-center text-gray-500"
      >
        No recent projects found.
      </div>

      <div
        v-else
        class="bg-white shadow-lg rounded-2xl divide-y divide-gray-100"
      >
        <div
          v-for="project in paginatedProjects"
          :key="project.id"
          class="p-4 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
          @click="goToProject(project.id)"
        >
          <div>
            <h3 class="font-semibold text-[#001BB7]">{{ project.title }}</h3>
            <p class="text-sm text-gray-500">{{ project.client }}</p>
          </div>
          <span
            class="px-3 py-1 text-xs rounded-full font-semibold"
            :class="statusColor(project.status)"
          >
            {{ project.status }}
          </span>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-end space-x-2 mt-4">
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
    </section>

    <!-- CTA SECTION -->
    <section
      class="bg-[#FF8040] text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between"
    >
      <h3 class="text-xl font-semibold">Need help with a new assignment?</h3>
      <RouterLink
        to="/client/projects"
        class="mt-3 md:mt-0 bg-white text-[#FF8040] font-semibold px-5 py-2 rounded-lg hover:bg-[#F5F1DC] transition"
      >
        Post a Project
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const clientName = 'Client';

const stats = ref({
  active: 2,
  completed: 6,
  pendingPayments: 1,
  messages: 4,
});

// All projects
const allProjects = ref([
  {
    id: 1,
    title: 'Business Research Report',
    status: 'In Progress',
    client: 'Acme Corp',
  },
  { id: 2, title: 'Marketing Analysis', status: 'Submitted', client: 'Globex' },
  {
    id: 3,
    title: 'Technical Writing Task',
    status: 'Revisions',
    client: 'Initech',
  },
  { id: 4, title: 'Website Redesign', status: 'Completed', client: 'Hooli' },
  { id: 5, title: 'Logo Design', status: 'In Progress', client: 'Umbrella' },
]);

// Pagination
const currentPage = ref(1);
const pageSize = 3;
const totalPages = computed(() =>
  Math.ceil(allProjects.value.length / pageSize)
);
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return allProjects.value.slice(start, start + pageSize);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const statusColor = (status) =>
  ({
    'In Progress': 'bg-[#0046FF] text-white',
    Submitted: 'bg-[#001BB7] text-white',
    Revisions: 'bg-[#FF8040] text-white',
    Completed: 'bg-green-600 text-white',
  }[status] || 'bg-gray-300 text-gray-800');

const goToProject = (id) => router.push(`/client/projects?id=${id}`);
</script>
