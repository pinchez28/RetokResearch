<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Assign Expert</h1>
        <p class="text-gray-500 mt-1">Select an approved expert to assign to this job</p>
      </div>

      <button
        @click="goBack"
        class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div
        class="animate-spin h-10 w-10 border-4 border-[#001BB7] border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!experts.length"
      class="bg-white rounded-lg shadow p-8 text-center text-gray-500"
    >
      No approved experts available.
    </div>

    <!-- Experts Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left">Name</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Specialization</th>
            <th class="px-4 py-3 text-center">Rating</th>
            <th class="px-4 py-3 text-center">Status</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="expert in experts"
            :key="expert._id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-3 font-semibold">{{ expert.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ expert.email }}</td>
            <td class="px-4 py-3">{{ expert.specialization || "—" }}</td>
            <td class="px-4 py-3 text-center">{{ expert.rating ?? "—" }}</td>
            <td class="px-4 py-3 text-center">
              <span
                v-if="job.hiredExpertId && job.hiredExpertId._id === expert._id"
                title="This expert is already assigned"
                class="text-green-600 font-semibold"
              >
                Assigned
              </span>
              <span v-else>Available</span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                :disabled="assigningId === expert._id || job.hiredExpertId"
                @click="assign(expert)"
                class="px-4 py-1.5 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
              >
                {{
                  assigningId === expert._id
                    ? "Assigning..."
                    : job.hiredExpertId
                    ? "Assigned"
                    : "Assign"
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Optional: show assigned expert info above table -->
      <div
        v-if="job.hiredExpertId"
        class="mt-4 p-4 bg-green-50 rounded-md text-green-800"
      >
        Assigned Expert: <strong>{{ job.hiredExpertId.name }}</strong> ({{
          job.hiredExpertId.email
        }}) <br />
        Assigned At: {{ formatDate(job.assignedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { adminApi } from "@/core/api/http";

const route = useRoute();
const router = useRouter();

const jobId = route.params.jobId;

const job = ref({});
const experts = ref([]);
const loading = ref(true);
const assigningId = ref(null);

/* ---------------- FETCH JOB & EXPERTS ---------------- */
const fetchJobAndExperts = async () => {
  loading.value = true;
  try {
    // Fetch job details
    const jobRes = await adminApi.getJobById(jobId);
    job.value = jobRes.data?.data || {};

    // Fetch approved experts
    const expertsRes = await adminApi.getApprovedExperts();
    experts.value = expertsRes.data?.data || [];

    // Optional: remove the already assigned expert from the list
    if (job.value.hiredExpertId) {
      experts.value = experts.value.filter((e) => e._id !== job.value.hiredExpertId._id);
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load job or experts", "error");
  } finally {
    loading.value = false;
  }
};

/* ---------------- ASSIGN ---------------- */
const assign = async (expert) => {
  const confirm = await Swal.fire({
    title: "Assign Expert?",
    html: `<strong>${expert.name}</strong><br/>This expert will be assigned to this job.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Assign",
  });

  if (!confirm.isConfirmed) return;

  assigningId.value = expert._id;

  try {
    const res = await adminApi.assignExpert(jobId, expert._id);
    job.value = res.data.data; // update job object after assignment

    Swal.fire("Assigned!", "Expert has been successfully assigned.", "success");
  } catch (err) {
    console.error("Assign error:", err.response?.data || err);
    Swal.fire("Error", err.response?.data?.message || "Failed to assign expert", "error");
  } finally {
    assigningId.value = null;
  }
};

/* ---------------- NAV ---------------- */
const goBack = () => {
  router.back();
};

/* ---------------- OPTIONAL: DATE FORMAT ---------------- */
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleString();
};

onMounted(fetchJobAndExperts);
</script>
