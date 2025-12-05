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

      <!-- Available Jobs -->
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
          <h2 class="font-semibold text-lg">Available Jobs</h2>
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

    <!-- My Assignments Table -->
    <div class="bg-white p-6 rounded-3xl shadow-2xl overflow-x-auto">
      <h2 class="text-3xl font-bold text-[#001BB7] mb-4">My Assignments</h2>
      <table class="w-full table-auto border-collapse text-left">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">Title</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Deadline</th>
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
            <td class="px-4 py-2">{{ assignment.client?.name || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Available Jobs List -->
    <div class="space-y-6">
      <h2 class="text-3xl font-bold text-[#001BB7]">Available Jobs</h2>

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

      <!-- Jobs as List -->
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <ul>
          <li
            v-for="job in filteredJobs"
            :key="job._id"
            class="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b hover:bg-gray-50 transition"
          >
            <div class="flex-1 mb-2 md:mb-0">
              <h3 class="text-lg font-semibold text-[#001BB7]">
                {{ job.title }}
              </h3>
              <p class="text-gray-600 text-sm">
                {{ job.description?.substring(0, 100) }}...
              </p>
              <p class="text-gray-500 text-sm mt-1">
                Budget: KSh {{ job.pricingRange.min }} - KSh
                {{ job.pricingRange.max }} | Deadline:
                {{ formatDate(job.deadline) }} | Experience:
                {{ job.experience }}
              </p>
            </div>
            <button
              class="mt-2 md:mt-0 bg-[#FF8040] text-white px-4 py-2 rounded-xl hover:bg-[#0046FF]"
              @click="goToJob(job._id)"
            >
              View / Apply
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Proposal Modal (kept, but not used from dashboard) -->
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
          <strong>Budget:</strong> KSh {{ selectedJob.pricingRange.min }} - KSh
          {{ selectedJob.pricingRange.max }}
        </p>
        <p class="mb-3">
          <strong>Deadline:</strong> {{ formatDate(selectedJob.deadline) }}
        </p>
        <p class="mb-3">
          <strong>Experience:</strong> {{ selectedJob.experience }}
        </p>

        <textarea
          v-model="proposalText"
          placeholder="Enter your full proposal here..."
          class="w-full border rounded p-2 mb-4"
          rows="6"
        ></textarea>
        <input
          type="number"
          v-model.number="proposalQuote"
          placeholder="Enter your quote"
          class="w-full border rounded p-2 mb-4"
        />

        <button
          class="mt-4 w-full bg-[#FF8040] text-white py-2 rounded-xl hover:bg-[#0046FF]"
          @click="submitProposal(selectedJob._id)"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api.js';
import { useRouter } from 'vue-router';

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
const assignments = ref([]);
const availableJobs = ref([]);
const earnings = ref(0);
const selectedJob = ref(null);
const proposalText = ref('');
const proposalQuote = ref(0);
const filters = ref({ keyword: '', category: '', experience: '' });
const categories = ref([]);

const router = useRouter();

const goToJob = (jobId) => {
  router.push({ name: 'ExpertJobs', query: { jobId } });
};

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : '-';

const fetchDashboard = async () => {
  try {
    const jobsRes = await api.get('/expert/jobs');
    availableJobs.value = jobsRes.data.jobs || [];

    categories.value = [
      ...new Set(availableJobs.value.map((j) => j.category).filter(Boolean)),
    ];
  } catch (err) {
    console.error('Dashboard fetch error:', err.response?.data || err.message);
    availableJobs.value = [];
  }
};

onMounted(fetchDashboard);

const filteredJobs = computed(() =>
  availableJobs.value.filter((job) => {
    const matchesKeyword = job.title
      .toLowerCase()
      .includes(filters.value.keyword.toLowerCase());
    const matchesCategory = filters.value.category
      ? job.category === filters.value.category
      : true;
    const matchesExperience = filters.value.experience
      ? job.experience === filters.value.experience
      : true;
    return matchesKeyword && matchesCategory && matchesExperience;
  })
);

const openProposalModal = (job) => {
  selectedJob.value = job;
  proposalText.value = '';
  proposalQuote.value = 0;
};
const closeProposalModal = () => {
  selectedJob.value = null;
  proposalText.value = '';
  proposalQuote.value = 0;
};

const submitProposal = async (jobId) => {
  if (!proposalText.value.trim()) return alert('Please enter a proposal.');
  try {
    await api.post(`/expert/jobs/${jobId}/apply`, {
      coverLetter: proposalText.value,
      quote: proposalQuote.value || 0,
    });
    alert('Proposal submitted successfully!');
    closeProposalModal();
  } catch (err) {
    console.error(
      'Error submitting proposal:',
      err.response?.data || err.message
    );
    alert('Failed to submit proposal.');
  }
};
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
</style>
