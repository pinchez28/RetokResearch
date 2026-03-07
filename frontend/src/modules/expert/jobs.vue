<template>
  <div class="p-6 md:p-10 space-y-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-extrabold text-[#001BB7]">Available Jobs</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 my-4">
      <input v-model="filters.keyword" placeholder="Search jobs..." class="input" />
      <select v-model="filters.category" class="input">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- JOB CARDS -->
    <div v-if="loading" class="text-center mt-10">Loading jobs...</div>

    <div v-else-if="filteredJobs.length === 0" class="text-center mt-10 text-gray-500">
      No available jobs at the moment. Check back later!
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="job in filteredJobs"
        :key="job._id"
        :id="`job-${job._id}`"
        class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
      >
        <h2 class="text-xl font-bold text-[#001BB7] mb-2">{{ job.title }}</h2>
        <p class="text-gray-600 text-sm mb-4">
          {{ (job.description || "").substring(0, 160) }}...
        </p>

        <div class="space-y-2 text-sm text-gray-500 mb-4">
          <p>
            <strong>Price Range To Consider:</strong> KSh
            {{ job.pricingRange?.min || 0 }} -
            {{ job.pricingRange?.max || 0 }}
          </p>
          <p><strong>Deadline:</strong> {{ formatDate(job.deadline) }}</p>
          <p v-if="job.category"><strong>Category:</strong> {{ job.category }}</p>
        </div>

        <div class="flex justify-between mt-4">
          <button
            class="px-4 py-2 bg-[#001BB7] text-white rounded-xl hover:bg-blue-700"
            @click="viewJob(job)"
          >
            View / Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { expertApi } from "@/core/api/http.js";

const router = useRouter();
const route = useRoute();

const availableJobs = ref([]);
const categories = ref([]);
const filters = ref({ keyword: "", category: "" });
const loading = ref(false);

const fetchJobs = async () => {
  loading.value = true;
  try {
    const res = await expertApi.getAvailableJobs();
    availableJobs.value = res.data.jobs || [];

    categories.value = [
      ...new Set(availableJobs.value.map((job) => job.category).filter(Boolean)),
    ];

    if (route.query.jobId) {
      await nextTick();
      const job = availableJobs.value.find((j) => j._id === route.query.jobId);
      if (job) {
        const el = document.getElementById(`job-${job._id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
  } finally {
    loading.value = false;
  }
};

const filteredJobs = computed(() =>
  availableJobs.value.filter((j) => {
    const matchKeyword = j.title
      .toLowerCase()
      .includes(filters.value.keyword.toLowerCase());
    const matchCategory = filters.value.category
      ? j.category === filters.value.category
      : true;
    return matchKeyword && matchCategory;
  })
);

const formatDate = (d) => {
  const date = new Date(d);
  return !isNaN(date) ? date.toLocaleDateString() : "—";
};

const viewJob = (job) => router.push(`/expert/jobs/${job._id}`);

onMounted(fetchJobs);
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
