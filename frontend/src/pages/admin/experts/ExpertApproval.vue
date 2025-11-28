<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">Expert Approvals</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, email, or skill..."
        class="px-4 py-2 rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
      />
    </div>

    <!-- STATUS FILTER -->
    <div class="flex gap-3 mb-6">
      <button
        v-for="status in statusOptions"
        :key="status.value"
        @click="filterStatus = status.value"
        class="px-4 py-2 rounded-md font-semibold transition"
        :class="{
          'bg-[#D4AF37] text-[#001BB7]': filterStatus === status.value,
          'bg-white text-[#001BB7] hover:bg-[#FF8040] hover:text-white':
            filterStatus !== status.value,
        }"
      >
        {{ status.label }}
      </button>
      <button
        class="px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300 text-[#001BB7]"
        @click="resetFilters"
      >
        Reset
      </button>
    </div>

    <!-- EXPERT TABLE -->
    <div class="bg-white rounded-lg shadow p-6">
      <table class="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-[#FF8040] text-[#001BB7]">
            <th class="px-4 py-2 border">Name</th>
            <th class="px-4 py-2 border">Email</th>
            <th class="px-4 py-2 border">Skills</th>
            <th class="px-4 py-2 border">Status</th>
            <th class="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expert in filteredExperts"
            :key="expert.id"
            class="text-center border-t border-gray-200 hover:bg-gray-100"
          >
            <td class="px-4 py-2">{{ expert.name }}</td>
            <td class="px-4 py-2">{{ expert.email }}</td>
            <td class="px-4 py-2">
              <span
                v-for="skill in expert.skills"
                :key="skill"
                class="px-2 py-1 bg-gray-200 rounded-full text-sm mx-1"
              >
                {{ skill }}
              </span>
            </td>
            <td class="px-4 py-2">
              <span
                class="px-3 py-1 rounded-md font-semibold"
                :style="{
                  backgroundColor: statusColors[expert.status],
                  color: '#001BB7',
                }"
              >
                {{ formatStatus(expert.status) }}
              </span>
            </td>
            <td class="px-4 py-2 space-x-2">
              <button
                class="px-3 py-1 rounded-md font-semibold text-white"
                style="background-color: #00e676"
                @click="approveExpert(expert.id)"
                :disabled="expert.status !== 'pending'"
              >
                Approve
              </button>
              <button
                class="px-3 py-1 rounded-md font-semibold text-white"
                style="background-color: #ff3d00"
                @click="rejectExpert(expert.id)"
                :disabled="expert.status !== 'pending'"
              >
                Reject
              </button>
            </td>
          </tr>
          <tr v-if="filteredExperts.length === 0">
            <td colspan="5" class="py-4 text-gray-500">No experts found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "@/utils/api.js"; // Axios instance

// Dummy data for experts
const experts = ref([
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    skills: ["Research", "Data Analysis"],
    status: "pending",
  },
  {
    id: 2,
    name: "Mark Brown",
    email: "mark@example.com",
    skills: ["Statistics", "Survey"],
    status: "pending",
  },
  {
    id: 3,
    name: "Sophia Lee",
    email: "sophia@example.com",
    skills: ["Qualitative Research"],
    status: "approved",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("all");

const statusColors = {
  pending: "#FFA366",
  approved: "#00E676",
  rejected: "#FF3D00",
};

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const filteredExperts = computed(() => {
  return experts.value
    .filter(
      (expert) => filterStatus.value === "all" || expert.status === filterStatus.value
    )
    .filter(
      (expert) =>
        expert.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expert.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expert.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    );
});

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const resetFilters = () => {
  filterStatus.value = "all";
  searchQuery.value = "";
};

// Actions
const approveExpert = async (id) => {
  const expert = experts.value.find((e) => e.id === id);
  if (!expert || expert.status !== "pending") return;

  // API call placeholder
  // await api.patch(`/admin/experts/${id}/approve`);
  expert.status = "approved";
  alert(`Expert ${expert.name} approved.`);
};

const rejectExpert = async (id) => {
  const expert = experts.value.find((e) => e.id === id);
  if (!expert || expert.status !== "pending") return;

  // API call placeholder
  // await api.patch(`/admin/experts/${id}/reject`);
  expert.status = "rejected";
  alert(`Expert ${expert.name} rejected.`);
};
</script>

<style scoped>
table th,
table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 0.5rem;
}
</style>
