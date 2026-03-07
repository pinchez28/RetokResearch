<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Expert Support Messages</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-gray-500">Loading messages...</div>

    <!-- No messages -->
    <div v-else-if="messages.length === 0" class="text-gray-400">
      No messages yet.
    </div>

    <!-- Messages list -->
    <ul v-else>
      <li
        v-for="msg in messages"
        :key="msg._id"
        class="p-3 border rounded mb-2 hover:bg-gray-50 transition"
      >
        <strong>{{ msg.email }}</strong
        ><br />
        {{ msg.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/core/api/http.js'; // Correct Axios wrapper

const messages = ref([]);
const loading = ref(false);

const fetchExpertMessages = async () => {
  loading.value = true;
  try {
    const res = await api.get('/expert-messages');
    messages.value = res.data.messages || res.data;
  } catch (err) {
    console.error('Failed to fetch expert messages:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExpertMessages);
</script>

<style scoped>
/* Optional: small hover effect for list items */
li:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
