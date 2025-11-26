<template>
  <section
    id="services"
    class="py-24 px-6 md:px-12 lg:px-20 bg-blue-900 text-white"
  >
    <h2 class="text-5xl text-white font-extrabold text-center mb-12">
      Our Core Research Services
    </h2>

    <!-- Quick Request CTA -->
    <div class="flex justify-center mb-8">
      <button
        @click="openRequestModal(null)"
        class="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold bg-[#ff8040] text-[#333] shadow-xl hover:bg-[#ffa366] transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ffb38a]"
      >
        Quickly Get Help with Research
      </button>
    </div>

    <!-- Filters Row (ONLY SEARCH + CATEGORY) -->
    <div
      class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <!-- Search with Lucide Icon -->
      <div class="relative w-full md:w-96">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          :size="20"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search services..."
          class="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 shadow-md focus:ring-2 focus:ring-[#001BB7]"
        />
      </div>

      <!-- Category Dropdown Only -->
      <select
        v-model="selectedCategory"
        class="px-4 py-3 rounded-xl text-gray-900 shadow-md focus:ring-2 focus:ring-[#001BB7]"
      >
        <option value="all">All Categories</option>
        <option v-for="cat in availableCategories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <!-- Branch Tabs -->
    <div class="flex justify-center gap-4 mb-12 flex-wrap">
      <button
        :class="[
          'w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold transform transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          activeBranch === 'all'
            ? 'active-branch'
            : 'bg-blue-700 text-white shadow-xl hover:bg-blue-600 hover:-translate-y-1',
        ]"
        @click="setActiveBranch('all')"
      >
        All
      </button>

      <button
        v-for="branch in branchList"
        :key="branch"
        @click="setActiveBranch(branch)"
        :class="[
          'w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold transform transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          activeBranch === branch
            ? 'active-branch'
            : 'bg-blue-700 text-white shadow-xl hover:bg-blue-600 hover:-translate-y-1',
        ]"
      >
        {{ branch }}
      </button>
    </div>

    <!-- Categories & Service Cards -->
    <div v-if="branchesToDisplay.length">
      <div v-for="branch in branchesToDisplay" :key="branch._id" class="mb-12">
        <h3
          class="text-2xl font-bold text-white mb-6 border-l-4 border-green-400 pl-4 tracking-wide"
        >
          {{ branch.name }}
        </h3>

        <div
          v-for="category in branch.categories"
          :key="category._id"
          class="mb-12"
        >
          <!-- Only categories with services -->
          <h3
            v-if="category.services && category.services.length"
            class="text-2xl font-bold text-white mb-6 border-l-4 border-green-400 pl-4 tracking-wide"
          >
            {{ category.name }}
          </h3>

          <div
            v-if="category.services && category.services.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ServiceCard
              v-for="service in category.services"
              :key="service._id"
              :service="service"
              @click="openServiceModal(service)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-white/80 mt-12">
      No services match your filters.
    </div>

    <!-- Modals -->
    <GuestServiceDetailsModal
      :visible="isServiceModalVisible"
      :service="selectedService"
      @close="closeServiceModal"
      @request="openRequestModal"
    />

    <GuestSubmissionModal
      :visible="isRequestModalVisible"
      :service="requestService"
      @close="closeRequestModal"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import ServiceCard from '@/components/ui/ServiceCard.vue';
import GuestServiceDetailsModal from '@/components/GuestServiceDetailsModal.vue';
import GuestSubmissionModal from '@/components/GuestSubmissionModal.vue';
import api from '@/utils/api.js';

// state
const allServices = ref([]);
const activeBranch = ref('all');
const selectedCategory = ref('all');
const searchQuery = ref('');

// fetch services
onMounted(async () => {
  const { data } = await api.get('/services');
  allServices.value = Array.isArray(data) ? data : [];
});

// branches for tabs
const branchList = computed(() => {
  const set = new Set();
  allServices.value.forEach((s) => s.branch && set.add(s.branch));
  return Array.from(set);
});

// filtered flat
const filteredFlat = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  return allServices.value.filter((svc) => {
    if (activeBranch.value !== 'all' && svc.branch !== activeBranch.value)
      return false;
    if (
      selectedCategory.value !== 'all' &&
      svc.category !== selectedCategory.value
    )
      return false;
    if (q) {
      const text = `${svc.title} ${svc.shortDescription || ''}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });
});

// available categories based on filtered
const availableCategories = computed(() => {
  const set = new Set();
  filteredFlat.value.forEach((s) => s.category && set.add(s.category));
  return Array.from(set);
});

// group into branch->category->services
const branchesToDisplay = computed(() => {
  const map = {};
  filteredFlat.value.forEach((svc) => {
    const b = svc.branch || 'Other';
    const c = svc.category || 'General';
    if (!map[b]) map[b] = { _id: b, name: b, categories: {} };
    if (!map[b].categories[c])
      map[b].categories[c] = { _id: c, name: c, services: [] };
    map[b].categories[c].services.push(svc);
  });
  return Object.values(map).map((b) => ({
    ...b,
    categories: Object.values(b.categories),
  }));
});

// UI handlers
const setActiveBranch = (b) => {
  activeBranch.value = b;
  selectedCategory.value = 'all';
};

// modal states
const isServiceModalVisible = ref(false);
const selectedService = ref(null);
const isRequestModalVisible = ref(false);
const requestService = ref(null);

const openServiceModal = (s) => {
  selectedService.value = s;
  isServiceModalVisible.value = true;
};
const closeServiceModal = () => {
  isServiceModalVisible.value = false;
  selectedService.value = null;
};
const openRequestModal = (s = null) => {
  requestService.value = s;
  isRequestModalVisible.value = true;
};
const closeRequestModal = () => {
  isRequestModalVisible.value = false;
  requestService.value = null;
};
</script>

<style scoped>
.active-branch {
  background: linear-gradient(90deg, #facc15, #ec4899, #8b5cf6);
  color: white;
  transform: scale(1.1);
  border: 2px solid white;
}
</style>
