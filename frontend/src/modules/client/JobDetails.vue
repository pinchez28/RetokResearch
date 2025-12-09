<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    <!-- Header with Back Button -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          class="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
        >
          ← Back
        </button>
        <div>
          <h1 class="text-2xl font-bold text-[#001BB7]">
            {{ project?.title || 'Loading...' }}
          </h1>
          <p class="text-sm text-gray-600 mt-1">{{ project?.summary || '' }}</p>
        </div>
      </div>
    </div>

    <!-- Project Info -->
    <div
      class="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border border-gray-200"
    >
      <div>
        <h2 class="text-sm font-medium text-gray-500 mb-1">Budget</h2>
        <p class="text-lg font-semibold text-gray-800">
          {{ project?.budget || '—' }}
        </p>
      </div>
      <div>
        <h2 class="text-sm font-medium text-gray-500 mb-1">Due Date</h2>
        <p class="text-lg font-semibold text-gray-800">
          {{ formatDate(project?.dueDate) }}
        </p>
      </div>
      <div>
        <h2 class="text-sm font-medium text-gray-500 mb-1">Status</h2>
        <span
          :class="[
            badgeClass(project?.status),
            'px-3 py-1 rounded-full text-sm font-semibold',
          ]"
        >
          {{ formatStatus(project?.status) }}
        </span>
      </div>
      <div>
        <h2 class="text-sm font-medium text-gray-500 mb-1">Assigned Expert</h2>
        <div v-if="project?.expert">
          <div class="flex items-center gap-3">
            <img
              v-if="project.expert?.photo"
              :src="backendURL + '/' + project.expert.photo"
              alt="Expert Photo"
              class="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <div>
              <p class="text-lg font-semibold text-gray-800">
                {{ project.expert?.name || 'Unknown' }}
              </p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">Not assigned</p>
      </div>
    </div>

    <!-- Description -->
    <div class="bg-white rounded-2xl shadow p-6 border border-gray-200">
      <h2 class="text-sm font-medium text-gray-500 mb-2">Description</h2>
      <p class="text-gray-800 text-base">
        {{ project?.description || 'No description available.' }}
      </p>
    </div>

    <!-- Applicants -->
    <div
      v-if="project?.applications?.length"
      class="bg-white rounded-2xl shadow p-6 border border-gray-200"
    >
      <h2 class="text-sm font-medium text-gray-500 mb-4">Applicants</h2>
      <div class="space-y-4">
        <div
          v-for="app in project.applications"
          :key="app._id"
          class="p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition"
        >
          <img
            v-if="app.expertSnapshot.photo"
            :src="backendURL + '/' + app.expertSnapshot.photo"
            alt="Applicant Photo"
            class="w-12 h-12 rounded-full border-2 border-blue-400"
          />
          <div>
            <p class="text-lg font-semibold text-gray-800">
              {{ app.expertSnapshot.name }}
            </p>
            <p class="text-sm text-gray-500">Quote: {{ app.quote }}</p>
            <p class="text-sm text-gray-500">
              Submitted: {{ formatDate(app.submittedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages / Communication -->
    <div class="bg-white rounded-2xl shadow p-6 border border-gray-200">
      <h2 class="text-sm font-medium text-gray-500 mb-4">Messages</h2>
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.from === 'client' ? 'text-right' : 'text-left'"
        >
          <div
            :class="[
              'inline-block p-3 rounded-2xl',
              msg.from === 'client'
                ? 'bg-[#FF8040]/20 text-[#001BB7]'
                : 'bg-[#0046FF]/20 text-[#001BB7]',
            ]"
          >
            <p class="text-sm">{{ msg.text }}</p>
            <span class="text-xs text-gray-400 mt-1 block">{{
              timeAgo(msg.timestamp)
            }}</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="mt-4 flex gap-2">
        <input
          v-model="newMessage"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim()"
          class="px-4 py-2 rounded-2xl bg-[#0046FF] text-white font-semibold hover:bg-[#001BB7] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/utils/api.js';

const backendURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const jobId = route.params.jobId;

const project = ref({
  id: jobId,
  title: '',
  summary: '',
  description: '',
  budget: '',
  dueDate: '',
  status: '',
  expert: null,
  applications: [],
});

const messages = ref([]);
const newMessage = ref('');

const loadProject = async () => {
  try {
    const { data } = await axios.get(`/client/jobs/${jobId}`);
    const job = data.job;

    if (!job) return;

    project.value = {
      id: job._id,
      title: job.title,
      summary: job.summary || '',
      description: job.description,
      budget: job.clientProposedPrice,
      dueDate: job.deadline,
      status: job.status,
      expert: job.assignedExpert
        ? {
            name: job.assignedExpert.profile?.name,
            photo: job.assignedExpert.profile?.photo,
          }
        : null,
      applications: job.applications || [],
    };

    messages.value = data.messages || [];
  } catch (err) {
    console.error('Failed to load project', err);
  }
};

onMounted(loadProject);

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  const msg = {
    id: 'm' + Date.now(),
    from: 'client',
    text: newMessage.value.trim(),
    timestamp: Date.now(),
  };
  messages.value.push(msg);
  newMessage.value = '';
  try {
    await axios.post(`/client/jobs/${jobId}/messages`, { text: msg.text });
  } catch (err) {
    console.error('Failed to send message', err);
  }
};

const goBack = () => router.back();

const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
};

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—');

const badgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'open':
      return 'bg-[#0046FF] text-white';
    case 'in progress':
      return 'bg-[#001BB7] text-white';
    case 'submitted':
      return 'bg-[#0046FF] text-white';
    case 'completed':
      return 'bg-green-600 text-white';
    case 'cancelled':
      return 'bg-gray-300 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status) => {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>

