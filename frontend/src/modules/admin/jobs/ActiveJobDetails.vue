<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">Job Details - {{ job.title }}</h1>
      <button
        class="px-4 py-2 rounded-md font-semibold text-[#001BB7]"
        style="background-color: #d4af37"
        @click="goBack"
      >
        Back
      </button>
    </div>

    <!-- JOB SUMMARY -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p><strong>Client:</strong> {{ job.client }}</p>
          <p><strong>Expert:</strong> {{ job.expert }}</p>
          <p>
            <strong>Status:</strong>
            <span
              class="px-3 py-1 rounded-md font-semibold"
              :style="{
                backgroundColor: statusColors[job.status],
                color: '#001BB7',
              }"
            >
              {{ formatStatus(job.status) }}
            </span>
          </p>
        </div>
        <div>
          <p><strong>Deadline:</strong> {{ job.deadline }}</p>
          <p><strong>Progress:</strong></p>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all"
              :style="{ width: job.progress + '%', backgroundColor: '#FF8040' }"
            ></div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <p class="font-semibold">Description:</p>
        <p class="text-gray-700 mt-1 leading-relaxed">{{ job.description }}</p>
      </div>
    </div>

    <!-- FILE ATTACHMENTS -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Files & Attachments</h2>
      <ul class="space-y-2">
        <li
          v-for="file in job.files"
          :key="file.id"
          class="flex justify-between items-center bg-gray-100 p-2 rounded"
        >
          <span>{{ file.name }}</span>
          <a
            :href="file.url"
            target="_blank"
            class="px-3 py-1 rounded-md text-white"
            style="background-color: #001bb7"
          >
            Download
          </a>
        </li>
        <li v-if="job.files.length === 0" class="text-gray-500">
          No files uploaded yet.
        </li>
      </ul>
    </div>

    <!-- TIMELINE / MESSAGES -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Job Timeline / Messages</h2>
      <div
        v-for="msg in job.messages"
        :key="msg.id"
        class="mb-4 p-3 rounded-md border border-gray-200"
      >
        <p class="font-semibold">
          {{ msg.sender }}
          <span class="text-gray-500 text-sm">({{ msg.timestamp }})</span>
        </p>
        <p class="mt-1 text-gray-700">{{ msg.text }}</p>
      </div>
      <div v-if="job.messages.length === 0" class="text-gray-500">No messages yet.</div>
    </div>

    <!-- ADMIN CONTROLS -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold mb-4">Admin Controls</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="font-semibold mb-1 block">Update Status</label>
          <select v-model="job.status" class="px-3 py-2 border rounded-md w-full">
            <option value="in-progress">In Progress</option>
            <option value="awaiting-client">Awaiting Client</option>
            <option value="awaiting-expert">Awaiting Expert</option>
            <option value="revision">Revision</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label class="font-semibold mb-1 block">Assign Expert</label>
          <select v-model="job.expert" class="px-3 py-2 border rounded-md w-full">
            <option v-for="expert in experts" :key="expert.id" :value="expert.name">
              {{ expert.name }}
            </option>
          </select>
        </div>
      </div>

      <button
        class="px-4 py-2 rounded-md font-semibold text-[#001BB7]"
        style="background-color: #ff8040"
        @click="updateJob"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

/* ============================
   DUMMY DATA (API READY)
============================ */
const job = ref({
  id: route.params.id,
  title: "Research Proposal Writing",
  client: "John Doe",
  expert: "Dr. Smith",
  status: "in-progress",
  deadline: "2025-02-05",
  progress: 65,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.",
  files: [
    { id: 1, name: "Proposal.docx", url: "#" },
    { id: 2, name: "Data.xlsx", url: "#" },
  ],
  messages: [
    {
      id: 1,
      sender: "Client",
      text: "Please start ASAP",
      timestamp: "2025-01-01",
    },
    {
      id: 2,
      sender: "Expert",
      text: "Sure, I will begin today.",
      timestamp: "2025-01-02",
    },
  ],
});

/* ============================
   EXPERT DUMMY DATA
============================ */
const experts = ref([
  { id: 1, name: "Dr. Smith" },
  { id: 2, name: "Prof. Adams" },
  { id: 3, name: "Tutor Alex" },
]);

/* ============================
   STATUS COLOR MAPPING
============================ */
const statusColors = {
  "in-progress": "#FFA366",
  "awaiting-client": "#D4AF37",
  "awaiting-expert": "#FF8040",
  revision: "#0046FF",
  completed: "#00E676",
};

const formatStatus = (status) =>
  status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/* ============================
   METHODS
============================ */
const goBack = () => router.push("/admin/activejobs");

const updateJob = async () => {
  try {
    // API call placeholder
    // await api.put(`/admin/active-jobs/${job.value.id}`, job.value);
    alert("Job updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update job.");
  }
};
</script>

<style scoped>
/* Table / Grid styling, colors handled inline */
</style>

