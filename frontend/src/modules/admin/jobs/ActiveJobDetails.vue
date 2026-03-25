```vue
<template>
  <div class="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
    <!-- HEADER -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0"
    >
      <button
        @click="$router.back()"
        class="px-4 py-2 border rounded-lg bg-white shadow-sm hover:shadow-md text-blue-600 transition"
      >
        ← Back
      </button>

      <div class="flex flex-wrap items-center gap-3">
        <span
          class="px-4 py-1 rounded-full text-sm font-semibold"
          :class="healthBadge.class"
        >
          {{ healthBadge.label }}
        </span>

        <button
          @click="assignExpert(job)"
          :disabled="!!job.hiredExpertId"
          class="px-5 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          Assign Expert
        </button>

        <button
          @click="overrideAssignment"
          class="px-5 py-2 bg-yellow-600 text-white rounded-lg"
        >
          Override
        </button>

        <button
          @click="deleteJob(job._id)"
          class="px-5 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>

        <!-- ✅ PAYMENT BUTTON (FIXED PROPERLY) -->
        <!-- SAFE PAYMENT BUTTON -->
        <button
          v-if="project && !project.adminUnlocked"
          @click="confirmPayment(project._id)"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Confirm Payment & Unlock Project
        </button>

        <!-- LOADING STATE -->
        <span
          v-else-if="!project"
          class="px-4 py-1 rounded-full bg-gray-100 text-gray-500 text-sm"
        >
          Loading project...
        </span>

        <!-- CONFIRMED -->
        <span
          v-else
          class="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold"
        >
          Payment Confirmed
        </span>
      </div>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-gray-800">
      {{ job.title || "Job Details" }}
    </h1>

    <!-- KPI -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border">
        <h3 class="text-sm text-gray-500 mb-2">Progress</h3>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="h-4 rounded-full"
            :class="progressColor"
            :style="{ width: progressWidth }"
          ></div>
        </div>
        <p class="mt-2 text-sm">{{ progressText }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <h3 class="text-sm text-gray-500 mb-2">Budget</h3>
        <p class="text-2xl font-bold">
          {{ proposal?.quote ?? job.pricingRange?.min ?? "—" }}
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <h3 class="text-sm text-gray-500 mb-2">Delivery</h3>
        <p class="text-2xl text-blue-600">{{ deliveryText }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <h3 class="text-sm text-gray-500 mb-2">Risk</h3>
        <p class="text-2xl" :class="riskColor">{{ riskLabel }}</p>
      </div>
    </div>

    <!-- CLIENT / EXPERT / ADMIN -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border">
        <h2 class="text-xl mb-4">Client</h2>
        <p>Name: {{ job.client?.name || "—" }}</p>
        <p>Email: {{ job.client?.email || "—" }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <h2 class="text-xl mb-4">Expert</h2>
        <p>Name: {{ assignment?.expert?.name || "—" }}</p>
        <p>Email: {{ assignment?.expert?.email || "—" }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <h2 class="text-xl mb-4">Admin</h2>
        <p>Name: {{ authStore.user?.name || "—" }}</p>
        <p>Email: {{ authStore.user?.email || "—" }}</p>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="bg-white p-6 rounded-lg shadow border">
      <h2 class="text-xl mb-4">Description</h2>
      <p>{{ job.description || "No description provided" }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { adminApi } from "@/core/api/http";
import { useAuthStore } from "@/core/store/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const job = ref({});
const assignment = ref(null);
const proposal = ref(null);
const project = ref(null); // ✅ NEW

/* PROGRESS */
const progressValue = computed(() => {
  switch (job.value.status) {
    case "assigned":
      return 40;
    case "in_progress":
      return 60;
    case "in_review":
      return 70;
    case "completed":
      return 100;
    default:
      return 0;
  }
});

const progressText = computed(() => `${progressValue.value}%`);
const progressWidth = computed(() => `${progressValue.value}%`);

const progressColor = computed(() =>
  progressValue.value < 50
    ? "bg-yellow-500"
    : progressValue.value < 80
    ? "bg-blue-500"
    : "bg-green-600"
);

const deliveryText = computed(() =>
  assignment.value?.deliveryTime ? assignment.value.deliveryTime + " days" : "—"
);

const riskLabel = computed(() => (progressValue.value < 50 ? "Medium" : "Low"));

const riskColor = computed(() =>
  progressValue.value < 50 ? "text-yellow-600" : "text-green-600"
);

const healthBadge = computed(() =>
  progressValue.value < 50
    ? { label: "At Risk", class: "bg-yellow-100 text-yellow-700" }
    : { label: "Healthy", class: "bg-green-100 text-green-700" }
);

/* FETCH JOB */
const fetchJobDetails = async () => {
  try {
    const { data } = await adminApi.getJobById(route.params.jobId);

    job.value = data.data.job;
    assignment.value = data.data.assignment;
    proposal.value = data.data.proposal;
  } catch (err) {
    Swal.fire("Error", "Failed to load job", "error");
  }
};

/* FETCH PROJECT (CRITICAL FIX) */
const fetchProject = async () => {
  try {
    console.log("Fetching project for job:", route.params.jobId); // 👈 ADD

    const { data } = await adminApi.getProjectByJobId(route.params.jobId);

    console.log("PROJECT RESPONSE:", data); // 👈 ADD

    project.value = data.project;
  } catch (err) {
    console.error("❌ Project fetch failed", err.response || err); // 👈 IMPORTANT
  }
};

/* PAYMENT */
const confirmPayment = async (projectId) => {
  try {
    const { data } = await adminApi.confirmManualPayment(projectId);

    if (data.success) {
      Swal.fire("Success", data.message, "success");

      // ✅ Update project state
      project.value.adminUnlocked = true;
    }
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Failed to confirm payment",
      "error"
    );
  }
};

/* ACTIONS */
const assignExpert = (job) =>
  router.push({ name: "AssignExpert", params: { jobId: job._id } });

const overrideAssignment = async () => {
  Swal.fire("Override placeholder");
};

const deleteJob = async (id) => {
  const result = await Swal.fire({
    title: "Delete Job?",
    showCancelButton: true,
  });

  if (!result.isConfirmed) return;

  await adminApi.deleteJob(id);
  router.push({ name: "ActiveJobs" });
};

/* INIT */
onMounted(() => {
  fetchJobDetails();
  fetchProject(); // ✅ IMPORTANT
});
</script>
```
