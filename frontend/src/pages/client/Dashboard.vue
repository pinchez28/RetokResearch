<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- WELCOME SECTION -->
    <section class="bg-[#001BB7] text-[#F5F1DC] rounded-2xl p-6 shadow-lg">
      <h2 class="text-3xl md:text-3xl font-extrabold">
        Welcome back, {{ clientName }} 👋
      </h2>
      <p class="mt-2 text-sm md:text-base opacity-90 text-white uppercase">
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

    <!-- RECENT PROJECTS CARDS -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl md:text-2xl font-semibold text-[#001BB7]">
          Recent Projects
        </h2>
      </div>

      <div v-if="loadingProjects" class="text-center text-gray-500 py-10">
        Loading projects...
      </div>

      <div
        v-else-if="projects.length === 0"
        class="text-center text-gray-500 py-10"
      >
        No projects found.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projects"
          :key="project._id"
          class="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer"
          @click="viewProject(project)"
        >
          <h3 class="font-bold text-[#001BB7] text-lg">{{ project.title }}</h3>
          <p class="text-gray-600 mt-1 truncate">
            {{ project.summary || project.description }}
          </p>
          <div class="flex justify-between mt-4 text-sm text-gray-500">
            <span
              >Budget:
              {{ project.budget ? 'KES ' + project.budget : '—' }}</span
            >
            <span>Due: {{ formatDate(project.dueDate) }}</span>
          </div>
          <span
            class="mt-2 inline-block px-3 py-1 text-xs rounded-full font-semibold"
            :class="statusColor(project.status)"
          >
            {{ project.status }}
          </span>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-end space-x-2 mt-6">
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
        to="/client/post-job"
        class="mt-3 md:mt-0 bg-white text-[#FF8040] font-semibold px-5 py-2 rounded-lg hover:bg-[#F5F1DC] transition"
      >
        Post a Project
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import axios from 'axios';

const router = useRouter();

const clientName = ref('');
const stats = ref({
  active: 0,
  completed: 0,
  pendingPayments: 0,
  messages: 0,
});

const projects = ref([]);
const loadingProjects = ref(true);

// Pagination
const currentPage = ref(1);
const pageSize = 6;
const totalPages = ref(1);

const backendURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Format date
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : '—';

// Status badge colors
const statusColor = (status) =>
  ({
    'In Progress': 'bg-[#0046FF] text-white',
    Submitted: 'bg-[#001BB7] text-white',
    Revisions: 'bg-[#FF8040] text-white',
    Completed: 'bg-green-600 text-white',
    Open: 'bg-[#0046FF] text-white',
    Cancelled: 'bg-gray-300 text-gray-700',
  }[status] || 'bg-gray-100 text-gray-800');

// Fetch client profile
const fetchClientProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${backendURL}/api/client/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Correct path based on your backend response
    clientName.value = data?.data?.name || 'Client';
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Failed to fetch client info', 'error');
  }
};

// Fetch stats
const fetchStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${backendURL}/api/client/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    stats.value = data?.stats || stats.value;
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Failed to fetch stats', 'error');
  }
};

// Fetch paginated projects
const fetchProjects = async () => {
  loadingProjects.value = true;
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${backendURL}/api/client/projects`, {
      params: { page: currentPage.value, limit: pageSize },
      headers: { Authorization: `Bearer ${token}` },
    });
    projects.value = data?.projects || [];
    totalPages.value = data?.totalPages || 1;
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Failed to fetch projects', 'error');
  } finally {
    loadingProjects.value = false;
  }
};

// Pagination controls
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProjects();
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchProjects();
  }
};

// View project details modal
const viewProject = (project) => {
  Swal.fire({
    title: `<strong>${project.title}</strong>`,
    html: `
      <p><strong>Description:</strong> ${project.description}</p>
      <p><strong>Budget:</strong> ${
        project.budget ? 'KES ' + project.budget : '—'
      }</p>
      <p><strong>Due Date:</strong> ${formatDate(project.dueDate)}</p>
      <p><strong>Status:</strong> ${project.status}</p>
      <p><strong>Assigned Expert:</strong> ${
        project.expertName || 'Not assigned yet'
      }</p>
    `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: 'Go to Project',
    cancelButtonText: 'Close',
  }).then((result) => {
    if (result.isConfirmed) {
      router.push(`/client/projects/${project._id}`);
    }
  });
};

onMounted(async () => {
  await fetchClientProfile();
  await fetchStats();
  await fetchProjects();
});
</script>

<style scoped>
/* Hover card effect */
div.cursor-pointer:hover {
  transform: translateY(-2px);
  transition: all 0.2s;
}
</style>
