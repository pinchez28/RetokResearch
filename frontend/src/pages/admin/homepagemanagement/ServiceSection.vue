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

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center my-10">
      <div
        class="loader border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16 animate-spin"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="services.length === 0"
      class="text-center text-gray-500 mt-20"
    >
      No services available yet.
    </div>

    <!-- List View Grouped by Branch & Category -->
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
              <span class="text-gray-700 font-medium">{{
                service.priceRange || '-'
              }}</span>
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

    <!-- Admin Modal -->
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

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

// Fetch services from API
const fetchServices = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/services');
    services.value = Array.isArray(data) ? data : [];
    currentPage.value = 1; // reset pagination
  } catch (err) {
    console.error('Fetch services error:', err);
    toast.error('Failed to fetch services');
  } finally {
    loading.value = false;
  }
};

// Paginated slice
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return services.value.slice(start, start + pageSize.value);
});

// Pagination page count
const totalPages = computed(() =>
  Math.ceil(services.value.length / pageSize.value)
);

// Group paginated services by branch + category
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

// Open modal for adding/editing service
const openModal = (service = null) => {
  selectedService.value = service ? { ...service } : {};
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  selectedService.value = null;
  showModal.value = false;
};

// Update services after save
const onSaved = (service) => {
  const index = services.value.findIndex((s) => s._id === service._id);
  if (index > -1) services.value[index] = service;
  else services.value.unshift(service);

  currentPage.value = 1; // reset pagination
  toast.success('Service saved successfully');
};

// Remove service after delete
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
