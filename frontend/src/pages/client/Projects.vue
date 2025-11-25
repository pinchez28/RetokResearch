<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#001BB7]">My Projects</h1>
        <p class="text-sm text-gray-600 mt-1">
          Manage your projects, payments and communication with experts.
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

    <!-- Grid / List -->
    <div
      v-if="isGrid"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <article
        v-for="project in paged"
        :key="project.id"
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
              {{ project.status }}
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
            <button
              @click="openMessage(project)"
              class="px-3 py-1 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
            >
              Message
            </button>
          </div>

          <div>
            <button
              v-if="project.pendingPayment"
              @click="goToPayments(project)"
              class="px-3 py-1 rounded-lg text-sm bg-[#FF8040] text-white hover:bg-[#FFA366]"
            >
              Pay
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- List layout -->
    <div v-else class="bg-white rounded-xl shadow divide-y">
      <div
        v-for="project in paged"
        :key="project.id"
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
              {{ project.status }}
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
            @click="openMessage(project)"
            class="px-3 py-1 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
          >
            Message
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
import axios from '@/utils/api.js'; // use your axios instance

const router = useRouter();

/* --- UI state --- */
const isGrid = ref(true);
const q = ref('');
const statusFilter = ref('');
const page = ref(1);
const perPage = ref(9);

/* --- sample statuses --- */
const statusOptions = [
  'Open',
  'In Progress',
  'Submitted',
  'Completed',
  'Cancelled',
];

/* --- projects data (replace with API) --- */
const projects = ref([]);

/* --- fetch projects (replace with real API call) --- */
const loadProjects = async () => {
  try {
    // Example API endpoint (you can change to actual)
    // const { data } = await axios.get('/client/projects', { params: { page, perPage }});
    // projects.value = data.projects;

    // For now: mock data
    projects.value = [
      {
        id: 'p1',
        title: 'Business Research Report',
        summary: 'Comprehensive market research on fintech adoption.',
        budget: '$800',
        dueDate: '2025-12-01',
        status: 'In Progress',
        pendingPayment: false,
      },
      {
        id: 'p2',
        title: 'Marketing Analysis',
        summary: 'Customer segmentation and recommendation.',
        budget: '$420',
        dueDate: '2025-11-15',
        status: 'Submitted',
        pendingPayment: true,
      },
      {
        id: 'p3',
        title: 'Technical Writing Task',
        summary: 'Prepare a 10-page technical specification document.',
        budget: '$300',
        dueDate: '2025-11-30',
        status: 'Open',
        pendingPayment: false,
      },
      {
        id: 'p4',
        title: 'Customer Survey Design',
        summary: 'Design survey + analyze preliminary results.',
        budget: '$250',
        dueDate: '2025-10-20',
        status: 'Completed',
        pendingPayment: false,
      },
      {
        id: 'p5',
        title: 'Pricing Strategy',
        summary: 'Deliver a pricing strategy for product launch.',
        budget: '$950',
        dueDate: '2025-12-15',
        status: 'In Progress',
        pendingPayment: true,
      },
      // add more mock items to test pagination UI
      {
        id: 'p6',
        title: 'Competitor Analysis',
        summary: 'Benchmark competitors in 3 markets.',
        budget: '$600',
        dueDate: '2025-11-18',
        status: 'Open',
        pendingPayment: false,
      },
      {
        id: 'p7',
        title: 'UX Research',
        summary: 'Remote user interviews and insights',
        budget: '$500',
        dueDate: '2025-11-10',
        status: 'Submitted',
        pendingPayment: false,
      },
      {
        id: 'p8',
        title: 'Statistical Report',
        summary: 'Data science analysis and report.',
        budget: '$700',
        dueDate: '2025-12-05',
        status: 'In Progress',
        pendingPayment: false,
      },
      {
        id: 'p9',
        title: 'Industry Whitepaper',
        summary: 'Long-form whitepaper on industry trends.',
        budget: '$1200',
        dueDate: '2026-01-20',
        status: 'Open',
        pendingPayment: false,
      },
      {
        id: 'p10',
        title: 'Ad-hoc Research',
        summary: 'Short sprint research.',
        budget: '$150',
        dueDate: '2025-11-02',
        status: 'Cancelled',
        pendingPayment: false,
      },
    ];
  } catch (err) {
    console.error('Failed to load projects', err);
  }
};

onMounted(() => {
  loadProjects();
});

/* --- derived lists and pagination --- */
const filtered = computed(() => {
  let list = projects.value.slice();

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

/* --- actions --- */
const applyFilters = () => {
  page.value = 1;
};

const toggleView = () => {
  isGrid.value = !isGrid.value;
};

const viewProject = (project) => {
  // Navigate to project details
  router.push({ path: `/client/projects/${project.id}` });
};

const openMessage = (project) => {
  // Navigate to messages filtered by project
  router.push({ path: '/client/messages', query: { projectId: project.id } });
};

const goToPayments = (project) => {
  router.push({ path: '/client/payments', query: { projectId: project.id } });
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
};

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
    case 'Cancelled':
      return 'bg-gray-300 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<style scoped>
/* small utility for truncation (uses line-clamp if available) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ensure action buttons do not shrink */
article button {
  white-space: nowrap;
}
</style>
