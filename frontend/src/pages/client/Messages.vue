<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-[#001BB7]">Messages</h1>

    <!-- Search bar -->
    <div class="flex items-center gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search messages..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
      />
      <button
        @click="searchMessages"
        class="px-4 py-2 rounded-xl bg-[#0046FF] text-white font-semibold hover:bg-[#001BB7]"
      >
        Search
      </button>
    </div>

    <!-- Conversations list -->
    <div
      class="bg-white rounded-2xl shadow p-4 space-y-3 max-h-[600px] overflow-y-auto"
    >
      <div
        v-for="conv in filteredConversations"
        :key="conv.id"
        @click="goToProject(conv.projectId)"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-[#0046FF]/10 cursor-pointer transition"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-full bg-[#001BB7] flex items-center justify-center text-white font-bold"
          >
            {{ conv.expertName?.[0] || 'E' }}
          </div>
          <div>
            <h2 class="font-semibold text-[#001BB7]">
              {{ conv.projectTitle }}
            </h2>
            <p class="text-gray-600 text-sm line-clamp-1">
              {{ conv.lastMessage }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-400">{{ timeAgo(conv.lastTimestamp) }}</p>
          <span
            v-if="conv.unreadCount > 0"
            class="inline-block mt-1 bg-[#FF8040] text-white text-xs font-bold px-2 py-0.5 rounded-full"
          >
            {{ conv.unreadCount }}
          </span>
        </div>
      </div>

      <div
        v-if="filteredConversations.length === 0"
        class="text-center text-gray-500 py-10"
      >
        No messages found
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/utils/api.js';

const router = useRouter();

const conversations = ref([]);
const search = ref('');

// Mock load (replace with API)
const loadConversations = async () => {
  try {
    // Replace with API call
    // const { data } = await axios.get('/client/conversations');
    // conversations.value = data.conversations;

    conversations.value = [
      {
        id: 'c1',
        projectId: 'p1',
        projectTitle: 'Business Research Report',
        expertName: 'Jane Doe',
        lastMessage: 'Sure! I suggest we focus on the US and EU markets.',
        lastTimestamp: Date.now() - 1800 * 1000,
        unreadCount: 1,
      },
      {
        id: 'c2',
        projectId: 'p2',
        projectTitle: 'Marketing Strategy',
        expertName: 'John Smith',
        lastMessage: 'I will send the draft by tomorrow.',
        lastTimestamp: Date.now() - 7200 * 1000,
        unreadCount: 0,
      },
    ];
  } catch (err) {
    console.error('Failed to load conversations', err);
  }
};

onMounted(() => {
  loadConversations();
});

const filteredConversations = computed(() => {
  if (!search.value.trim()) return conversations.value;
  return conversations.value.filter(
    (c) =>
      c.projectTitle.toLowerCase().includes(search.value.toLowerCase()) ||
      c.expertName.toLowerCase().includes(search.value.toLowerCase())
  );
});

const goToProject = (projectId) => {
  router.push(`/client/projects/${projectId}`);
};

const searchMessages = () => {
  // Optional: Could trigger API search
};

const timeAgo = (timestamp) => {
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
