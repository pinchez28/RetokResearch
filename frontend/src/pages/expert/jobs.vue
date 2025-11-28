<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold" style="color: #001bb7">Available Jobs</h1>

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
        <h2 class="text-xl font-semibold mb-2" style="color: #001bb7">
          {{ job.title }}
        </h2>
        <p class="text-gray-600 mb-2">
          {{ job.description?.substring(0, 120) }}...
        </p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Budget: ${{ job.budget }}</span>
          <span
            >Deadline: {{ new Date(job.deadline).toLocaleDateString() }}</span
          >
        </div>
        <button
          class="mt-4 w-full bg-[#FF8040] text-white py-2 rounded-xl hover:bg-[#0046FF]"
          @click="viewJob(job._id)"
        >
          View / Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const availableJobs = ref([]);
const filters = ref({ keyword: '', category: '', experience: '' });
const categories = ref([]);

// Fetch jobs from server
const fetchJobs = async () => {
  try {
    const res = await axios.get('/api/expert/jobs'); // your backend endpoint
    if (Array.isArray(res.data.jobs)) {
      availableJobs.value = res.data.jobs;
      // Extract unique categories
      categories.value = [...new Set(res.data.jobs.map((j) => j.category))];
    }
  } catch (err) {
    console.error('Error fetching jobs:', err);
  }
};

onMounted(fetchJobs);

// Filtered jobs
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

const viewJob = (id) => {
  console.log('View / Apply for job:', id);
  // Navigate or open modal
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
