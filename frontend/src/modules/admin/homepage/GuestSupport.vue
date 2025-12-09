<template>
  <div class="flex flex-col h-full">
    <!-- Page Title -->
    <h2 class="text-3xl font-bold mb-6 text-[#1A1A1A] tracking-tight">
      Guest User Support
    </h2>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 animate-pulse">
      Loading messages...
    </div>

    <!-- No messages -->
    <div v-else-if="messages.length === 0" class="text-gray-400 text-lg">
      No guest messages yet.
    </div>

    <!-- Guest Requests List -->
    <ul v-else class="space-y-4 overflow-y-auto flex-1 pr-1">
      <li
        v-for="msg in messages"
        :key="msg._id"
        class="rounded-2xl p-5 shadow-lg border border-[#D9D9D9] cursor-pointer transition transform hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-[#F4F6F8] to-[#D9D9D9]/40"
        @click="openModal(msg)"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="font-semibold text-[#1A1A1A] text-lg">
            {{ msg.name || 'Guest' }}
          </span>
          <span class="text-gray-600 text-sm font-medium">
            {{ formatDate(msg.createdAt) }}
          </span>
        </div>

        <div class="text-[#1A1A1A]">
          <p><strong>Email:</strong> {{ msg.email }}</p>
          <p><strong>Service:</strong> {{ msg.service || 'Quick Request' }}</p>
        </div>

        <p class="mt-3 text-gray-600 line-clamp-2 text-sm">
          {{ msg.description }}
        </p>
      </li>
    </ul>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-5" v-if="totalPages > 1">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-[#D9D9D9] text-[#1A1A1A] rounded-lg disabled:opacity-50 hover:bg-[#C8C8C8] transition font-medium"
      >
        Prev
      </button>

      <span class="text-[#1A1A1A] font-semibold">
        Page {{ page }} / {{ totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-4 py-2 bg-[#D9D9D9] text-[#1A1A1A] rounded-lg disabled:opacity-50 hover:bg-[#C8C8C8] transition font-medium"
      >
        Next
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedMessage"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-8 rounded-2xl w-11/12 max-w-xl shadow-2xl relative border border-[#D9D9D9]"
      >
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-[#1A1A1A] text-xl"
          @click="closeModal"
        >
          ✕
        </button>

        <h3 class="text-2xl font-bold mb-4 text-[#1A1A1A]">
          {{ selectedMessage.topic }}
        </h3>

        <div class="space-y-2 text-[#1A1A1A]">
          <p><strong>Name:</strong> {{ selectedMessage.name || 'Guest' }}</p>
          <p><strong>Email:</strong> {{ selectedMessage.email }}</p>
          <p><strong>Service:</strong> {{ selectedMessage.service }}</p>
          <p><strong>Phone:</strong> {{ selectedMessage.phone || 'N/A' }}</p>
          <p>
            <strong>Deadline:</strong> {{ selectedMessage.deadline || 'N/A' }}
          </p>
          <p>
            <strong>Price:</strong> {{ selectedMessage.proposedPrice || 'N/A' }}
          </p>
        </div>

        <div class="mt-4">
          <p class="font-semibold text-[#1A1A1A]">Description:</p>
          <p class="text-gray-700 mt-1 leading-relaxed">
            {{ selectedMessage.description }}
          </p>
        </div>

        <div class="flex mt-6 space-x-3">
          <a
            :href="`mailto:${
              selectedMessage.email
            }?subject=Re: ${encodeURIComponent(selectedMessage.topic)}`"
            target="_blank"
            class="px-4 py-2 bg-[#001BB7] text-white rounded-lg hover:bg-[#0be93b] transition font-semibold shadow-sm hover:shadow-md"
          >
            Reply
          </a>

          <button
            @click="deleteRequest(selectedMessage._id)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-sm hover:shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { io } from 'socket.io-client';

export default {
  name: 'GuestSupport',
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
        const apiUrl =
          import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        const res = await axios.get(`${apiUrl}/guest-requests`, {
          params: { page: this.page, limit: this.limit },
        });

        this.messages = res.data.requests || [];
        this.totalPages = Math.ceil(res.data.total / this.limit);

        const requestId = this.$route.query.requestId;
        if (requestId) {
          const msg = this.messages.find((m) => m._id === requestId);
          if (msg) this.openModal(msg);
        }
      } catch (err) {
        console.error('Failed to load guest messages:', err);
        alert('Failed to load guest messages.');
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
      if (!confirm('Are you sure you want to delete this request?')) return;
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        await axios.delete(`${apiUrl}/guest-requests/${id}`);
        this.messages = this.messages.filter((m) => m._id !== id);
        this.closeModal();
      } catch (err) {
        console.error('Failed to delete request:', err);
        alert('Failed to delete request.');
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

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    this.socket = io(apiUrl);
    this.socket.on('new-guest-request', this.handleNewRequest);
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

