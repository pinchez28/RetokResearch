<script setup>
// You can keep your script logic here
import { ref, onMounted } from 'vue';
import axios from '@/utils/api.js';

const messages = ref([]);

const fetchExpertMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/expert-messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messages.value = res.data;
  } catch (err) {
    console.error('Failed to fetch expert messages:', err);
  }
};

onMounted(() => {
  fetchExpertMessages();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Expert Support Messages</h1>

    <div v-if="messages.length === 0">No messages yet.</div>

    <ul v-else>
      <li v-for="msg in messages" :key="msg.id" class="p-3 border rounded mb-2">
        <strong>{{ msg.email }}</strong
        ><br />
        {{ msg.message }}
      </li>
    </ul>
  </div>
</template>
