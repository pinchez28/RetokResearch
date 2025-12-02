<template>
  <div class="p-6 md:p-10 space-y-8 bg-gray-100 min-h-screen">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center">
      <h1 class="text-3xl md:text-4xl font-bold text-[#001BB7]">
        Welcome, {{ user.name || 'Expert' }}
      </h1>
      <p class="mt-2 md:mt-0 text-gray-600">
        Here’s a summary of your current activity
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Assignments -->
      <div
        class="p-6 rounded-2xl flex items-center space-x-4 shadow-lg hover:shadow-2xl transition"
        style="
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
        "
      >
        <div class="p-4 bg-white text-[#6a11cb] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-lg">Total Assignments</h2>
          <p class="mt-1 text-2xl font-bold">{{ assignments.length }}</p>
        </div>
      </div>

      <!-- Active Jobs -->
      <div
        class="p-6 rounded-2xl flex items-center space-x-4 shadow-lg hover:shadow-2xl transition"
        style="
          background: linear-gradient(to right, #ff512f, #dd2476);
          color: white;
        "
      >
        <div class="p-4 bg-white text-[#ff512f] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-lg">Active Jobs</h2>
          <p class="mt-1 text-2xl font-bold">{{ availableJobs.length }}</p>
        </div>
      </div>

      <!-- Earnings -->
      <div
        class="p-6 rounded-2xl flex items-center space-x-4 shadow-lg hover:shadow-2xl transition"
        style="
          background: linear-gradient(to right, #11998e, #38ef7d);
          color: white;
        "
      >
        <div class="p-4 bg-white text-[#11998e] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 2v2m0 16v2m8-8h-2M4 12H2"
            />
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-lg">Earnings</h2>
          <p class="mt-1 text-2xl font-bold">${{ earnings }}</p>
        </div>
      </div>
    </div>

    <!-- Assignments Table -->
    <div class="bg-white p-6 rounded-3xl shadow-2xl overflow-x-auto">
      <h2 class="text-3xl font-bold text-[#001bb7] mb-4">My Assignments</h2>
      <table class="w-full table-auto border-collapse text-left">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">Title</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Due Date</th>
            <th class="px-4 py-2">Client</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(assignment, idx) in assignments"
            :key="idx"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2">{{ assignment.title }}</td>
            <td class="px-4 py-2">{{ assignment.status }}</td>
            <td class="px-4 py-2">{{ formatDate(assignment.dueDate) }}</td>
            <td class="px-4 py-2">{{ assignment.client }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Available Jobs Section -->
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-[#001bb7]">Available Jobs</h1>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <input
          v-model="filters.keyword"
          placeholder="Search jobs..."
          class="input"
        />
        <select v-model="filters.category" class="input">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
        <select v-model="filters.experience" class="input">
          <option value="">All Experience</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>
      </div>

      <!-- Job Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="job in filteredJobs"
          :key="job._id"
          class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
        >
          <h2 class="text-xl font-semibold mb-2 text-[#001bb7]">
            {{ job.title }}
          </h2>
          <p class="text-gray-600 mb-2">
            {{ job.description?.substring(0, 120) }}...
          </p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span
              >Budget: KSh {{ job.pricingRange?.min }} - KSh
              {{ job.pricingRange?.max }}</span
            >
            <span>Deadline: {{ formatDate(job.deadline) }}</span>
          </div>
          <button
            class="mt-4 w-full bg-[#FF8040] text-white py-2 rounded-xl hover:bg-[#0046FF]"
            @click="openProposalModal(job)"
          >
            View / Apply
          </button>
        </div>
      </div>
    </div>

    <!-- Proposal Modal -->
    <div
      v-if="selectedJob"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-auto z-50"
    >
      <div
        class="bg-white mt-20 max-w-2xl w-full p-6 rounded-lg shadow-lg text-left"
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">{{ selectedJob.title }}</h2>
          <button
            @click="closeProposalModal"
            class="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>
        <p class="mb-3">
          <strong>Description:</strong> {{ selectedJob.description }}
        </p>
        <p class="mb-3">
          <strong>Budget:</strong> KSh {{ selectedJob.pricingRange?.min }} - KSh
          {{ selectedJob.pricingRange?.max }}
        </p>
        <p class="mb-3">
          <strong>Deadline:</strong> {{ formatDate(selectedJob.deadline) }}
        </p>

        <textarea
          v-model="proposalText"
          placeholder="Enter your full proposal here..."
          class="w-full border rounded p-2 mb-4"
          rows="6"
        ></textarea>
        <button
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 transition"
          @click="submitProposal(selectedJob._id)"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
const assignments = ref([]);
const earnings = ref(0);
const availableJobs = ref([]);
const filters = ref({ keyword: '', category: '', experience: '' });
const categories = ref([]);
const selectedJob = ref(null);
const proposalText = ref('');

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Fetch assignments, earnings, and jobs
const fetchData = async () => {
  try {
    const [assignRes, earnRes, jobsRes] = await Promise.all([
      axios.get('/api/expert/assignments'),
      axios.get('/api/expert/earnings'),
      axios.get('/api/expert/jobs'),
    ]);

    assignments.value = Array.isArray(assignRes.data.assignments)
      ? assignRes.data.assignments
      : [];
    earnings.value = earnRes.data.total || 0;
    availableJobs.value = Array.isArray(jobsRes.data.jobs)
      ? jobsRes.data.jobs
      : [];

    // Extract categories dynamically
    categories.value = [
      ...new Set(availableJobs.value.map((j) => j.category).filter(Boolean)),
    ];
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    assignments.value = [];
    earnings.value = 0;
    availableJobs.value = [];
  }
};

// Computed filtered jobs
const filteredJobs = computed(() => {
  return availableJobs.value.filter((job) => {
    const matchesKeyword = job.title
      ?.toLowerCase()
      .includes(filters.value.keyword.toLowerCase());
    const matchesCategory = filters.value.category
      ? job.category === filters.value.category
      : true;
    const matchesExperience = filters.value.experience
      ? job.experience === filters.value.experience
      : true;
    return matchesKeyword && matchesCategory && matchesExperience;
  });
});

// Proposal modal
const openProposalModal = (job) => {
  selectedJob.value = job;
  proposalText.value = '';
};
const closeProposalModal = () => {
  selectedJob.value = null;
  proposalText.value = '';
};

// Submit proposal
const submitProposal = async (jobId) => {
  if (!proposalText.value.trim()) return alert('Please enter a proposal');
  try {
    await axios.post(`/api/expert/jobs/${jobId}/apply`, {
      coverLetter: proposalText.value,
      quote: 0, // Optional: add input for quote if needed
    });
    alert('Proposal submitted successfully!');
    closeProposalModal();
  } catch (err) {
    console.error(err);
    alert('Failed to submit proposal.');
  }
};

onMounted(fetchData);
</script>

<style scoped>
.input {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  outline: none;
}
.input:focus {
  border-color: #001bb7;
  box-shadow: 0 0 0 2px rgba(0, 27, 183, 0.2);
}
div.bg-white:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
</style>
