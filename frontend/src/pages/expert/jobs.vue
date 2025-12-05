<template>
  <div class="p-6 md:p-10 space-y-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-[#001BB7] mb-6">Available Jobs</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="filters.keyword" placeholder="Search jobs..." class="input" />
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
        v-for="jobItem in filteredJobs"
        :key="jobItem._id"
        class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
      >
        <h2 class="text-xl font-semibold mb-2 text-[#001BB7]">
          {{ jobItem.title }}
        </h2>
        <p class="text-gray-600 mb-2">{{ jobItem.description?.substring(0, 120) }}...</p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>
            Budget: KSh {{ jobItem.pricingRange.min }} - KSh
            {{ jobItem.pricingRange.max }}
          </span>
          <span>Deadline: {{ formatDate(jobItem.deadline) }}</span>
        </div>
        <div class="text-sm text-gray-500 mt-1">
          Experience: {{ jobItem.experience || "Any" }}
        </div>
        <button
          class="mt-4 w-full bg-[#FF8040] text-white py-2 rounded-xl hover:bg-[#0046FF]"
          @click="openProposalModal(jobItem)"
        >
          View / Apply
        </button>
      </div>
    </div>

    <!-- Proposal Modal -->
    <div
      v-if="selectedJob"
      class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeProposalModal"
    >
      <div
        class="modal-content bg-white rounded-2xl p-8 w-full max-w-lg relative shadow-lg"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          @click="closeProposalModal"
        >
          ×
        </button>

        <!-- Job Details -->
        <h2 class="text-2xl font-bold text-[#001BB7] mb-4">
          {{ selectedJob.title }}
        </h2>

        <div class="mb-4">
          <p class="text-gray-700 mb-2">
            <span class="font-semibold">Description:</span>
            {{ selectedJob.description }}
          </p>
          <p class="text-gray-700 mb-2">
            <span class="font-semibold">Budget:</span> KSh
            {{ selectedJob.pricingRange.min }} - KSh
            {{ selectedJob.pricingRange.max }}
          </p>
          <p class="text-gray-700 mb-2">
            <span class="font-semibold">Deadline:</span>
            {{ formatDate(selectedJob.deadline) }}
          </p>
          <p class="text-gray-700 mb-4">
            <span class="font-semibold">Experience:</span>
            {{ selectedJob.experience || "Any" }}
          </p>
        </div>

        <!-- Proposal Form -->
        <form @submit.prevent="submitProposal(selectedJob._id)">
          <div class="form-group mb-4">
            <label class="form-label block font-semibold mb-1 text-gray-700"
              >Your Proposal</label
            >
            <textarea
              v-model="form.proposal"
              class="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
              rows="4"
              placeholder="Write your proposal..."
              required
            ></textarea>
          </div>

          <div class="form-group mb-4">
            <label class="form-label block font-semibold mb-1 text-gray-700"
              >Your Quote (KSh)</label
            >
            <input
              type="number"
              v-model.number="form.quote"
              class="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
              placeholder="Enter your amount"
              required
            />
          </div>

          <div class="form-group mb-4">
            <label class="form-label block font-semibold mb-1 text-gray-700"
              >Upload CV (Optional)</label
            >
            <input
              type="file"
              ref="cvFile"
              class="form-control w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
              accept=".pdf,.doc,.docx"
            />
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-[#FF8040] text-white py-3 rounded-xl font-semibold hover:bg-[#0046FF] transition"
          >
            {{ submitting ? "Submitting..." : "Submit Proposal" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/api.js";

const route = useRoute();
const router = useRouter();

const availableJobs = ref([]);
const selectedJob = ref(null);
const filters = ref({ keyword: "", category: "", experience: "" });
const categories = ref([]);

const form = ref({ proposal: "", quote: 0 });
const cvFile = ref(null);
const submitting = ref(false);

const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString() : "-");

const fetchJobs = async () => {
  try {
    const res = await api.get("/expert/jobs", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (Array.isArray(res.data.jobs)) {
      availableJobs.value = res.data.jobs;
      categories.value = [
        ...new Set(res.data.jobs.map((j) => j.category).filter(Boolean)),
      ];

      const queryJobId = route.query.jobId;
      if (queryJobId) {
        const jobToOpen = availableJobs.value.find((j) => j._id === queryJobId);
        if (jobToOpen) openProposalModal(jobToOpen, false);
      }
    }
  } catch (err) {
    console.error("Error fetching jobs:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to fetch jobs.");
  }
};

onMounted(fetchJobs);

const filteredJobs = computed(() =>
  availableJobs.value.filter((job) => {
    // 🛑 Hide jobs the expert has already applied for
    if (job.hasApplied) return false;

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
  })
);

const openProposalModal = (job, pushHistory = true) => {
  selectedJob.value = job;
  form.value.proposal = "";
  form.value.quote = job.pricingRange?.min || 0;
  if (pushHistory) router.replace({ query: { jobId: job._id } });
};

const closeProposalModal = () => {
  selectedJob.value = null;
  form.value.proposal = "";
  form.value.quote = 0;
  router.replace({ query: {} });
};

const submitProposal = async (jobId) => {
  if (!form.value.proposal.trim()) return alert("Please enter a proposal.");
  if (!form.value.quote || form.value.quote <= 0)
    return alert("Please enter a valid quote.");

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append("proposalText", form.value.proposal);
    formData.append("quote", form.value.quote);

    const file = cvFile.value?.files[0];
    if (file) formData.append("cv", file);

    await api.post(`/expert/jobs/${jobId}/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Proposal submitted successfully!");
    closeProposalModal();
  } catch (err) {
    console.error("Error submitting proposal:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to submit proposal.");
  } finally {
    submitting.value = false;
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
textarea,
input {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  outline: none;
}
textarea:focus,
input:focus {
  border-color: #001bb7;
  box-shadow: 0 0 0 2px rgba(0, 27, 183, 0.2);
}
.modal {
  transition: all 0.2s ease-in-out;
}
</style>
