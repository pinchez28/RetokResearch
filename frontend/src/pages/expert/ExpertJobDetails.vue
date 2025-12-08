<template>
  <div class="max-w-4xl mx-auto p-6 md:p-10 space-y-6 bg-gray-100 min-h-screen">
    <!-- Job Header -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-3xl font-bold text-[#001BB7]">
            {{ job.title || 'Untitled Job' }}
          </h1>

          <!-- STATUS BADGE -->
          <p class="text-gray-500 mt-1">
            Status:
            <span
              :class="badgeClass(job.status)"
              class="px-2 py-1 rounded-full text-white text-sm"
            >
              {{ job.status || 'Unknown' }}
            </span>
          </p>
        </div>

        <div>
          <button
            @click="goBack"
            class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <p class="text-gray-700 mb-4 whitespace-pre-line">
        {{ job.description || 'No description provided.' }}
      </p>

      <!-- INFO GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
        <div>
          <strong>Budget:</strong>
          <span v-if="job.pricingRange">
            KSh {{ job.pricingRange.min }} - {{ job.pricingRange.max }}
          </span>
          <span v-else>-</span>
        </div>

        <div><strong>Deadline:</strong> {{ formatDate(job.deadline) }}</div>

        <div><strong>Category:</strong> {{ job.category || '-' }}</div>

        <div><strong>Branch:</strong> {{ job.branch || '-' }}</div>

        <div>
          <strong>Skills Required:</strong>
          <span v-if="job.skillsRequired?.length">
            {{ job.skillsRequired.join(', ') }}
          </span>
          <span v-else>-</span>
        </div>
      </div>
    </div>

    <!-- APPLY SECTION -->
    <div v-if="!job.hasApplied" class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-semibold text-[#001BB7] mb-4">
        Submit Your Proposal
      </h2>

      <form @submit.prevent="submitProposal" class="space-y-4">
        <!-- PROPOSAL TEXT -->
        <div>
          <label class="block font-semibold mb-1">Proposal</label>
          <textarea
            v-model="form.proposalText"
            rows="5"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
            placeholder="Write your proposal..."
            required
          ></textarea>
        </div>

        <!-- QUOTE -->
        <div>
          <label class="block font-semibold mb-1">Quote (KSh)</label>
          <input
            type="number"
            v-model.number="form.quote"
            min="1"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
            placeholder="Enter your quote"
            required
          />
        </div>

        <!-- CV UPLOAD -->
        <div>
          <label class="block font-semibold mb-1">Upload CV (Optional)</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept=".pdf,.doc,.docx"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#001BB7]"
          />
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full bg-[#001BB7] text-white py-3 rounded-xl hover:bg-[#0025FF] disabled:opacity-50"
        >
          {{ submitting ? 'Submitting...' : 'Submit Proposal' }}
        </button>
      </form>
    </div>

    <div
      v-else
      class="bg-green-100 text-green-800 rounded-xl p-4 text-center font-semibold"
    >
      You have already applied for this job.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '@/utils/api.js';

const route = useRoute();
const router = useRouter();
const jobId = route.params.jobId;

const job = ref({});
const submitting = ref(false);

const form = ref({
  proposalText: '',
  quote: 0,
  cvFile: null,
});

const token = localStorage.getItem('token');

// ============================
// FETCH JOB DETAILS
// ============================
const fetchJobDetails = async () => {
  try {
    const res = await api.get(`/expert/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    job.value = res.data.job || {};
    job.value.hasApplied = res.data.hasApplied ?? false;

    // Prefill quote from budget
    if (job.value.pricingRange?.min) {
      form.value.quote = job.value.pricingRange.min;
    }
  } catch (err) {
    console.error('Error fetching job details', err);
    Swal.fire(
      'Error',
      err.response?.data?.message || 'Failed to load job details.',
      'error'
    );
  }
};

// ============================
// SUBMIT PROPOSAL
// ============================
const submitProposal = async () => {
  if (!form.value.proposalText.trim()) {
    return Swal.fire('Warning', 'Your proposal cannot be empty.', 'warning');
  }
  if (form.value.quote <= 0) {
    return Swal.fire('Warning', 'Please enter a valid quote.', 'warning');
  }

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('proposalText', form.value.proposalText);
    formData.append('quote', form.value.quote);

    if (form.value.cvFile) formData.append('cv', form.value.cvFile);

    const res = await api.post(`/expert/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    Swal.fire('Success', 'Proposal submitted successfully!', 'success');
    job.value.hasApplied = true;
  } catch (err) {
    console.error(err);
    Swal.fire(
      'Error',
      err.response?.data?.message || 'Failed to submit proposal',
      'error'
    );
  } finally {
    submitting.value = false;
  }
};

// ============================
// FILE UPLOAD HANDLER
// ============================
const handleFileUpload = (e) => {
  form.value.cvFile = e.target.files[0];
};

const goBack = () => router.back();

// ============================
// HELPERS
// ============================
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : '-';

const badgeClass = (status) => {
  switch (status) {
    case 'approved_for_bidding':
      return 'bg-blue-600';
    case 'in_progress':
      return 'bg-indigo-700';
    case 'completed':
      return 'bg-green-600';
    case 'cancelled':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

onMounted(fetchJobDetails);
</script>

<style scoped>
/* Optional extra styling improvements */
</style>
