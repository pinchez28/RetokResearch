<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#001BB7]">My Projects</h1>
        <p class="text-sm text-gray-600 mt-1">
          Manage your projects, payments, and communication with experts.
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            v-model="q"
            @input="applyFilters"
            placeholder="Search projects..."
            class="px-4 py-2 rounded-xl border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
          />
          <button
            v-if="q"
            @click="
              q = '';
              applyFilters();
            "
            class="absolute right-2 top-2 text-sm text-gray-400"
          >
            ✕
          </button>
        </div>

        <select
          v-model="statusFilter"
          @change="applyFilters"
          class="px-3 py-2 rounded-xl border border-gray-200"
        >
          <option value="">All statuses</option>
          <option v-for="s in statusOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>

        <button
          @click="toggleView"
          class="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-[#F5F1DC]"
          :title="isGrid ? 'Switch to list' : 'Switch to grid'"
        >
          <span v-if="isGrid">List</span>
          <span v-else>Grid</span>
        </button>

        <RouterLink
          to="/client/projects/new"
          class="ml-2 inline-flex items-center px-4 py-2 rounded-xl bg-[#FF8040] text-white font-semibold hover:bg-[#FFA366]"
        >
          + New Project
        </RouterLink>
      </div>
    </div>

    <!-- Projects count -->
    <div class="text-sm text-gray-500">
      Showing <strong>{{ filtered.length }}</strong> of
      {{ projects.length }} projects
    </div>

    <!-- Grid layout -->
    <div
      v-if="isGrid"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <article
        v-for="project in paged"
        :key="project._id"
        class="bg-white rounded-2xl p-4 shadow hover:shadow-md border border-gray-100 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between">
            <h2 class="text-lg font-semibold text-[#001BB7]">
              {{ project.title }}
            </h2>
            <span
              :class="badgeClass(project.status)"
              class="text-xs font-semibold px-2 py-1 rounded-full"
            >
              {{ formatStatus(project.status) }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mt-2 line-clamp-3">
            {{ project.summary }}
          </p>

          <div class="mt-3 text-sm text-gray-500">
            <div><strong>Budget:</strong> {{ project.budget || '—' }}</div>
            <div><strong>Due:</strong> {{ formatDate(project.dueDate) }}</div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button
              @click="viewProject(project)"
              class="px-3 py-1 rounded-lg text-sm border border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/10"
            >
              View
            </button>
          </div>

          <div>
            <!-- Pay / Download -->
            <button
              v-if="project.status === 'Ready for Download' && project.fileUrl"
              @click="downloadFile(project.fileUrl)"
              class="px-3 py-1 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
            >
              Download
            </button>
            <button
              v-else-if="project.pendingPayment"
              @click="goToPayments(project)"
              class="px-3 py-1 rounded-lg text-sm bg-[#FF8040] text-white hover:bg-[#FFA366]"
            >
              Pay to Download
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- List layout -->
    <div v-else class="bg-white rounded-xl shadow divide-y">
      <div
        v-for="project in paged"
        :key="project._id"
        class="p-4 flex items-center justify-between gap-4 hover:bg-[#F5F1DC]/50 transition"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#001BB7] truncate">
              {{ project.title }}
            </h3>
            <span
              :class="badgeClass(project.status)"
              class="text-xs font-semibold px-2 py-1 rounded-full"
            >
              {{ formatStatus(project.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-1 truncate">
            {{ project.summary }}
          </p>
          <div class="text-xs text-gray-500 mt-2">
            Budget: <strong>{{ project.budget || '—' }}</strong> · Due:
            {{ formatDate(project.dueDate) }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="viewProject(project)"
            class="px-3 py-1 rounded-lg text-sm border border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/10"
          >
            View
          </button>

          <button
            v-if="project.status === 'Ready for Download' && project.fileUrl"
            @click="downloadFile(project.fileUrl)"
            class="px-3 py-1 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
          >
            Download
          </button>
          <button
            v-else-if="project.pendingPayment"
            @click="goToPayments(project)"
            class="px-3 py-1 rounded-lg text-sm bg-[#FF8040] text-white hover:bg-[#FFA366]"
          >
            Pay
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-600">
        Page {{ page }} of {{ totalPages }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 rounded bg-white border disabled:opacity-50"
        >
          Prev
        </button>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-1 rounded bg-white border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/utils/api.js';

const router = useRouter();

const isGrid = ref(true);
const q = ref('');
const statusFilter = ref('');
const page = ref(1);
const perPage = ref(9);

const statusOptions = [
  'Open',
  'In Progress',
  'Submitted',
  'Completed',
  'Cancelled',
  'Ready for Download',
];

const projects = ref([]);

// Load projects from API
const loadProjects = async () => {
  try {
    const { data } = await axios.get('/client/projects');
    projects.value = data.projects || [];
  } catch (err) {
    console.error('Failed to load projects', err);
  }
};

onMounted(loadProjects);

// Filtered list: In Progress by default
const filtered = computed(() => {
  let list = projects.value.filter((p) => p.status === 'In Progress');

  if (q.value) {
    const term = q.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.summary && p.summary.toLowerCase().includes(term))
    );
  }

  if (statusFilter.value) {
    list = list.filter((p) => p.status === statusFilter.value);
  }

  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage.value))
);

const paged = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filtered.value.slice(start, start + perPage.value);
});

const applyFilters = () => (page.value = 1);
const toggleView = () => (isGrid.value = !isGrid.value);
const viewProject = (project) => router.push(`/client/projects/${project._id}`);
const openMessage = (project) =>
  router.push({ path: '/client/messages', query: { projectId: project._id } });
const goToPayments = (project) =>
  router.push({ path: '/client/payments', query: { projectId: project._id } });
const prevPage = () => {
  if (page.value > 1) page.value--;
};
const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A');
const formatStatus = (s) =>
  s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';

const badgeClass = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-[#0046FF] text-white';
    case 'In Progress':
      return 'bg-[#001BB7] text-white';
    case 'Submitted':
      return 'bg-[#0046FF] text-white';
    case 'Completed':
      return 'bg-green-600 text-white';
    case 'Ready for Download':
      return 'bg-green-600 text-white';
    case 'Cancelled':
      return 'bg-gray-300 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Download completed file
const downloadFile = (url) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

article button {
  white-space: nowrap;
}
</style>

