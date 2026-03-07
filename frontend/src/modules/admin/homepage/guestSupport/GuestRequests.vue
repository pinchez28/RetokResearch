<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-[#1A1A1A]">Guest Requests</h2>
        <p class="text-gray-500 mt-1">Manage and track all guest service requests.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 animate-pulse">Loading requests...</div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl shadow border border-gray-200">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4">Client</th>
            <th class="p-4">Service</th>
            <th class="p-4">Status</th>
            <th class="p-4">Progress</th>
            <th class="p-4">Price</th>
            <th class="p-4">Created</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="req in requests"
            :key="req._id"
            class="border-b hover:bg-gray-50 cursor-pointer transition"
            @click="$router.push(`/admin/guest-support/requests/${req._id}`)"
          >
            <td class="p-4">
              <div class="font-semibold">{{ req.guest?.name }}</div>
              <div class="text-sm text-gray-500">{{ req.guest?.email }}</div>
            </td>

            <td class="p-4">
              {{ req.serviceType || "Not Assigned" }}
            </td>

            <td class="p-4">
              <span :class="statusBadge(req.status)">
                {{ req.status }}
              </span>
            </td>

            <td class="p-4 w-48">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  :style="{ width: (req.progress || 0) + '%' }"
                ></div>
              </div>
              <span class="text-xs text-gray-500"> {{ req.progress || 0 }}% </span>
            </td>

            <td class="p-4 font-medium">KES {{ req.price || 0 }}</td>

            <td class="p-4 text-gray-500 text-sm">
              {{ formatDate(req.createdAt) }}
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
  name: "GuestRequestList",
  data() {
    return {
      requests: [],
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
  },
  methods: {
    async fetchRequests() {
      this.loading = true;
      try {
        const res = await api.get("/admin/guest-requests", {
          params: { page: this.page, limit: this.limit },
        });

        this.requests = res.data.requests;
        this.totalPages = Math.ceil(res.data.total / this.limit);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    statusBadge(status) {
      const base = "px-3 py-1 rounded-full text-xs font-semibold capitalize";

      const map = {
        new: "bg-blue-100 text-blue-700",
        in_progress: "bg-yellow-100 text-yellow-700",
        work_ready: "bg-purple-100 text-purple-700",
        completed: "bg-green-100 text-green-700",
      };

      return `${base} ${map[status] || "bg-gray-100 text-gray-700"}`;
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchRequests();
      }
    },

    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchRequests();
      }
    },
  },
  mounted() {
    this.fetchRequests();
  },
};
</script>
