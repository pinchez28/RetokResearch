<template>
  <div class="min-h-screen bg-gradient-to-b from-primary-100 to-neutral-white p-4 md:p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button
        type="button"
        @click="$router.back()"
        class="flex items-center gap-2 px-4 py-3 bg-neutral-white border border-primary-200 rounded-xl shadow-float-md hover:bg-primary-100 transition"
      >
        ← Back to Jobs
      </button>

      <div>
        <h1 class="text-2xl font-bold text-primary-900">Job Applications</h1>
        <p class="text-primary-600 text-sm">Review expert applications for this job</p>
      </div>
    </div>

    <!-- Job Overview -->
    <div
      v-if="job._id"
      class="bg-neutral-white rounded-2xl border border-primary-200 shadow-float-md p-6 mb-8 animate-fadeUp"
    >
      <h2 class="text-xl font-bold text-primary-900 mb-2">
        {{ job.title }}
      </h2>

      <p class="text-primary-700 mb-4">
        {{ job.description }}
      </p>

      <div class="flex flex-wrap gap-4 text-sm text-primary-600">
        <span>
          Deadline:
          {{ job.deadline ? new Date(job.deadline).toLocaleDateString() : "-" }}
        </span>

        <span
          class="px-3 py-1 rounded-full font-semibold"
          :class="badgeClass(job.status)"
        >
          {{ formatStatus(job.status) }}
        </span>
      </div>

      <!-- Hired Expert -->
      <div
        v-if="job.hiredExpert"
        class="mt-6 p-4 bg-primary-100 border border-primary-200 rounded-xl flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-400">
          <img
            v-if="job.hiredExpert.photo"
            :src="resolvePhoto(job.hiredExpert.photo)"
            class="w-full h-full object-cover"
          />

          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-primary-200 font-bold text-primary-800"
          >
            {{ job.hiredExpert.name?.charAt(0) || "E" }}
          </div>
        </div>

        <div>
          <p class="font-semibold text-primary-900">
            {{ job.hiredExpert.name || "—" }}
          </p>

          <p class="text-sm text-primary-600">
            {{ job.hiredExpert.specialization || "Expert" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-primary-200 border-t-accent-500 rounded-full animate-spin mx-auto"
      ></div>

      <p class="mt-4 text-primary-600">Loading applications…</p>
    </div>

    <!-- Empty -->
    <div
      v-else-if="applications.length === 0"
      class="bg-neutral-white rounded-2xl border border-primary-200 p-8 text-center text-primary-500 shadow-float-md"
    >
      No applications yet.
    </div>

    <!-- Applications -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="app in applications"
        :key="app._id"
        class="bg-neutral-white rounded-2xl border border-primary-200 shadow-float-md hover:shadow-xl transition"
      >
        <div class="p-6 border-b border-primary-200 flex justify-between items-start">
          <div class="flex gap-4 items-center">
            <div class="w-12 h-12 rounded-full overflow-hidden border border-primary-200">
              <img
                v-if="app.expertSnapshot?.photo"
                :src="resolvePhoto(app.expertSnapshot.photo)"
                class="w-full h-full object-cover"
              />

              <div
                v-else
                class="w-full h-full bg-primary-100 flex items-center justify-center font-bold text-primary-700"
              >
                {{ app.expertSnapshot?.name?.charAt(0) || "E" }}
              </div>
            </div>

            <div>
              <h3 class="font-bold text-primary-900">
                {{ app.expertSnapshot?.name || "Unknown" }}
              </h3>

              <p class="text-sm text-primary-600">
                {{ app.expertSnapshot?.specialization || "—" }}
              </p>
            </div>
          </div>

          <div class="text-right">
            <p class="text-lg font-bold text-primary-900">
              KES {{ Number(app.quote || 0).toLocaleString() }}
            </p>

            <p class="text-xs text-primary-400">
              {{ app.submittedAt ? formatRelativeDate(app.submittedAt) : "-" }}
            </p>
          </div>
        </div>

        <div class="p-6">
          <p class="text-primary-700 text-sm mb-4">
            {{ app.proposalText || "-" }}
          </p>

          <div class="flex flex-wrap gap-3">
            <BaseButton @click="viewProposal(app)"> View Proposal </BaseButton>

            <BaseButton
              outlined
              :disabled="!app.expertSnapshot?.cvPdf"
              @click="viewCv(app)"
            >
              {{ app.expertSnapshot?.cvPdf ? "View CV" : "CV Not Uploaded" }}
            </BaseButton>

            <BaseButton
              :disabled="!canHire || hiring"
              class="bg-accent-500 text-primary-900 hover:bg-accent-400 disabled:bg-primary-200 disabled:text-primary-500"
              @click="handleHire(app)"
            >
              {{ job.hiredExpert ? "Expert Hired" : "Hire Expert" }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { clientApi } from "@/core/api/http";
import BaseButton from "@/components/ui/BaseButton.vue";
import {
  initNotificationSocket,
  getNotificationSocket,
} from "@/core/socket/notificationSocket";

const route = useRoute();
const router = useRouter();
const backendURL = import.meta.env.VITE_API_BASE_URL || "";

/* ---------------- State ---------------- */

const job = ref({
  _id: null,
  title: "",
  description: "",
  status: "",
  deadline: null,
  hiredExpert: null,
  applications: [],
});

const applications = ref([]);
const loading = ref(false);
const hiring = ref(false);

/* ---------------- Helpers ---------------- */

const resolvePhoto = (p) => (p?.startsWith("http") ? p : `${backendURL}${p}`);

const formatStatus = (s) => s?.replace(/_/g, " ").toUpperCase();

const badgeClass = (s) =>
  s === "in_progress" || s === "assigned"
    ? "bg-accent-300 text-primary-900"
    : "bg-primary-100 text-primary-700";

const formatRelativeDate = (d) => {
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  return diff === 0 ? "Today" : `${diff} days ago`;
};

/* ---------------- Computed ---------------- */

const canHire = computed(() => {
  return job.value?.status === "approved_for_bidding" && !job.value?.hiredExpert;
});

/* ---------------- API ---------------- */

const fetchJob = async () => {
  loading.value = true;

  try {
    const { data } = await clientApi.getJobById(route.params.jobId);

    job.value = {
      ...job.value,
      ...data.job,
      hiredExpert: data.job.hiredExpert || null,
      applications: data.job.applications || [],
    };

    applications.value = job.value.applications;
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load job", "error");
  } finally {
    loading.value = false;
  }
};

/* ---------------- Actions ---------------- */

const viewProposal = (app) => {
  router.push({
    name: "ClientProposalView",
    params: {
      jobId: job.value._id,
      expertId: app.expertSnapshot?.expertId,
    },
  });
};

const viewCv = (app) => {
  router.push({
    name: "ClientCvViewer",
    params: {
      jobId: job.value._id,
      expertId: app.expertSnapshot?.expertId,
    },
  });
};

const handleHire = async (app) => {
  if (!job.value?._id) return;
  if (!canHire.value || hiring.value) return;

  hiring.value = true;

  const previousHired = job.value.hiredExpert;

  job.value.hiredExpert = app.expertSnapshot;

  try {
    const { data } = await clientApi.hireExpert(job.value._id, {
      expertId: app.expertSnapshot?.expertId,
      applicationId: app._id,
    });

    if (data?.assignment) {
      job.value.hiredExpert = data.assignment.expertSnapshot || app.expertSnapshot;

      if (data.assignment.applications) {
        applications.value = data.assignment.applications;
        job.value.applications = data.assignment.applications;
      }
    }

    Swal.fire("Success", "Expert hired successfully", "success");
  } catch (err) {
    job.value.hiredExpert = previousHired;

    Swal.fire("Error", err.response?.data?.message || "Hire failed", "error");
  } finally {
    hiring.value = false;
  }
};

/* ---------------- Socket ---------------- */

onMounted(() => {
  fetchJob();

  initNotificationSocket({ role: "Client" });

  const socket = getNotificationSocket();

  socket?.on("job:hired", ({ jobId, job: updated }) => {
    if (jobId === route.params.jobId) {
      job.value = {
        ...job.value,
        ...updated,
        hiredExpert: updated.hiredExpert || null,
        applications: updated.applications || [],
      };

      applications.value = job.value.applications;
    }
  });
});

onUnmounted(() => {
  getNotificationSocket()?.off("job:hired");
});
</script>
