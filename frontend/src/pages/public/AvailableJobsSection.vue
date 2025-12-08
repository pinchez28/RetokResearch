<template>
  <section
    id="approved-jobs"
    class="py-24 px-6 md:px-12 lg:px-20 bg-blue-800 text-white"
  >
    <h2
      class="animate-fadeUp font-extrabold text-white drop-shadow-lg mb-6 text-center"
      style="font-size: clamp(2rem, 5vw, 4rem)"
    >
      Available Jobs
    </h2>

    <p
      class="mt-2 sm:mt-4 text-white animate-fadeUp delay-150 drop-shadow-md mx-auto text-center"
      style="font-size: clamp(1rem, 2.5vw, 1.5rem); max-width: 40rem"
    >
      Explore top client-requested jobs across various research branches. Click
      to view details and perform work!
    </p>

    <!-- Jobs -->
    <div v-if="branches.length" class="mt-12 space-y-12">
      <div v-for="branch in branches" :key="branch.name">
        <h3
          class="text-2xl font-bold text-white mb-6 border-l-4 border-green-400 pl-4 tracking-wide animate-fadeUp"
        >
          {{ branch.name }}
        </h3>

        <div
          v-for="category in branch.categories"
          :key="category.name"
          class="mb-8"
        >
          <h4
            v-if="category.jobs.length"
            class="text-xl font-semibold text-white mb-4 border-l-2 border-green-300 pl-3 tracking-wide animate-fadeUp"
          >
            {{ category.name }}
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <JobCard
              v-for="job in category.jobs"
              :key="job._id"
              :job="job"
              @click="openJobModal(job)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-white/80 mt-12">
      No approved jobs available.
    </div>

    <!-- Job Modal -->
    <div
      v-if="selectedJob"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-lg w-full p-6 text-left relative text-gray-900 max-h-[90vh] overflow-y-auto"
      >
        <!-- Close -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          @click="closeModal"
        >
          ✕
        </button>

        <h3 class="text-2xl font-bold mb-4">
          {{ selectedJob.title || 'Untitled Job' }}
        </h3>

        <p class="mb-3">
          <strong>Branch:</strong> {{ selectedJob.branch || 'N/A' }}
        </p>
        <p class="mb-3">
          <strong>Category:</strong> {{ selectedJob.category || 'General' }}
        </p>

        <p class="mb-1 font-semibold">Description:</p>
        <p class="mb-6 whitespace-pre-line">
          {{ selectedJob.description || 'No description provided.' }}
        </p>

        <div class="flex justify-center">
          <button
            class="bg-[#FF8040] hover:bg-[#2aac10] hover:text-white text-gray-900 font-extrabold py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 animate-bounce text-lg"
            @click="redirectToExpertSignup"
          >
            Perform This Work
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api.js';
import JobCard from '@/components/ui/JobCard.vue';

const jobs = ref([]);
const selectedJob = ref(null);

const openJobModal = (job) => {
  selectedJob.value = job;
};

const closeModal = () => {
  selectedJob.value = null;
};

// Redirect to signup page with job ID
const redirectToExpertSignup = () => {
  if (!selectedJob.value?._id) return;
  window.location.href = `/signup/expert?job=${selectedJob.value._id}`;
};

onMounted(async () => {
  try {
    const { data } = await api.get('/guest/jobs/approved');
    jobs.value = Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error('Failed to fetch approved jobs:', err);
    jobs.value = [];
  }
});

// Group jobs by branch and category
const branches = computed(() => {
  const map = {};

  jobs.value.forEach((job) => {
    const branchName = job.branch || 'Other';
    const categoryName = job.category || 'General';

    if (!map[branchName]) {
      map[branchName] = { name: branchName, categories: {} };
    }

    if (!map[branchName].categories[categoryName]) {
      map[branchName].categories[categoryName] = {
        name: categoryName,
        jobs: [],
      };
    }

    map[branchName].categories[categoryName].jobs.push(job);
  });

  return Object.values(map).map((branch) => ({
    ...branch,
    categories: Object.values(branch.categories),
  }));
});
</script>
