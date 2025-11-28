<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">
        Client Details - {{ client.name }}
      </h1>
      <button
        class="px-4 py-2 rounded-md font-semibold text-[#001BB7]"
        style="background-color: #d4af37"
        @click="goBack"
      >
        Back
      </button>
    </div>

    <!-- CLIENT INFO -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Profile Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Name:</strong> {{ client.name }}</p>
        <p><strong>Email:</strong> {{ client.email }}</p>
        <p><strong>Phone:</strong> {{ client.phone || "N/A" }}</p>
        <p><strong>Company:</strong> {{ client.company || "N/A" }}</p>
        <p><strong>Registered At:</strong> {{ client.registeredAt }}</p>
        <p>
          <strong>Status:</strong>
          <span
            class="px-3 py-1 rounded-md font-semibold"
            :style="{
              backgroundColor: statusColors[client.status],
              color: '#001BB7',
            }"
          >
            {{ formatStatus(client.status) }}
          </span>
        </p>
      </div>
    </div>

    <!-- CLIENT JOBS -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Jobs Posted</h2>
      <table class="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-[#FF8040] text-[#001BB7]">
            <th class="px-4 py-2 border">Job Title</th>
            <th class="px-4 py-2 border">Expert</th>
            <th class="px-4 py-2 border">Status</th>
            <th class="px-4 py-2 border">Deadline</th>
            <th class="px-4 py-2 border">Progress</th>
            <th class="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in client.jobs"
            :key="job.id"
            class="text-center border-t border-gray-200 hover:bg-gray-100"
          >
            <td class="px-4 py-2">{{ job.title }}</td>
            <td class="px-4 py-2">{{ job.expert }}</td>
            <td class="px-4 py-2">{{ formatStatus(job.status) }}</td>
            <td class="px-4 py-2">{{ job.deadline }}</td>
            <td class="px-4 py-2">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="h-3 rounded-full transition-all"
                  :style="{
                    width: job.progress + '%',
                    backgroundColor: '#FF8040',
                  }"
                ></div>
              </div>
            </td>
            <td class="px-4 py-2">
              <button
                class="px-3 py-1 rounded-md font-semibold text-white"
                style="background-color: #001bb7"
                @click="viewJob(job.id)"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="client.jobs.length === 0">
            <td colspan="6" class="py-4 text-gray-500">No jobs found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CLIENT MESSAGES -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Messages / Support Tickets</h2>
      <div
        v-for="msg in client.messages"
        :key="msg.id"
        class="mb-4 p-3 rounded-md border border-gray-200"
      >
        <p class="font-semibold">
          {{ msg.subject }}
          <span class="text-gray-500 text-sm">({{ msg.timestamp }})</span>
        </p>
        <p class="mt-1 text-gray-700">{{ msg.text }}</p>
      </div>
      <div v-if="client.messages.length === 0" class="text-gray-500">
        No messages yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

/* ============================
   DUMMY DATA (API READY)
============================ */
const client = ref({
  id: route.params.id,
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+254712345678",
  company: "Acme Research Ltd.",
  registeredAt: "2025-01-01",
  status: "active",
  jobs: [
    {
      id: 1,
      title: "Market Research Analysis",
      expert: "Dr. Smith",
      status: "in-progress",
      deadline: "2025-02-05",
      progress: 60,
    },
    {
      id: 2,
      title: "Data Cleaning & Reporting",
      expert: "Prof. Adams",
      status: "awaiting-expert",
      deadline: "2025-02-10",
      progress: 30,
    },
  ],
  messages: [
    {
      id: 1,
      subject: "Question about Proposal",
      text: "When will the draft be ready?",
      timestamp: "2025-01-03",
    },
    {
      id: 2,
      subject: "Payment Issue",
      text: "I need invoice clarification.",
      timestamp: "2025-01-05",
    },
  ],
});

/* ============================
   STATUS COLOR MAPPING
============================ */
const statusColors = {
  active: "#00E676",
  pending: "#FFA366",
  suspended: "#FF8040",
};

/* ============================
   METHODS
============================ */
const formatStatus = (status) =>
  status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const goBack = () => router.push("/admin/clients-management");

const viewJob = (jobId) => router.push(`/admin/activejobs/${jobId}`);
</script>

<style scoped>
table th,
table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 0.5rem;
}
</style>
