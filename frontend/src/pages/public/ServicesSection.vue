<template>
  <section
    id="services"
    class="relative py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white"
  >
    <!-- Section Title + CTA Button -->
    <h2
      class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 text-center text-white drop-shadow-lg animate-fadeUp"
    >
      Our Core Research Services
    </h2>

    <div class="flex justify-center mb-12">
      <button
        @click="openAssignmentModal"
        class="bg-gradient-to-r from-green-800 to-teal-500 text-white font-extrabold py-3 sm:py-4 px-6 sm:px-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300 w-full sm:w-auto text-center"
      >
        Quickly Get Help with Research
      </button>
    </div>

    <!-- Branch Buttons -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <button
        v-for="branch in branches"
        :key="branch._id"
        @click="activeBranch = branch._id"
        :class="[
          'px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 whitespace-nowrap',
          activeBranch === branch._id
            ? 'bg-white text-blue-900 shadow-xl'
            : 'bg-blue-700 text-white hover:bg-blue-600',
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
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        <div
          v-for="category in currentBranch.categories"
          :key="category._id"
          class="p-6 rounded-2xl shadow-xl flex flex-col border border-blue-700 bg-gradient-to-br from-blue-800 to-blue-900 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Category Title -->
          <h3
            class="text-xl sm:text-2xl font-semibold mb-4 border-l-4 border-green-400 pl-3 text-white drop-shadow-md"
          >
            {{ category.name }}
          </h3>

          <!-- Services Grid -->
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
            class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-wide"
          >
            {{ selectedService.title }}
          </h2>

          <p
            class="text-base sm:text-lg md:text-xl text-gray-600 mb-4 leading-relaxed tracking-wide"
          >
            {{ selectedService.fullDescription || selectedService.shortDescription }}
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
            <h4 class="font-semibold text-gray-800 mb-2 text-lg">Prerequisites:</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li v-for="(item, idx) in selectedService.prerequisites" :key="idx">
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

          <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
            Submit Your Assignment
          </h2>

          <form @submit.prevent="submitAssignment" class="space-y-4">
            <label class="font-bold text-lg text-gray-800 block">Research Topic</label>
            <input
              v-model="assignmentForm.topic"
              type="text"
              placeholder="Research Topic"
              class="w-full border border-gray-300 rounded-xl p-3"
              required
            />

            <label class="font-bold text-lg text-gray-800 block">Full Description</label>
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

            <label class="font-bold text-lg text-gray-800 block">Your Email</label>
            <input
              v-model="assignmentForm.email"
              type="email"
              placeholder="Your Email"
              class="w-full border border-gray-300 rounded-xl p-3"
              required
            />

            <label class="font-bold text-lg text-gray-800 block">Phone Number</label>
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
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 w-full sm:w-auto"
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
import { ref, computed } from "vue";
import ServiceCard from "@/components/ui/ServiceCard.vue";

// --- Branch Data ---
const branches = ref([
  {
    _id: "academic",
    name: "Academic Research",
    categories: [
      {
        _id: "writing-1",
        name: "Research Writing",
        services: [
          {
            _id: "svc-1",
            title: "Proposal Writing",
            shortDescription: "High-quality proposals",
            fullDescription:
              "Comprehensive guidance from topic selection to final submission.",
            features: ["Step-by-step guidance", "Expert review", "Draft revision"],
            prerequisites: ["Research topic", "Institution guidelines"],
            duration: "2–4 weeks",
            price: "$150",
          },
          {
            _id: "svc-2",
            title: "Thesis Support",
            shortDescription: "Chapter guidance",
            fullDescription:
              "Full thesis supervision and consultation to meet academic standards.",
            features: ["Mentorship", "Draft review", "Formatting assistance"],
            prerequisites: ["Approved topic", "Previous research work"],
            duration: "1–6 months",
            price: "$400",
          },
        ],
      },
      {
        _id: "data-1",
        name: "Data Analysis",
        services: [
          {
            _id: "svc-3",
            title: "SPSS Analysis",
            shortDescription: "Statistical tests",
            fullDescription:
              "Professional data analysis including cleaning, coding, and reporting.",
            features: ["SPSS coding", "Interpretation", "Graphs & tables"],
            prerequisites: ["Raw data files", "Variables list"],
            duration: "1–2 weeks",
            price: "$120",
          },
          {
            _id: "svc-9",
            title: "Survey Data Processing",
            shortDescription: "Clean and analyze surveys",
            fullDescription: "Transform survey responses into actionable insights.",
            features: ["Data cleaning", "Visualization", "Reporting"],
            prerequisites: ["Survey results"],
            duration: "1 week",
            price: "$100",
          },
        ],
      },
    ],
  },
  {
    _id: "industrial",
    name: "Industrial & Corporate Research",
    categories: [
      {
        _id: "market-1",
        name: "Market & Business Research",
        services: [
          {
            _id: "svc-4",
            title: "Market Analysis",
            shortDescription: "Insights & trends",
            fullDescription:
              "In-depth market research and competitor analysis for strategic decisions.",
            features: ["Competitor research", "Customer surveys", "Trend evaluation"],
            prerequisites: ["Business sector", "Target market details"],
            duration: "2–3 weeks",
            price: "$200",
          },
          {
            _id: "svc-10",
            title: "Customer Feedback Research",
            shortDescription: "Gather insights",
            fullDescription:
              "Analyze customer feedback to improve products and services.",
            features: ["Surveys", "Focus groups", "Analysis"],
            prerequisites: ["Customer database"],
            duration: "1–2 weeks",
            price: "$150",
          },
        ],
      },
      {
        _id: "innovation-1",
        name: "Product & Innovation Research",
        services: [
          {
            _id: "svc-5",
            title: "Product Research",
            shortDescription: "Testing & validation",
            fullDescription: "Analyze product usability, user behavior, and market fit.",
            features: [
              "User testing",
              "Prototype evaluation",
              "Data-driven recommendations",
            ],
            prerequisites: ["Prototype", "Target audience data"],
            duration: "3–5 weeks",
            price: "$300",
          },
          {
            _id: "svc-11",
            title: "Innovation Assessment",
            shortDescription: "Evaluate new ideas",
            fullDescription: "Assess feasibility and market potential of innovations.",
            features: ["Idea validation", "Market fit", "Risk analysis"],
            prerequisites: ["Concept documentation"],
            duration: "2–4 weeks",
            price: "$250",
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

// Service Modal
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
  console.log("Requesting service:", service.title);
};

// Assignment Modal
const isAssignmentModalVisible = ref(false);
const assignmentForm = ref({
  topic: "",
  description: "",
  timeline: "",
  email: "",
  phone: "",
  file: null,
});
const openAssignmentModal = () => {
  isAssignmentModalVisible.value = true;
};
const closeAssignmentModal = () => {
  assignmentForm.value = {
    topic: "",
    description: "",
    timeline: "",
    email: "",
    phone: "",
    file: null,
  };
  isAssignmentModalVisible.value = false;
};
const submitAssignment = () => {
  console.log("Assignment submitted:", assignmentForm.value);
  closeAssignmentModal();
};
</script>

<style scoped>
/* Fade-up animation */
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
  animation: fadeUp 0.8s cubic-bezier(0.22, 0.9, 0.35, 1) forwards;
}

/* Fade-slide transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
