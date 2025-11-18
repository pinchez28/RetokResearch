<template>
  <section
    id="services"
    class="relative py-20 px-6 md:px-12 lg:px-20 bg-gray-50"
  >
    <!-- Floating CTA Button -->
    <div class="flex justify-end mb-8">
      <button
        @click="openAssignmentModal"
        class="bg-[#ff8040] hover:bg-green-500 text-gray-900 font-extrabold text-lg sm:text-xl md:text-2xl py-2 sm:py-3 px-4 sm:px-6 rounded-3xl shadow-2xl transition-all duration-300"
      >
        Quickly Post A Research Assignment
      </button>
    </div>

    <h2
      class="text-4xl font-extrabold mb-12 text-center text-gray-800 animate-fadeUp"
    >
      Our Core Research Services
    </h2>

    <!-- Branch buttons -->
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
      <button
        v-for="branch in branches"
        :key="branch._id"
        @click="activeBranch = branch._id"
        :class="[
          'px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300',
          activeBranch === branch._id
            ? 'bg-blue-900 text-white shadow-xl'
            : 'bg-white text-gray-800 hover:bg-blue-100',
        ]"
      >
        {{ branch.name }}
      </button>
    </div>

    <!-- Categories & Services -->
    <transition name="fade-slide" mode="out-in">
      <div
        v-if="currentBranch"
        :key="currentBranch._id"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        <div
          v-for="category in currentBranch.categories"
          :key="category._id"
          class="bg-white p-6 rounded-2xl shadow-lg flex flex-col border border-gray-200 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        >
          <!-- Category Title -->
          <h3
            class="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-700 pl-3"
          >
            {{ category.name }}
          </h3>

          <!-- Services Grid inside category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <ServiceCard
              v-for="service in category.services"
              :key="service._id"
              :service="service"
              @click="openServiceModal(service)"
              class="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Service Modal -->
    <transition name="fade">
      <div
        v-if="isServiceModalVisible"
        @click.self="closeServiceModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative overflow-y-auto"
          style="max-height: 90vh"
        >
          <button
            @click="closeServiceModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            &times;
          </button>

          <h2
            class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-wide"
          >
            {{ selectedService.title }}
          </h2>

          <p class="text-lg text-gray-600 mb-4 leading-relaxed tracking-wide">
            {{
              selectedService.fullDescription ||
              selectedService.shortDescription
            }}
          </p>

          <div v-if="selectedService.features?.length" class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2 text-lg">Features:</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li v-for="(item, idx) in selectedService.features" :key="idx">
                {{ item }}
              </li>
            </ul>
          </div>

          <div v-if="selectedService.prerequisites?.length" class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2 text-lg">
              Prerequisites:
            </h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li
                v-for="(item, idx) in selectedService.prerequisites"
                :key="idx"
              >
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="flex flex-wrap gap-6 text-gray-700 mb-6">
            <p v-if="selectedService.duration">
              <strong>Duration:</strong> {{ selectedService.duration }}
            </p>
            <p v-if="selectedService.price">
              <strong>Price:</strong> {{ selectedService.price }}
            </p>
          </div>

          <div class="text-center">
            <button
              @click="handleServiceRequest(selectedService)"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Request This Service
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Assignment Modal -->
    <transition name="fade">
      <div
        v-if="isAssignmentModalVisible"
        @click.self="closeAssignmentModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative overflow-y-auto"
          style="max-height: 90vh"
        >
          <button
            @click="closeAssignmentModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            &times;
          </button>

          <h2 class="text-3xl font-bold mb-4 text-gray-800">
            Submit Your Assignment
          </h2>

          <p class="text-gray-600 mb-2 font-medium">Fill in all details</p>

          <p
            class="mb-6 text-red-600 font-extrabold text-lg border-l-4 border-red-600 pl-3"
          >
            ⚠️ To receive live updates on your assignment status, you must sign
            up.
          </p>

          <form @submit.prevent="submitAssignment" class="space-y-4">
            <label class="font-bold text-lg text-gray-800 block"
              >Research Topic</label
            >
            <input
              v-model="assignmentForm.topic"
              type="text"
              placeholder="Research Topic"
              class="w-full border border-gray-300 rounded-xl p-3"
              required
            />

            <label class="font-bold text-lg text-gray-800 block"
              >Full Description</label
            >
            <textarea
              v-model="assignmentForm.description"
              placeholder="Full Description"
              class="w-full border border-gray-300 rounded-xl p-3"
              required
            ></textarea>

            <label class="font-bold text-lg text-gray-800 block"
              >Timeline / Deadline</label
            >
            <input
              v-model="assignmentForm.timeline"
              type="text"
              placeholder="Timeline / Deadline"
              class="w-full border border-gray-300 rounded-xl p-3"
            />

            <label class="font-bold text-lg text-gray-800 block"
              >Your Email</label
            >
            <input
              v-model="assignmentForm.email"
              type="email"
              placeholder="Your Email"
              class="w-full border border-gray-300 rounded-xl p-3"
              required
            />

            <label class="font-bold text-lg text-gray-800 block"
              >Phone Number</label
            >
            <input
              v-model="assignmentForm.phone"
              type="text"
              placeholder="Phone Number"
              class="w-full border border-gray-300 rounded-xl p-3"
            />

            <label class="font-bold text-lg text-gray-800 block"
              >Upload Supporting Document</label
            >
            <input
              @change="assignmentForm.file = $event.target.files[0]"
              type="file"
              class="w-full"
            />

            <button
              type="submit"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Submit Assignment
            </button>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import ServiceCard from '@/components/ui/ServiceCard.vue';

/* Sample branches */
const branches = ref([
  {
    _id: 'academic',
    name: 'Academic Research',
    categories: [
      {
        _id: 'writing-1',
        name: 'Research Writing',
        services: [
          {
            _id: 'svc-1',
            title: 'Proposal Writing',
            shortDescription: 'High-quality proposals',
            fullDescription:
              'Comprehensive guidance from topic selection to final submission.',
            features: [
              'Step-by-step guidance',
              'Expert review',
              'Draft revision',
            ],
            prerequisites: ['Research topic', 'Institution guidelines'],
            duration: '2–4 weeks',
            price: '$150',
            icon: 'FileSearch',
          },
          {
            _id: 'svc-2',
            title: 'Thesis Support',
            shortDescription: 'Chapter guidance',
            fullDescription:
              'Full thesis supervision and consultation to meet academic standards.',
            features: ['Mentorship', 'Draft review', 'Formatting assistance'],
            prerequisites: ['Approved topic', 'Previous research work'],
            duration: '1–6 months',
            price: '$400',
            icon: 'GraduationCap',
          },
        ],
      },
      {
        _id: 'data-1',
        name: 'Data Analysis',
        services: [
          {
            _id: 'svc-3',
            title: 'SPSS Analysis',
            shortDescription: 'Statistical tests',
            fullDescription:
              'Professional data analysis including cleaning, coding, and reporting.',
            features: ['SPSS coding', 'Interpretation', 'Graphs & tables'],
            prerequisites: ['Raw data files', 'Variables list'],
            duration: '1–2 weeks',
            price: '$120',
            icon: 'BarChart3',
          },
        ],
      },
    ],
  },
  {
    _id: 'industrial',
    name: 'Industrial & Corporate Research',
    categories: [
      {
        _id: 'market-1',
        name: 'Market & Business Research',
        services: [
          {
            _id: 'svc-4',
            title: 'Market Analysis',
            shortDescription: 'Insights & trends',
            fullDescription:
              'In-depth market research and competitor analysis for strategic decisions.',
            features: [
              'Competitor research',
              'Customer surveys',
              'Trend evaluation',
            ],
            prerequisites: ['Business sector', 'Target market details'],
            duration: '2–3 weeks',
            price: '$200',
            icon: 'BarChart3',
          },
        ],
      },
      {
        _id: 'innovation-1',
        name: 'Product & Innovation Research',
        services: [
          {
            _id: 'svc-5',
            title: 'Product Research',
            shortDescription: 'Testing & validation',
            fullDescription:
              'Analyze product usability, user behavior, and market fit.',
            features: [
              'User testing',
              'Prototype evaluation',
              'Data-driven recommendations',
            ],
            prerequisites: ['Prototype', 'Target audience data'],
            duration: '3–5 weeks',
            price: '$300',
            icon: 'Lightbulb',
          },
        ],
      },
    ],
  },
]);

const activeBranch = ref(branches.value.length ? branches.value[0]._id : null);
const currentBranch = computed(() =>
  branches.value.find((b) => b._id === activeBranch.value)
);

/* Service Modal */
const isServiceModalVisible = ref(false);
const selectedService = ref({});
const openServiceModal = (service) => {
  selectedService.value = service;
  isServiceModalVisible.value = true;
};
const closeServiceModal = () => {
  selectedService.value = {};
  isServiceModalVisible.value = false;
};
const handleServiceRequest = (service) => {
  console.log('Requesting service:', service.title);
};

/* Assignment Modal */
const isAssignmentModalVisible = ref(false);
const assignmentForm = ref({
  topic: '',
  description: '',
  timeline: '',
  email: '',
  phone: '',
  file: null,
});
const openAssignmentModal = () => {
  isAssignmentModalVisible.value = true;
};
const closeAssignmentModal = () => {
  assignmentForm.value = {
    topic: '',
    description: '',
    timeline: '',
    email: '',
    phone: '',
    file: null,
  };
  isAssignmentModalVisible.value = false;
};
const submitAssignment = () => {
  console.log('Assignment submitted:', assignmentForm.value);
  closeAssignmentModal();
};
</script>
