<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Client Activity Logs</h1>

    <!-- Search / Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by client name or action..."
        class="px-4 py-2 border rounded-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
      />

      <select
        v-model="filterAction"
        class="px-4 py-2 border rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
      >
        <option value="">All Actions</option>
        <option value="login">Login</option>
        <option value="post_job">Posted Job</option>
        <option value="message">Sent Message</option>
        <option value="payment">Made Payment</option>
      </select>
    </div>

    <!-- Logs Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead class="bg-[#001BB7] text-[#F5F1DC]">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Client Name</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Action</th>
            <th class="px-4 py-2 text-left">Date & Time</th>
            <th class="px-4 py-2 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(log, index) in filteredLogs"
            :key="log.id"
            class="border-b hover:bg-[#f5f5f5] transition-colors"
          >
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ log.clientName }}</td>
            <td class="px-4 py-2">{{ log.email }}</td>
            <td class="px-4 py-2 capitalize">{{ log.action }}</td>
            <td class="px-4 py-2">{{ formatDate(log.timestamp) }}</td>
            <td class="px-4 py-2">
              <button
                @click="viewDetails(log)"
                class="px-3 py-1 rounded-md bg-[#FF8040] text-[#001BB7] font-semibold hover:bg-[#FFA366] transition"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">No logs found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-11/12 sm:w-2/3 md:w-1/2 relative">
        <h2 class="text-xl font-bold mb-4">Log Details</h2>
        <p><strong>Client:</strong> {{ selectedLog.clientName }}</p>
        <p><strong>Email:</strong> {{ selectedLog.email }}</p>
        <p><strong>Action:</strong> {{ selectedLog.action }}</p>
        <p><strong>Date & Time:</strong> {{ formatDate(selectedLog.timestamp) }}</p>
        <p><strong>Additional Info:</strong> {{ selectedLog.details }}</p>

        <button
          @click="selectedLog = null"
          class="mt-4 px-4 py-2 bg-[#001BB7] text-[#F5F1DC] rounded-md hover:bg-[#0046FF] transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Dummy data
const logs = ref([
  {
    id: 1,
    clientName: "Alice Johnson",
    email: "alice@example.com",
    action: "login",
    timestamp: new Date(),
    details: "Logged in from web",
  },
  {
    id: 2,
    clientName: "Bob Smith",
    email: "bob@example.com",
    action: "post_job",
    timestamp: new Date(),
    details: "Posted a new research job",
  },
  {
    id: 3,
    clientName: "Charlie Lee",
    email: "charlie@example.com",
    action: "message",
    timestamp: new Date(),
    details: "Sent a message to Expert #23",
  },
  {
    id: 4,
    clientName: "Dana White",
    email: "dana@example.com",
    action: "payment",
    timestamp: new Date(),
    details: "Paid for Project #12",
  },
]);

const searchQuery = ref("");
const filterAction = ref("");
const selectedLog = ref(null);

// Filtered logs
const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const matchesQuery =
      log.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesAction = filterAction.value ? log.action === filterAction.value : true;
    return matchesQuery && matchesAction;
  });
});

// Helpers
const formatDate = (date) => new Date(date).toLocaleString();
const viewDetails = (log) => (selectedLog.value = log);
</script>

<style scoped>
/* Optional scroll for table */
table {
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #e2e8f0;
}
</style>
