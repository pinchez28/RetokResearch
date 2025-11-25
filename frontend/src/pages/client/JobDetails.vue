<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#001BB7]">{{ project.title }}</h1>
        <p class="text-sm text-gray-600 mt-1">{{ project.summary }}</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          v-if="project.pendingPayment"
          @click="goToPayments"
          class="px-4 py-2 rounded-xl bg-[#FF8040] text-white font-semibold hover:bg-[#FFA366]"
        >
          Pay Now
        </button>

        <RouterLink
          :to="`/client/projects/${project.id}/edit`"
          class="px-4 py-2 rounded-xl bg-[#0046FF] text-white font-semibold hover:bg-[#001BB7]"
        >
          Edit Project
        </RouterLink>
      </div>
    </div>

    <!-- Project Info -->
    <div
      class="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      <div>
        <h2 class="font-semibold text-[#001BB7] mb-2">Budget</h2>
        <p class="text-gray-700">{{ project.budget || '—' }}</p>
      </div>
      <div>
        <h2 class="font-semibold text-[#001BB7] mb-2">Due Date</h2>
        <p class="text-gray-700">{{ formatDate(project.dueDate) }}</p>
      </div>
      <div>
        <h2 class="font-semibold text-[#001BB7] mb-2">Status</h2>
        <span
          :class="badgeClass(project.status)"
          class="px-2 py-1 rounded-full text-xs font-semibold"
        >
          {{ project.status }}
        </span>
      </div>
      <div>
        <h2 class="font-semibold text-[#001BB7] mb-2">Assigned Expert</h2>
        <p class="text-gray-700">
          {{ project.expertName || 'Not assigned yet' }}
        </p>
      </div>
    </div>

    <!-- Description -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-[#001BB7] font-semibold mb-2">Description</h2>
      <p class="text-gray-700">{{ project.description }}</p>
    </div>

    <!-- Messages / Communication -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-[#001BB7] font-semibold mb-4">Messages</h2>

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

      <!-- Send Message -->
      <form @submit.prevent="sendMessage" class="mt-4 flex gap-2">
        <input
          v-model="newMessage"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
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

const route = useRoute();
const router = useRouter();

const projectId = route.params.id;

const project = ref({
  id: projectId,
  title: '',
  summary: '',
  description: '',
  budget: '',
  dueDate: '',
  status: '',
  expertName: '',
  pendingPayment: false,
});

const messages = ref([]);
const newMessage = ref('');

// Mock load function (replace with API)
const loadProject = async () => {
  try {
    // Replace with actual API call:
    // const { data } = await axios.get(`/client/projects/${projectId}`);
    // project.value = data.project;
    // messages.value = data.messages;

    project.value = {
      id: 'p1',
      title: 'Business Research Report',
      summary: 'Comprehensive market research on fintech adoption.',
      description: 'Full market analysis with insights and recommendations.',
      budget: '$800',
      dueDate: '2025-12-01',
      status: 'In Progress',
      expertName: 'Jane Doe',
      pendingPayment: true,
    };

    messages.value = [
      {
        id: 'm1',
        from: 'client',
        text: 'Hello, can we clarify the scope?',
        timestamp: Date.now() - 3600 * 1000,
      },
      {
        id: 'm2',
        from: 'expert',
        text: 'Sure! I suggest we focus on the US and EU markets.',
        timestamp: Date.now() - 1800 * 1000,
      },
    ];
  } catch (err) {
    console.error('Failed to load project', err);
  }
};

onMounted(() => {
  loadProject();
});

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

  // Send to backend
  try {
    await axios.post(`/client/projects/${projectId}/messages`, {
      text: msg.text,
    });
  } catch (err) {
    console.error('Failed to send message', err);
  }
};

const goToPayments = () => {
  router.push({
    path: '/client/payments',
    query: { projectId: project.value.id },
  });
};

const timeAgo = (timestamp) => {
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
};

const badgeClass = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-[#0046FF] text-white';
    case 'In Progress':
      return 'bg-[#001BB7] text-white';
    case 'Submitted':
      return 'bg-[#0046FF] text-white';
    case 'Completed':
      return 'bg-green-600 text-white';
    case 'Cancelled':
      return 'bg-gray-300 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<style scoped>
/* Scroll for messages */
div[role='messages'] {
  max-height: 400px;
  overflow-y: auto;
}

/* Round corners for messages */
</style>
