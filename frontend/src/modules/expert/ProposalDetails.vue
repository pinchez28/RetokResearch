<template>
  <div class="max-w-4xl mx-auto p-6 md:p-10 space-y-6 bg-gray-100 min-h-screen">
    <!-- Proposal Info -->
    <section class="bg-white p-6 rounded-2xl shadow space-y-3">
      <h1 class="text-3xl font-bold">Proposal Details</h1>

      <p>
        <strong>Job:</strong>
        {{ proposal.job?.title || 'N/A' }}
      </p>

      <p>
        <strong>Job Description:</strong>
        {{ proposal.job?.description || 'N/A' }}
      </p>

      <p>
        <strong>Quote:</strong>
        {{ proposal.quote ?? 'N/A' }}
      </p>

      <p>
        <strong>Estimated Delivery (days):</strong>
        {{ proposal.estimatedDeliveryDays ?? 'N/A' }}
      </p>

      <p>
        <strong>Proposal Message:</strong>
        {{ proposal.proposalText || 'N/A' }}
      </p>

      <p>
        <strong>Status:</strong>
        {{ proposal.status || 'N/A' }}
      </p>
    </section>

    <!-- CV Viewer -->
    <section v-if="proposal.cvUrl" class="bg-white p-6 rounded-2xl shadow">
      <h2 class="text-xl font-semibold mb-4">Submitted CV</h2>
      <CvViewer :cvUrl="fullCvUrl" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/core/api/http.js';
import CvViewer from '@/components/ui/CvViewer.vue';

const route = useRoute();
const proposalId = route.params.id;

const proposal = ref({});
const fullCvUrl = ref('');

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const fetchProposal = async () => {
  try {
    const { data } = await api.get(`/expert/proposals/${proposalId}`);

    if (data.success) {
      proposal.value = data.proposal;

      if (data.proposal.cvUrl) {
        fullCvUrl.value = `${BASE_URL}/${data.proposal.cvUrl}`;
      }
    }
  } catch (err) {
    console.error('Failed to fetch proposal:', err);
  }
};

onMounted(fetchProposal);
</script>
