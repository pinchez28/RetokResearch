<template>
  <section
    id="services"
    class="py-24 px-6 md:px-12 lg:px-20 bg-blue-900 text-white"
  >
    <h2 class="text-5xl font-extrabold text-center mb-12">
      Our Core Research Services
    </h2>

    <!-- Quick Request CTA -->
    <div class="flex justify-center mb-12">
      <button
        @click="openRequestModal(null)"
        class="w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold bg-[#ff8040] text-[#333] shadow-xl hover:bg-[#ffa366] transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ffb38a]"
      >
        Quickly Get Help with Research
      </button>
    </div>

    <!-- Branch Tabs -->
    <div class="flex justify-center gap-4 mb-12">
      <button
        v-for="branch in branches"
        :key="branch._id"
        @click="activeBranch = branch._id"
        :class="[
          'w-full sm:w-auto text-center px-6 sm:px-8 py-3 rounded-xl text-lg font-bold transform transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          activeBranch === branch._id
            ? 'active-branch'
            : 'bg-blue-700 text-white shadow-xl hover:bg-blue-600 hover:-translate-y-1',
        ]"
      >
        {{ branch.name }}
      </button>
    </div>

    <!-- Categories & Service Cards -->
    <div v-if="currentBranch">
      <div
        v-for="category in currentBranch.categories"
        :key="category._id"
        class="mb-12"
      >
        <!-- Category Header -->
        <h3
          class="text-2xl font-bold text-white mb-6 border-l-4 border-green-400 pl-4 tracking-wide"
        >
          {{ category.name }}
        </h3>

        <!-- Service Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            v-for="service in category.services"
            :key="service._id"
            :service="service"
            @click="openServiceModal(service)"
          />
        </div>
      </div>
    </div>

    <!-- Service Detail Modal -->
    <ServiceDetailModal
      :visible="isServiceModalVisible"
      :service="selectedService"
      @close="closeServiceModal"
      @request="openRequestModal"
    />

    <!-- Guest Submission Modal -->
    <GuestSubmissionModal
      :visible="isRequestModalVisible"
      :service="requestService"
      @close="closeRequestModal"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import ServiceCard from '@/components/ui/ServiceCard.vue';
import ServiceDetailModal from '@/components/ServiceDetailModal.vue';
import GuestSubmissionModal from '@/components/GuestSubmissionModal.vue';
import api from '@/utils/api.js';

const userStore = useUserStore();
const router = useRouter();

const branches = ref([]);
const activeBranch = ref(null);
const currentBranch = computed(() =>
  branches.value.find((b) => b._id === activeBranch.value)
);

// Fetch services and group by branch/category
const fetchBranches = async () => {
  try {
    const { data } = await api.get('/services'); // flat array
    const branchMap = {};
    data.forEach((svc) => {
      if (!branchMap[svc.branch]) {
        branchMap[svc.branch] = {
          _id: svc.branch,
          name: svc.branch,
          categories: {},
        };
      }
      if (!branchMap[svc.branch].categories[svc.category]) {
        branchMap[svc.branch].categories[svc.category] = {
          _id: svc.category,
          name: svc.category,
          services: [],
        };
      }
      branchMap[svc.branch].categories[svc.category].services.push(svc);
    });
    branches.value = Object.values(branchMap).map((b) => ({
      ...b,
      categories: Object.values(b.categories),
    }));
    activeBranch.value = branches.value.length ? branches.value[0]._id : null;
  } catch (err) {
    console.error('Failed to fetch services', err);
  }
};

onMounted(fetchBranches);

// Service Detail Modal state
const isServiceModalVisible = ref(false);
const selectedService = ref(null);

const openServiceModal = (service) => {
  selectedService.value = service;
  isServiceModalVisible.value = true;
};

const closeServiceModal = () => {
  selectedService.value = null;
  isServiceModalVisible.value = false;
};

// GuestSubmissionModal state
const isRequestModalVisible = ref(false);
const requestService = ref(null);

const openRequestModal = (service = null) => {
  requestService.value = service;
  isRequestModalVisible.value = true;
};

const closeRequestModal = () => {
  requestService.value = null;
  isRequestModalVisible.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Active branch style */
.active-branch {
  background: linear-gradient(90deg, #facc15, #ec4899, #8b5cf6);
  color: white;
  box-shadow: 0 8px 20px rgba(255, 200, 50, 0.7),
    0 4px 10px rgba(255, 200, 50, 0.4);
  transform: scale(1.1);
  animation: pulse-glow 1.5s infinite alternate;
  border: 2px solid #fff;
}

/* Pulse & glow animation */
@keyframes pulse-glow {
  0% {
    box-shadow: 0 8px 20px rgba(255, 200, 50, 0.7),
      0 4px 10px rgba(255, 200, 50, 0.4);
  }
  50% {
    box-shadow: 0 12px 28px rgba(255, 255, 100, 0.9),
      0 6px 12px rgba(255, 255, 100, 0.5);
  }
  100% {
    box-shadow: 0 8px 20px rgba(255, 200, 50, 0.7),
      0 4px 10px rgba(255, 200, 50, 0.4);
  }
}
</style>
