<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Active Jobs</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#001BB7]"
      ></div>
      <p class="mt-2 text-gray-600">Loading jobs...</p>
    </div>

    <div v-else>
      <!-- Large Screens: Table -->
      <div class="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left">Title</th>
              <th class="px-4 py-3 text-left">Client</th>
              <th class="px-4 py-3 text-left">Expert</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Deadline</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="job in jobs" :key="job._id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-semibold">{{ job.title }}</td>
              <td class="px-4 py-3">{{ job.client?.name || "—" }}</td>
              <td class="px-4 py-3">
                {{ job.hiredExpertId?.name || "Unassigned" }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-3 py-1 rounded-md text-sm font-semibold"
                  :style="{
                    backgroundColor: statusColors[job.status] || '#ccc',
                    color: '#001BB7',
                  }"
                >
                  {{ formatStatus(job.status) }}
                </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(job.deadline) }}</td>
              <td class="px-4 py-3 text-center">
                <button
                  @click="viewJob(job._id)"
                  class="px-4 py-1 rounded-md bg-[#FF8040] hover:bg-[#26c506] text-gray-900 uppercase font-extrabold"
                >
                  View
                </button>
              </td>
            </tr>

            <tr v-if="!jobs.length">
              <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                No active jobs found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Small & Medium Screens: Cards -->
      <div class="lg:hidden grid gap-4">
        <div
          v-for="job in jobs"
          :key="job._id"
          class="bg-white rounded-lg shadow p-4 space-y-2 border border-gray-200"
        >
          <div class="flex justify-between items-center">
            <h2 class="font-semibold text-lg">{{ job.title }}</h2>
            <span
              class="px-2 py-1 rounded text-sm font-semibold"
              :style="{
                backgroundColor: statusColors[job.status] || '#ccc',
                color: '#001BB7',
              }"
            >
              {{ formatStatus(job.status) }}
            </span>
          </div>
          <p><strong>Client:</strong> {{ job.client?.name || "—" }}</p>
          <p>
            <strong>Expert:</strong>
            {{ job.hiredExpertId?.name || "Unassigned" }}
          </p>
          <p><strong>Deadline:</strong> {{ formatDate(job.deadline) }}</p>
          <button
            @click="viewJob(job._id)"
            class="w-full px-4 py-2 rounded-md bg-[#FF8040] hover:bg-[#26c506] text-gray-900 font-extrabold"
          >
            View
          </button>
        </div>

        <div v-if="!jobs.length" class="text-center text-gray-500 col-span-full">
          No active jobs found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { adminApi } from "@/core/api/http.js";

const router = useRouter();
const jobs = ref([]);
const loading = ref(true);

const statusColors = {
  in_progress: "#FFA366",
  approved_for_bidding: "#D4AF37",
  assigned: "#FF8040",
  revision: "#0046FF",
  completed: "#00E676",
};

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");
const formatStatus = (status) =>
  status?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

const fetchActiveJobs = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getActiveJobs();
    jobs.value = res.data?.data || [];
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load active jobs", "error");
  } finally {
    loading.value = false;
  }
};

const viewJob = (jobId) => {
  router.push({ name: "ActiveJobDetails", params: { jobId } });
};

onMounted(fetchActiveJobs);
</script>
