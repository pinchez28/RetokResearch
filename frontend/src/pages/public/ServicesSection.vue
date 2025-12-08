<template>
  <section
    id="services"
    class="py-24 px-6 md:px-12 lg:px-20 bg-blue-900 text-white"
  >
    <!-- Heading (matches How It Works typography) -->
    <h2
      class="animate-fadeUp font-extrabold text-white drop-shadow-lg mb-6 text-center"
      style="font-size: clamp(2rem, 5vw, 4rem)"
    >
      Sample Research Services
    </h2>

    ```
    <p
      class="mt-2 sm:mt-4 text-white animate-fadeUp delay-150 drop-shadow-md mx-auto text-center"
      style="font-size: clamp(1rem, 2.5vw, 1.5rem); max-width: 40rem"
    >
      Explore a variety of high-quality academic and professional research
      services.
    </p>

    <!-- Quick Request CTA -->
    <div class="flex justify-center my-8">
      <button
        @click="openRequestModal(null)"
        class="bg-[#FF8040] hover:bg-[#2aac10] hover:text-white text-gray-900 font-extrabold uppercase py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 animate-bounce text-lg"
      >
        Quickly Get Help with Research
      </button>
    </div>

    <!-- Filters Row (Search + Category) -->
    <div
      class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <!-- Search -->
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

      <!-- Category Dropdown -->
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
            : 'bg-blue-700 text-white shadow-xl hover:bg-blue-600 hover:-translate-y-1 animate-pulse',
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
            : 'bg-blue-700 text-white shadow-xl hover:bg-blue-600 hover:-translate-y-1 animate-spin',
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
    ```
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import ServiceCard from '@/components/ui/ServiceCard.vue';
import GuestServiceDetailsModal from '@/components/GuestServiceDetailsModal.vue';
import GuestSubmissionModal from '@/components/GuestSubmissionModal.vue';
import api from '@/utils/api.js';

// State
const allServices = ref([]);
const activeBranch = ref('all');
const selectedCategory = ref('all');
const searchQuery = ref('');

// Fetch services
onMounted(async () => {
  const { data } = await api.get('/services');
  allServices.value = Array.isArray(data) ? data : [];
});

// Branch tabs
const branchList = computed(() => {
  const set = new Set();
  allServices.value.forEach((s) => s.branch && set.add(s.branch));
  return Array.from(set);
});

// Filtered flat list
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

// Available categories
const availableCategories = computed(() => {
  const set = new Set();
  filteredFlat.value.forEach((s) => s.category && set.add(s.category));
  return Array.from(set);
});

// Group by branch -> category -> services
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

// Modal states
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

/* Animations */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeUp {
  animation: fadeUp 1s ease-out forwards;
}
.delay-150 {
  animation-delay: 0.15s;
}
</style>
