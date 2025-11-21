<template>
  <div class="p-6 bg-white rounded-2xl shadow-md">
    <h2 class="text-2xl font-bold mb-4">Guest User Support</h2>

    <div v-if="loading" class="text-gray-500">Loading messages...</div>

    <div v-else>
      <div v-if="messages.length === 0" class="text-gray-400">No guest messages yet.</div>

      <ul class="space-y-4">
        <li
          v-for="msg in messages"
          :key="msg._id"
          class="border p-4 rounded-xl hover:shadow-lg transition"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-gray-800">{{ msg.name }}</span>
            <span class="text-gray-500 text-sm">{{ formatDate(msg.createdAt) }}</span>
          </div>
          <div class="text-gray-700 mb-1"><strong>Email:</strong> {{ msg.email }}</div>
          <div class="text-gray-700 mb-2">
            <strong>Service:</strong> {{ msg.service }}
          </div>
          <p class="text-gray-600">{{ msg.message }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/api.js";
import { io } from "socket.io-client";

export default {
  name: "GuestSupport",
  data() {
    return {
      messages: [],
      loading: false,
      socket: null,
    };
  },
  methods: {
    async fetchMessages() {
      this.loading = true;
      try {
        const res = await axios.get("/guest-submissions");
        this.messages = res.data || [];
      } catch (error) {
        console.error(error);
        alert("Failed to load guest messages.");
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
    handleNewSubmission(submission) {
      this.messages.unshift(submission); // add to top
      alert(`New guest submission from ${submission.name}`);
    },
  },
  mounted() {
    this.fetchMessages();

    // Connect to Socket.IO
    this.socket = io("http://localhost:4000"); // Replace with your backend URL in production
    this.socket.on("new-guest-submission", this.handleNewSubmission);
  },
  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
  },
};
</script>

<style scoped>
ul {
  max-height: 500px;
  overflow-y: auto;
}
</style>
