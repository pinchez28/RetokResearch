<template>
  <div class="p-6 md:p-10 space-y-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-extrabold text-[#001BB7]">Available Jobs</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
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

    <!-- JOB CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="job in filteredJobs"
        :key="job._id"
        class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
      >
        <h2 class="text-xl font-bold text-[#001BB7] mb-2">
          {{ job.title }}
        </h2>

        <p class="text-gray-600 text-sm mb-4">
          {{ job.description?.substring(0, 160) }}...
        </p>

        <div class="space-y-2 text-sm text-gray-500 mb-4">
          <p>
            <strong>Budget:</strong> KSh {{ job.pricingRange.min }} -
            {{ job.pricingRange.max }}
          </p>
          <p><strong>Deadline:</strong> {{ formatDate(job.deadline) }}</p>
          <p><strong>Experience:</strong> {{ job.experience || 'Any' }}</p>
        </div>

        <div class="flex justify-between mt-4">
          <button
            class="px-4 py-2 bg-[#001BB7] text-white rounded-xl hover:bg-blue-700"
            @click="viewJob(job)"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/api.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const availableJobs = ref([]);
const categories = ref([]);

const filters = ref({
  keyword: '',
  category: '',
  experience: '',
});

// Fetch jobs
const fetchJobs = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get('/expert/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    });

    availableJobs.value = res.data.jobs.map((job) => ({
      ...job,
      hasApplied: job.hasApplied || false,
    }));

    categories.value = [
      ...new Set(res.data.jobs.map((j) => j.category).filter(Boolean)),
    ];
  } catch (err) {
    console.error('Jobs error:', err);
  }
};

onMounted(fetchJobs);

// Filtered jobs
const filteredJobs = computed(() => {
  return availableJobs.value.filter((j) => {
    const matchKeyword = j.title
      .toLowerCase()
      .includes(filters.value.keyword.toLowerCase());
    const matchCategory = filters.value.category
      ? j.category === filters.value.category
      : true;
    const matchExp = filters.value.experience
      ? j.experience === filters.value.experience
      : true;

    return matchKeyword && matchCategory && matchExp;
  });
});

// Format date
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

// Navigate to job details
const viewJob = (job) => {
  router.push(`/expert/jobs/${job._id}`);
};
</script>

<style scoped>
.input {
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
}
.input:focus {
  border-color: #001bb7;
  box-shadow: 0 0 0 2px rgba(0, 27, 183, 0.25);
}
</style>
