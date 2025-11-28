<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">All Experts</h1>
      <div class="flex items-center space-x-3">
        <label for="statusFilter" class="font-semibold">Filter Status:</label>
        <select
          id="statusFilter"
          v-model="statusFilter"
          class="border border-gray-300 rounded px-3 py-1"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- EXPERTS TABLE -->
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#001BB7] text-white">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Name</th>
            <th class="px-6 py-3 text-left font-semibold">Email</th>
            <th class="px-6 py-3 text-left font-semibold">Phone</th>
            <th class="px-6 py-3 text-left font-semibold">Status</th>
            <th class="px-6 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="expert in filteredExperts"
            :key="expert.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">{{ expert.name }}</td>
            <td class="px-6 py-4">{{ expert.email }}</td>
            <td class="px-6 py-4">{{ expert.phone || "N/A" }}</td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded font-semibold text-sm"
                :style="{
                  backgroundColor: statusColors[expert.status],
                  color: '#001BB7',
                }"
              >
                {{ formatStatus(expert.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <router-link
                :to="`/admin/expert-details/${expert.id}`"
                class="px-3 py-1 rounded-md bg-[#FF8040] text-[#001BB7] font-semibold hover:bg-[#FFA366] transition"
              >
                View
              </router-link>
            </td>
          </tr>
          <tr v-if="filteredExperts.length === 0">
            <td colspan="5" class="text-center px-6 py-4 text-gray-500">
              No experts found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/utils/api.js"; // Axios instance

// Filter selection
const statusFilter = ref("");

// Dummy data
const experts = ref([
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "0712345678",
    status: "pending",
  },
  {
    id: 2,
    name: "Mark Brown",
    email: "mark@example.com",
    phone: "0723456789",
    status: "approved",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "",
    status: "rejected",
  },
]);

const statusColors = {
  pending: "#FFA366",
  approved: "#00E676",
  rejected: "#FF3D00",
};

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

// Filtered experts list
const filteredExperts = computed(() => {
  if (!statusFilter.value) return experts.value;
  return experts.value.filter((e) => e.status === statusFilter.value);
});

// Fetch experts from API
const fetchExperts = async () => {
  try {
    // const { data } = await api.get('/admin/experts');
    // experts.value = data;
  } catch (err) {
    console.error("Failed to fetch experts:", err);
  }
};

onMounted(fetchExperts);
</script>

<style scoped></style>
