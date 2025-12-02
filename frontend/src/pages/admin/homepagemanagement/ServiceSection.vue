<template>
  <section class="p-6 bg-gray-50 min-h-screen relative">
    <h2 class="text-3xl font-extrabold text-blue-900 mb-6 text-center">
      Manage Services
    </h2>

    <!-- Add Service Button (Admin Only) -->
    <div class="flex justify-end mb-6">
      <button
        @click="openModal()"
        class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl shadow-md"
      >
        Add New Service
      </button>
    </div>

    <!-- Search + Filters -->
    <div
      class="mb-6 flex flex-col md:flex-row gap-4 justify-center items-center"
    >
      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search services..."
        class="w-full max-w-md px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <!-- Branch Filter -->
      <select
        v-model="branchFilter"
        class="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Branches</option>
        <option
          v-for="branch in availableBranches"
          :key="branch"
          :value="branch"
        >
          {{ branch }}
        </option>
      </select>

      <!-- Category Filter -->
      <select
        v-model="categoryFilter"
        class="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option
          v-for="category in availableCategories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center my-10">
      <div
        class="loader border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16 animate-spin"
      ></div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="filteredServices.length === 0"
      class="text-center text-gray-500 mt-20"
    >
      No services found.
    </div>

    <!-- List View -->
    <div v-else>
      <div
        v-for="(branchServices, branchName) in groupedServices"
        :key="branchName"
        class="mb-8"
      >
        <h3 class="text-2xl font-bold text-blue-800 mb-4">{{ branchName }}</h3>

        <div
          v-for="(categoryServices, categoryName) in branchServices"
          :key="categoryName"
          class="mb-4"
        >
          <h4 class="text-xl font-semibold text-gray-700 mb-2">
            {{ categoryName }}
          </h4>

          <ul
            class="border border-gray-200 rounded-lg divide-y divide-gray-200"
          >
            <li
              v-for="service in categoryServices"
              :key="service._id"
              class="p-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              @click="openModal(service)"
            >
              <div>
                <p class="font-medium text-gray-900">{{ service.title }}</p>
                <p class="text-sm text-gray-600">
                  {{ service.shortDescription || 'No description' }}
                </p>
              </div>
              <span class="text-gray-700 font-medium">
                {{ service.priceRange || '-' }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-3 mt-10"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg font-semibold shadow-md"
          :class="
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-700 text-white hover:bg-blue-800'
          "
        >
          Prev
        </button>

        <span class="text-blue-900 font-bold text-lg">
          Page {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg font-semibold shadow-md"
          :class="
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-700 text-white hover:bg-blue-800'
          "
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <AdminServiceDetailsModal
      v-if="showModal"
      :visible="showModal"
      :service="selectedService"
      @close="closeModal"
      @saved="onSaved"
      @deleted="onDeleted"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api.js';
import { toast } from 'vue-sonner';
import AdminServiceDetailsModal from '@/components/AdminServiceDetailsModal.vue';

const services = ref([]);
const loading = ref(false);
const selectedService = ref(null);
const showModal = ref(false);

const searchQuery = ref('');
const branchFilter = ref('');
const categoryFilter = ref('');

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

// Fetch services
const fetchServices = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/services');
    services.value = Array.isArray(data) ? data : [];
    currentPage.value = 1;
  } catch {
    toast.error('Failed to fetch services');
  } finally {
    loading.value = false;
  }
};

// Filtered services
const filteredServices = computed(() => {
  let list = services.value;

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((s) =>
      [s.title, s.shortDescription, s.branch, s.category, s.priceRange]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q))
    );
  }

  // Branch filter
  if (branchFilter.value) {
    list = list.filter((s) => s.branch === branchFilter.value);
  }

  // Category filter
  if (categoryFilter.value) {
    list = list.filter((s) => s.category === categoryFilter.value);
  }

  return list;
});

// Dynamic dropdown data
const availableBranches = computed(() => [
  ...new Set(services.value.map((s) => s.branch).filter(Boolean)),
]);

const availableCategories = computed(() => [
  ...new Set(services.value.map((s) => s.category).filter(Boolean)),
]);

// Paginated slice
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredServices.value.slice(start, start + pageSize.value);
});

// Page count
const totalPages = computed(() =>
  Math.ceil(filteredServices.value.length / pageSize.value)
);

// Group services
const groupedServices = computed(() => {
  const groups = {};
  paginatedServices.value.forEach((service) => {
    const branch = service.branch || 'Unassigned Branch';
    const category = service.category || 'Unassigned Category';
    if (!groups[branch]) groups[branch] = {};
    if (!groups[branch][category]) groups[branch][category] = [];
    groups[branch][category].push(service);
  });
  return groups;
});

// Modal controls
const openModal = (service = null) => {
  selectedService.value = service ? { ...service } : {};
  showModal.value = true;
};

const closeModal = () => {
  selectedService.value = null;
  showModal.value = false;
};

const onSaved = (service) => {
  const index = services.value.findIndex((s) => s._id === service._id);
  if (index > -1) services.value[index] = service;
  else services.value.unshift(service);
  currentPage.value = 1;
  toast.success('Service saved successfully');
};

const onDeleted = (id) => {
  services.value = services.value.filter((s) => s._id !== id);
  if (currentPage.value > totalPages.value)
    currentPage.value = totalPages.value;
  toast.success('Service deleted successfully');
};

onMounted(fetchServices);
</script>

<style scoped>
.loader {
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
