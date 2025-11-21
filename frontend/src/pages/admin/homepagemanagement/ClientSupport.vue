<template>
  <div class="bg-white rounded-xl p-6 shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-[#001BB7]">Client Support</h2>

    <div v-if="messages.length === 0" class="text-gray-500">
      No messages yet.
    </div>

    <ul>
      <li v-for="msg in messages" :key="msg._id" class="border-b py-2">
        <p>
          <strong>{{ msg.name }}</strong> ({{ msg.email }})
        </p>
        <p class="text-gray-700">{{ msg.message }}</p>
        <p class="text-sm text-gray-400">
          {{ new Date(msg.createdAt).toLocaleString() }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../../utils/api.js';

const messages = ref([]);

const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await axios.get('/client-messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    messages.value = res.data;
  } catch (err) {
    console.error('Failed to fetch client messages:', err);
  }
};

onMounted(fetchMessages);
</script>
