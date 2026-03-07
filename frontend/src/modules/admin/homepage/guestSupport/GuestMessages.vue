<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-[#1A1A1A]">Guest Messages</h2>
        <p class="text-gray-500 mt-1">
          View and manage all incoming guest communications.
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 animate-pulse">Loading messages...</div>

    <!-- Empty State -->
    <div
      v-else-if="!messages.length"
      class="bg-white rounded-2xl shadow border border-gray-200 p-10 text-center"
    >
      <p class="text-gray-500 text-lg">No guest messages found.</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl shadow border border-gray-200">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4">Sender</th>
            <th class="p-4">Subject</th>
            <th class="p-4">Status</th>
            <th class="p-4">Date</th>
            <th class="p-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="msg in messages"
            :key="msg._id"
            class="border-b hover:bg-gray-50 cursor-pointer transition group"
            @click="openMessage(msg._id)"
          >
            <td class="p-4">
              <div class="font-semibold">{{ msg.name || "Guest" }}</div>
              <div class="text-sm text-gray-500">{{ msg.email }}</div>
            </td>

            <td class="p-4">
              <div class="font-medium">
                {{ msg.subject || "General Inquiry" }}
              </div>
              <div class="text-sm text-gray-500 truncate w-64">
                {{ msg.message }}
              </div>
            </td>

            <td class="p-4">
              <span :class="statusBadge(msg.status)">
                {{ msg.status || "new" }}
              </span>
            </td>

            <td class="p-4 text-gray-500 text-sm">
              {{ formatDate(msg.createdAt) }}
            </td>

            <!-- Click Indicator -->
            <td
              class="p-4 text-right text-sm font-medium text-purple-700 bg-green-200 group-hover:text-black transition"
            >
              Click to view →
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center p-4">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span class="font-semibold"> Page {{ page }} / {{ totalPages }} </span>

        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/core/api/http.js";

export default {
  name: "GuestMessagesList",
  data() {
    return {
      messages: [],
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
  },
  methods: {
    async fetchMessages() {
      this.loading = true;
      try {
        const res = await api.get("/admin/guest-messages", {
          params: { page: this.page, limit: this.limit },
        });

        this.messages = res.data.messages;
        this.totalPages = Math.ceil(res.data.total / this.limit);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    openMessage(id) {
      this.$router.push({
        name: "AdminGuestMessageDetails",
        params: { id },
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    statusBadge(status) {
      const base = "px-3 py-1 rounded-full text-xs font-semibold capitalize";

      const map = {
        new: "bg-blue-100 text-blue-700",
        replied: "bg-green-100 text-green-700",
      };

      return `${base} ${map[status] || "bg-gray-100 text-gray-700"}`;
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
  },
  mounted() {
    this.fetchMessages();
  },
};
</script>
