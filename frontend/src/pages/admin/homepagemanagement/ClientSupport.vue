<template>
  <div class="flex flex-col h-full">
    <!-- Page Title -->
    <h2 class="text-2xl font-bold mb-4">Guest User Support</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500">Loading messages...</div>

    <!-- No messages -->
    <div v-else-if="messages.length === 0" class="text-gray-400">
      No guest messages yet.
    </div>

    <!-- Guest Requests List -->
    <ul v-else class="space-y-4 overflow-y-auto flex-1">
      <li
        v-for="msg in messages"
        :key="msg._id"
        class="border p-4 rounded-xl hover:shadow-lg transition cursor-pointer"
        @click="openModal(msg)"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-gray-800">{{ msg.name || "Guest" }}</span>
          <span class="text-gray-500 text-sm">{{ formatDate(msg.createdAt) }}</span>
        </div>
        <div class="text-gray-700 mb-1"><strong>Email:</strong> {{ msg.email }}</div>
        <div class="text-gray-700 mb-2">
          <strong>Service:</strong> {{ msg.service || "Quick Request" }}
        </div>
        <p class="text-gray-600 truncate">{{ msg.description }}</p>
      </li>
    </ul>

    <!-- Pagination -->
    <div class="flex justify-between mt-4" v-if="totalPages > 1">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedMessage"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl w-11/12 max-w-xl shadow-lg relative">
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          @click="closeModal"
        >
          ✕
        </button>

        <h3 class="text-xl font-bold mb-2">{{ selectedMessage.topic }}</h3>
        <p class="mb-2"><strong>Name:</strong> {{ selectedMessage.name || "Guest" }}</p>
        <p class="mb-2"><strong>Email:</strong> {{ selectedMessage.email }}</p>
        <p class="mb-2">
          <strong>Service:</strong>
          {{ selectedMessage.service || "Quick Request" }}
        </p>
        <p class="mb-2"><strong>Phone:</strong> {{ selectedMessage.phone || "N/A" }}</p>
        <p class="mb-2">
          <strong>Deadline:</strong> {{ selectedMessage.deadline || "N/A" }}
        </p>
        <p class="mb-2">
          <strong>Proposed Price:</strong>
          {{ selectedMessage.proposedPrice || "N/A" }}
        </p>
        <p class="mb-2"><strong>Description:</strong></p>
        <p class="mb-4 text-gray-700">{{ selectedMessage.description }}</p>

        <div class="flex space-x-2">
          <a
            :href="`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
              selectedMessage.topic
            )}`"
            target="_blank"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Reply via Email
          </a>

          <button
            @click="deleteRequest(selectedMessage._id)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
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
      selectedMessage: null,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  },
  methods: {
    async fetchMessages() {
      this.loading = true;
      try {
        const res = await axios.get("/guest-requests", {
          params: { page: this.page, limit: this.limit },
        });
        this.messages = res.data.requests || [];
        this.totalPages = Math.ceil(res.data.total / this.limit);

        // Open modal if requestId query exists
        const requestId = this.$route.query.requestId;
        if (requestId) {
          const msg = this.messages.find((m) => m._id === requestId);
          if (msg) this.openModal(msg);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load guest messages.");
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
    openModal(msg) {
      this.selectedMessage = msg;
    },
    closeModal() {
      this.selectedMessage = null;
      if (this.$route.query.requestId) {
        this.$router.replace({ query: {} });
      }
    },
    async deleteRequest(id) {
      if (!confirm("Are you sure you want to delete this request?")) return;
      try {
        await axios.delete(`/guest-requests/${id}`);
        this.messages = this.messages.filter((m) => m._id !== id);
        this.closeModal();
      } catch (err) {
        console.error(err);
        alert("Failed to delete request.");
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchMessages();
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchMessages();
      }
    },
    handleNewRequest(request) {
      this.messages.unshift(request);
      if (this.messages.length > this.limit) this.messages.pop();
    },
  },
  mounted() {
    this.fetchMessages();
    this.socket = io("http://localhost:4000");
    this.socket.on("new-guest-request", this.handleNewRequest);
  },
  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
  },
};
</script>

<style scoped>
.flex-1 {
  flex: 1 1 auto;
}
ul {
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
