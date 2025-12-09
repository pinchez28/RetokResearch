<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">Expert Details</h1>
      <button
        @click="$router.back()"
        class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-semibold"
      >
        Back
      </button>
    </div>

    <!-- EXPERT INFO -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left: Basic Info -->
        <div class="space-y-3">
          <h2 class="text-xl font-semibold">Basic Information</h2>
          <p><strong>Name:</strong> {{ expert.name }}</p>
          <p><strong>Email:</strong> {{ expert.email }}</p>
          <p><strong>Phone:</strong> {{ expert.phone || "N/A" }}</p>
          <p><strong>Location:</strong> {{ expert.location || "N/A" }}</p>
          <p>
            <strong>Status:</strong>
            <span
              class="px-3 py-1 rounded-md font-semibold"
              :style="{
                backgroundColor: statusColors[expert.status],
                color: '#001BB7',
              }"
            >
              {{ formatStatus(expert.status) }}
            </span>
          </p>
        </div>

        <!-- Right: Skills -->
        <div class="space-y-3">
          <h2 class="text-xl font-semibold">Skills & Expertise</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in expert.skills"
              :key="skill"
              class="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {{ skill }}
            </span>
          </div>

          <h2 class="text-xl font-semibold mt-4">Portfolio / Projects</h2>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(proj, index) in expert.projects" :key="index">
              {{ proj }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- APPROVE / REJECT ACTIONS -->
    <div class="flex gap-4">
      <button
        class="px-4 py-2 rounded-md font-semibold text-white"
        style="background-color: #00e676"
        @click="approveExpert(expert.id)"
        :disabled="expert.status !== 'pending'"
      >
        Approve
      </button>
      <button
        class="px-4 py-2 rounded-md font-semibold text-white"
        style="background-color: #ff3d00"
        @click="rejectExpert(expert.id)"
        :disabled="expert.status !== 'pending'"
      >
        Reject
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/utils/api.js"; // Axios instance

const route = useRoute();
const expertId = route.params.id;

// Dummy data placeholder
const expertsData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "0712345678",
    location: "Nairobi, Kenya",
    skills: ["Research", "Data Analysis", "Statistics"],
    projects: ["Survey Project A", "Data Analysis B"],
    status: "pending",
  },
  {
    id: 2,
    name: "Mark Brown",
    email: "mark@example.com",
    phone: "0723456789",
    location: "Mombasa, Kenya",
    skills: ["Survey", "Qualitative Research"],
    projects: ["Project X", "Project Y"],
    status: "approved",
  },
];

const expert = ref({
  id: 0,
  name: "",
  email: "",
  phone: "",
  location: "",
  skills: [],
  projects: [],
  status: "pending",
});

const statusColors = {
  pending: "#FFA366",
  approved: "#00E676",
  rejected: "#FF3D00",
};

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const loadExpert = async () => {
  // API call placeholder
  // const { data } = await api.get(`/admin/experts/${expertId}`);
  // expert.value = data;

  // Using dummy data
  const found = expertsData.find((e) => e.id === parseInt(expertId));
  if (found) expert.value = found;
};

const approveExpert = async (id) => {
  if (expert.value.status !== "pending") return;

  // API placeholder
  // await api.patch(`/admin/experts/${id}/approve`);
  expert.value.status = "approved";
  alert(`Expert ${expert.value.name} approved.`);
};

const rejectExpert = async (id) => {
  if (expert.value.status !== "pending") return;

  // API placeholder
  // await api.patch(`/admin/experts/${id}/reject`);
  expert.value.status = "rejected";
  alert(`Expert ${expert.value.name} rejected.`);
};

onMounted(loadExpert);
</script>

<style scoped></style>

