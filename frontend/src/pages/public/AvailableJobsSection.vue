<template>
  <section id="approved-jobs" class="py-24 px-6 md:px-12 lg:px-20 bg-blue-800 text-white">
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
      Explore top client-requested jobs across various research branches. Click to sign up
      and get started!
    </p>

    ```
    <div v-if="branches.length" class="mt-12 space-y-12">
      <div v-for="branch in branches" :key="branch.name">
        <h3
          class="text-2xl font-bold text-white mb-6 border-l-4 border-green-400 pl-4 tracking-wide animate-fadeUp"
        >
          {{ branch.name }}
        </h3>

        <div v-for="category in branch.categories" :key="category.name" class="mb-8">
          <h4
            v-if="category.jobs.length"
            class="text-xl font-semibold text-white mb-4 border-l-2 border-green-300 pl-3 tracking-wide animate-fadeUp"
          >
            {{ category.name }}
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <JobCard
              v-for="job in category.jobs.slice(0, 4)"
              :key="job._id"
              :job="job"
              @click="openSignupOverlay(job)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-white/80 mt-12">No approved jobs available.</div>

    <!-- Signup Overlay -->
    <div
      v-if="showSignup"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 text-center relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          @click="closeOverlay"
        >
          ✕
        </button>
        <h3 class="text-2xl font-bold mb-4">Sign Up to Continue</h3>
        <p class="mb-6">
          Please choose to sign up as a client or service provider to view full job
          details.
        </p>
        <div class="flex justify-center gap-4">
          <button
            class="px-6 py-3 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-600 transition"
            @click="signup('client')"
          >
            Client
          </button>
          <button
            class="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition"
            @click="signup('provider')"
          >
            Service Provider
          </button>
        </div>
      </div>
    </div>
    ```
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/utils/api.js";
import JobCard from "@/components/ui/JobCard.vue";

const jobs = ref([]);
const showSignup = ref(false);

const openSignupOverlay = (job) => {
  showSignup.value = true;
};
const closeOverlay = () => (showSignup.value = false);
const signup = (role) => (window.location.href = `/signup?role=${role}`);

// Fetch approved jobs safely
onMounted(async () => {
  try {
    const { data } = await api.get("/guest/jobs/approved");
    jobs.value = Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error("Failed to fetch approved jobs:", err);
    jobs.value = [];
  }
});

// Group jobs by branch -> category safely
const branches = computed(() => {
  const map = {};
  jobs.value.forEach((job) => {
    const branchName = job.branch || "Other";
    const categoryName = job.category || "General";

    if (!map[branchName]) map[branchName] = { name: branchName, categories: {} };
    if (!map[branchName].categories[categoryName])
      map[branchName].categories[categoryName] = {
        name: categoryName,
        jobs: [],
      };

    map[branchName].categories[categoryName].jobs.push(job);
  });

  return Object.values(map).map((b) => ({
    ...b,
    categories: Object.values(b.categories),
  }));
});
</script>
