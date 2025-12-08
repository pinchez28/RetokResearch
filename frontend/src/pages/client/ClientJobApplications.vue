<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- Header -->
    <header
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <!-- Back Button -->
        <button
          @click="$router.back()"
          class="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
        >
          ← Back
        </button>

        <div>
          <h1 class="text-3xl font-bold text-[#001BB7]">Job Applications</h1>
          <p class="text-gray-600 mt-1">
            View all applications submitted for this job.
          </p>
        </div>
      </div>
    </header>

    <!-- Job Info -->
    <section v-if="job" class="bg-white rounded-2xl shadow-lg p-6">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <div>
          <h2 class="text-2xl font-bold text-[#0046FF]">{{ job.title }}</h2>
          <p class="text-gray-700 mt-2">{{ job.description }}</p>
          <p class="mt-2 text-gray-500">
            Budget:
            {{
              job.clientProposedPrice
                ? 'KES ' + job.clientProposedPrice
                : job.pricingRange
                ? 'KES ' + job.pricingRange.min + ' - ' + job.pricingRange.max
                : '—'
            }}
          </p>
          <p class="text-gray-500">
            Deadline:
            {{
              job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'
            }}
          </p>
          <span
            :class="[
              'inline-block px-3 py-1 rounded-full text-white text-sm mt-2',
              badgeClass(job.status),
            ]"
          >
            {{ formatStatus(job.status) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Applications -->
    <section v-if="applications.length" class="space-y-6">
      <div
        v-for="app in applications"
        :key="app._id"
        class="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6"
      >
        <!-- Expert Photo -->
        <div class="flex-shrink-0">
          <img
            v-if="app.expertSnapshot?.photo"
            :src="backendURL + app.expertSnapshot.photo"
            alt="Expert Photo"
            class="w-32 h-32 rounded-full object-cover border-2 border-blue-400"
          />
          <div
            v-else
            class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
          >
            No Photo
          </div>
        </div>

        <!-- Expert Info -->
        <div
          class="flex-1 bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Name -->
          <div class="mb-4">
            <h3 class="text-3xl font-extrabold text-[#FF5722] mb-1">
              {{ app.expertSnapshot?.name || 'Unknown Expert' }}
            </h3>
            <span class="text-sm text-gray-500 uppercase tracking-wide"
              >Expert Profile</span
            >
          </div>

          <!-- Contact & Specialization -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <p class="text-gray-600 text-sm">
                <strong>Phone:</strong> {{ app.expertSnapshot?.phone || '—' }}
              </p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <p class="text-gray-600 text-sm">
                <strong>Specialization:</strong>
                {{ app.expertSnapshot?.specialization || '—' }}
              </p>
            </div>
          </div>

          <!-- Bio & Experience -->
          <div class="mb-4 space-y-2">
            <p class="text-gray-700">
              <strong>Bio:</strong> {{ app.expertSnapshot?.bio || '—' }}
            </p>
            <p class="text-gray-700">
              <strong>Experience:</strong>
              {{ app.expertSnapshot?.experience || '—' }} years
            </p>
            <p class="text-gray-700">
              <strong>Education:</strong>
              {{ app.expertSnapshot?.education || '—' }}
            </p>
            <p class="text-gray-700">
              <strong>Certifications:</strong>
              <span v-if="app.expertSnapshot?.certifications?.length">
                {{ app.expertSnapshot.certifications.join(', ') }}
              </span>
              <span v-else>—</span>
            </p>
          </div>

          <!-- Quote -->
          <div
            class="mb-4 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2"
          >
            <p class="text-green-600 font-semibold text-lg">
              Quoted Price: KES {{ app.quote || '—' }}
            </p>
            <p class="text-gray-500 text-sm">
              Submitted:
              {{
                app.submittedAt
                  ? new Date(app.submittedAt).toLocaleString()
                  : '—'
              }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col md:flex-row gap-3">
            <!-- View Proposal -->
            <button
              @click="viewProposal(app)"
              class="w-full md:w-auto px-6 py-3 rounded-xl bg-[#0046FF] text-white font-semibold hover:bg-[#0033cc]"
            >
              View Proposal
            </button>

            <!-- 🚀 Hire Button -->
            <button
              @click="hireExpert(app)"
              :disabled="job?.hiredExpertId"
              class="w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-colors"
              :class="
                job?.hiredExpertId === app.expertSnapshot?._id
                  ? 'bg-green-600 text-white'
                  : job?.hiredExpertId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF9800] text-white hover:bg-[#FB8C00]'
              "
            >
              {{
                job?.hiredExpertId === app.expertSnapshot?._id
                  ? 'Hired'
                  : 'Hire'
              }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="text-gray-500 text-center py-10">
      No applications yet.
    </div>

    <!-- Proposal Modal -->
    <div
      v-if="showProposalModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-[#001BB7]">
            Proposal from
            {{ selectedProposal?.expertSnapshot?.name || 'Unknown Expert' }}
          </h2>
          <button
            @click="closeProposalModal"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <p>
            <strong>Quote:</strong> KES {{ selectedProposal?.quote || '—' }}
          </p>
          <div>
            <strong>Message:</strong>
            <div class="p-3 bg-gray-100 rounded-lg whitespace-pre-line mt-1">
              {{ selectedProposal?.proposalText || 'No message provided' }}
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="closeProposalModal"
            class="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { jobsStore } from '@/composables/jobsStore.js';
import api from '@/utils/api.js';

const backendURL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const jobId = route.params.jobId;

// Load jobs
onMounted(async () => {
  if (!jobsStore.value.length) {
    try {
      const { data } = await api.get('/client/jobs');
      jobsStore.value = data.jobs || [];
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
  }
});

const job = computed(() => jobsStore.value.find((j) => j._id === jobId));
const applications = computed(() => job.value?.applications || []);

const selectedProposal = ref(null);
const showProposalModal = ref(false);

const viewProposal = (proposal) => {
  selectedProposal.value = proposal;
  showProposalModal.value = true;
};
const closeProposalModal = () => (showProposalModal.value = false);

/* 🚀 HIRE FUNCTION — FULL FRONTEND IMPLEMENTATION */
const hireExpert = async (app) => {
  try {
    const expertId = app.expertSnapshot._id;

    const { data } = await api.post(`/client/jobs/${jobId}/hire`, {
      expertId,
      applicationId: app._id,
    });

    // Update store locally
    const i = jobsStore.value.findIndex((j) => j._id === jobId);
    if (i !== -1) {
      jobsStore.value[i].hiredExpertId = expertId;
      jobsStore.value[i].hiredApplicationId = app._id;
      jobsStore.value[i].status = 'in_progress';
    }

    alert('Expert successfully hired!');
  } catch (error) {
    console.error('Hire failed:', error);
    alert('Failed to hire expert.');
  }
};

const badgeClass = (status) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500';
    case 'in_progress':
      return 'bg-green-600';
    case 'submitted':
      return 'bg-purple-600';
    case 'approved_for_bidding':
      return 'bg-orange-500';
    case 'completed':
      return 'bg-green-600';
    case 'cancelled':
      return 'bg-gray-400';
    default:
      return 'bg-gray-300';
  }
};
const formatStatus = (status) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
</script>

<style scoped>
section > div:hover {
  transform: translateY(-2px);
  transition: all 0.2s;
}
button {
  transition: all 0.2s;
}
</style>
