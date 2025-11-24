<template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-3xl font-extrabold text-blue-900 mb-6 text-center">
      Admin Services Management
    </h2>

    <!-- Add Service Button -->
    <div class="flex justify-end mb-6">
      <button
        @click="openServiceModal()"
        class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl shadow-md"
      >
        Add New Service
      </button>
    </div>

    <!-- Services Table -->
    <div v-if="paginatedServices.length" class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr class="bg-blue-700 text-white text-left">
            <th class="p-3">Title</th>
            <th class="p-3">Branch</th>
            <th class="p-3">Category</th>
            <th class="p-3">Short Description</th>
            <th class="p-3">Price (Ksh)</th>
            <th class="p-3">Featured</th>
            <th class="p-3">Created At</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="service in paginatedServices"
            :key="service._id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-3">{{ service.title || 'N/A' }}</td>
            <td class="p-3">{{ service.branch || 'N/A' }}</td>
            <td class="p-3">{{ service.category || 'N/A' }}</td>
            <td class="p-3">{{ service.shortDescription || 'N/A' }}</td>
            <td class="p-3">{{ service.priceRange || 'N/A' }}</td>
            <td class="p-3">
              <span
                class="px-2 py-1 rounded-full text-white text-sm"
                :class="service.featured ? 'bg-green-600' : 'bg-gray-400'"
              >
                {{ service.featured ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="p-3">
              {{
                service.createdAt
                  ? new Date(service.createdAt).toLocaleString()
                  : 'N/A'
              }}
            </td>
            <td class="p-3 flex gap-2">
              <button
                @click="openServiceModal(service)"
                class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-xl"
              >
                Edit
              </button>
              <button
                @click="deleteService(service._id)"
                class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-xl"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center gap-3 mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded-md',
            page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <p v-else class="text-center text-gray-600 mt-8">
      No services found. Add a new service to get started.
    </p>

    <!-- Service Modal -->
    <transition name="fade">
      <div
        v-if="isServiceModalVisible"
        @click.self="closeServiceModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative overflow-y-auto"
        >
          <button
            @click="closeServiceModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            &times;
          </button>

          <h2 class="text-2xl font-bold mb-4 text-gray-800">
            {{ selectedService._id ? 'Edit Service' : 'Add New Service' }}
          </h2>

          <form @submit.prevent="submitService" class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block mb-1 font-medium text-gray-800">Title</label>
              <input
                v-model="selectedService.title"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Service Title"
              />
            </div>

            <!-- Branch -->
            <div>
              <label class="block mb-1 font-medium text-gray-800">Branch</label>
              <select
                v-model="selectedService.branch"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="" disabled>Select branch</option>
                <option value="Academic Research">Academic Research</option>
                <option value="Industrial & Corporate">
                  Industrial & Corporate
                </option>
              </select>
            </div>

            <!-- Category -->
            <div>
              <label class="block mb-1 font-medium text-gray-800"
                >Category</label
              >
              <select
                v-model="selectedService.category"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="" disabled>Select category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <!-- Short Description -->
            <div>
              <label class="block mb-1 font-medium text-gray-800">
                Short Description
              </label>
              <input
                v-model="selectedService.shortDescription"
                type="text"
                required
                placeholder="Brief summary, e.g., Fast-track journal editing"
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <!-- Full Description -->
            <div>
              <label class="block mb-1 font-medium text-gray-800">
                Full Description
              </label>
              <textarea
                v-model="selectedService.fullDescription"
                placeholder="Detailed explanation of the service..."
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            <!-- Price Range -->
            <div>
              <label class="block mb-1 font-medium text-gray-800">
                Price Range (Ksh)
              </label>
              <input
                v-model="selectedService.priceRange"
                type="text"
                required
                placeholder="e.g., 5000–15000"
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <!-- Featured -->
            <div class="flex items-center gap-2">
              <input
                v-model="selectedService.featured"
                type="checkbox"
                id="featured"
                class="h-4 w-4"
              />
              <label for="featured" class="font-medium text-gray-800">
                Featured
              </label>
            </div>

            <button
              type="submit"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
            >
              {{ selectedService._id ? 'Update Service' : 'Add Service' }}
            </button>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api.js';

const services = ref([]);
const isServiceModalVisible = ref(false);
const selectedService = ref({});

// Full predefined research categories
const categories = ref([
  'Journal Paper',
  'Research Proposal',
  'Dissertation',
  'Thesis',
  'Patent Filing',
  'Grant Proposal',
  'Data Analysis',
  'Literature Review',
  'Case Study',
  'Conference Paper',
  'Book Chapter',
  'Systematic Review',
  'Experimental Design',
  'Survey Research',
  'Technical Report',
  'Policy Brief',
  'Market Research',
  'Feasibility Study',
  'Other',
]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() =>
  Math.ceil(services.value.length / itemsPerPage)
);

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return services.value.slice(start, start + itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

// Fetch services
const fetchServices = async () => {
  try {
    const { data } = await api.get('/services');
    services.value = data;
    if (currentPage.value > totalPages.value)
      currentPage.value = totalPages.value;
  } catch (err) {
    console.error('Error fetching services:', err);
  }
};

const openServiceModal = (service = null) => {
  if (service) selectedService.value = { ...service };
  else selectedService.value = {};
  isServiceModalVisible.value = true;
};

const closeServiceModal = () => {
  selectedService.value = {};
  isServiceModalVisible.value = false;
};

const submitService = async () => {
  try {
    if (selectedService.value._id)
      await api.put(
        `/services/${selectedService.value._id}`,
        selectedService.value
      );
    else await api.post('/services', selectedService.value);

    closeServiceModal();
    fetchServices();
  } catch (err) {
    console.error('Error submitting service:', err);
    alert(err.response?.data?.message || 'An error occurred');
  }
};

const deleteService = async (id) => {
  if (!confirm('Are you sure you want to delete this service?')) return;
  try {
    await api.delete(`/services/${id}`);
    fetchServices();
  } catch (err) {
    console.error('Error deleting service:', err);
    alert('Could not delete service');
  }
};

onMounted(() => fetchServices());
</script>

<style scoped>
/* Fade modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
