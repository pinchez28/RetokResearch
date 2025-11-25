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
        :key="job.id"
        class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
      >
        <h2 class="text-xl font-semibold mb-2" style="color: #001bb7">
          {{ job.title }}
        </h2>
        <p class="text-gray-600 mb-2">
          {{ job.description.substring(0, 120) }}...
        </p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Budget: ${{ job.budget }}</span>
          <span>Deadline: {{ job.deadline }}</span>
        </div>
        <button
          class="mt-4 w-full bg-[#FF8040] text-white py-2 rounded-xl hover:bg-[#0046FF]"
          @click="viewJob(job.id)"
        >
          View / Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const jobs = ref([
  {
    id: 1,
    title: 'AI Research',
    description: 'Build a model...',
    budget: 500,
    deadline: '2025-12-01',
    category: 'AI',
    experience: 'Expert',
  },
  {
    id: 2,
    title: 'Data Analysis',
    description: 'Analyze survey...',
    budget: 200,
    deadline: '2025-11-28',
    category: 'Data Science',
    experience: 'Intermediate',
  },
]);

const filters = ref({ keyword: '', category: '', experience: '' });
const categories = [
  'AI',
  'Data Science',
  'Machine Learning',
  'Writing',
  'Research',
];

const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
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
  });
});

const viewJob = (id) => alert(`View details for job ID: ${id}`);
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
