<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-100 to-neutral-white p-4 md:p-6"
  >
    <!-- Back Button -->
    <button
      type="button"
      @click="$router.back()"
      class="flex items-center gap-2 px-5 py-3 mb-8 bg-neutral-white rounded-xl border border-primary-200 shadow-float-md hover:bg-primary-100 transition-all duration-200 text-primary-700 font-medium group"
    >
      <svg
        class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Applications
    </button>

    <!-- Loading -->
    <div
      v-if="loading"
      class="max-w-4xl mx-auto bg-neutral-white rounded-2xl shadow-float-md p-12 text-center"
    >
      <div class="inline-flex flex-col items-center justify-center">
        <div
          class="w-16 h-16 border-4 border-primary-200 border-t-accent-500 rounded-full animate-spin mb-6"
        ></div>
        <h3 class="text-xl font-semibold text-primary-900 mb-2">Loading Proposal</h3>
        <p class="text-primary-600">Fetching proposal details…</p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="max-w-4xl mx-auto">
      <div
        class="bg-primary-100 rounded-2xl shadow-float-md p-8 border-l-4 border-accent-500"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-accent-300 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-primary-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-primary-900">Unable to Load Proposal</h3>
        </div>

        <p class="text-primary-700 mb-6">{{ error }}</p>

        <button
          @click="fetchProposal"
          class="px-6 py-3 bg-accent-500 text-primary-900 font-semibold rounded-lg hover:bg-accent-400 transition-colors shadow-float-md"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main -->
    <div v-if="proposal" class="max-w-6xl mx-auto space-y-8 animate-fadeUp">
      <!-- Header -->
      <div
        class="bg-primary-900 rounded-2xl shadow-float-md p-6 text-primary-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl text-primary-100 font-bold mb-1">Proposal Review</h1>
          <p class="text-primary-300 opacity-90">{{ job.title }}</p>
        </div>

        <div class="inline-flex items-center gap-2 bg-primary-600 rounded-xl px-4 py-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <span class="text-sm font-medium">
            Submitted {{ formatRelativeDate(proposal.submittedAt) }}
          </span>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Expert -->
        <div class="lg:col-span-1">
          <div
            class="bg-neutral-white rounded-2xl shadow-float-md p-6 sticky top-8 space-y-6"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-200 shadow-float-md mb-4"
              >
                <img
                  v-if="proposal.expertSnapshot.photo"
                  :src="resolvePhoto(proposal.expertSnapshot.photo)"
                  class="w-full h-full object-cover"
                />

                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-primary-100 font-bold text-primary-700 text-3xl"
                >
                  {{ proposal.expertSnapshot.name?.charAt(0) || "E" }}
                </div>
              </div>

              <h3 class="text-xl font-bold text-primary-900 mb-1">
                {{ proposal.expertSnapshot.name }}
              </h3>

              <p class="text-primary-600">
                {{ proposal.expertSnapshot.specialization || "Expert" }}
              </p>

              <p
                v-if="proposal.expertSnapshot.bio"
                class="text-primary-700 text-sm mt-2 text-center"
              >
                {{ proposal.expertSnapshot.bio }}
              </p>
            </div>

            <!-- CV -->
            <div v-if="proposal.expertSnapshot.cvPdf">
              <h4
                class="text-sm font-semibold text-primary-700 mb-3 uppercase tracking-wider"
              >
                Curriculum Vitae
              </h4>

              <a
                :href="resolvePhoto(proposal.expertSnapshot.cvPdf)"
                target="_blank"
                class="flex items-center justify-between group p-4 bg-primary-100 rounded-xl hover:bg-primary-200 transition border border-primary-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-primary-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p class="font-medium text-primary-900">View CV</p>
                    <p class="text-xs text-primary-500">PDF Document</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Proposal -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-neutral-white rounded-2xl shadow-float-md overflow-hidden">
            <div class="border-b border-primary-200 px-6 py-4">
              <h2 class="text-xl font-bold text-primary-900">Proposal Overview</h2>
            </div>

            <div class="p-6 text-primary-700">
              <p>{{ proposal.proposalText }}</p>
            </div>
          </div>

          <!-- Finance -->
          <div class="bg-neutral-white rounded-2xl shadow-float-md overflow-hidden">
            <div class="border-b border-primary-200 px-6 py-4">
              <h2 class="text-xl font-bold text-primary-900">Financial Details</h2>
            </div>

            <div
              class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div>
                <h3 class="text-lg font-semibold text-primary-800 mb-1">Quoted Price</h3>
                <p class="text-primary-600 text-sm">All-inclusive proposal amount</p>
              </div>

              <div
                class="bg-primary-100 p-6 rounded-xl border border-primary-200 min-w-[250px] text-center space-y-3"
              >
                <div>
                  <p class="text-sm text-primary-600">Total Proposal Value</p>
                  <p class="text-3xl font-extrabold text-primary-900">
                    KES {{ Number(proposal.quote).toLocaleString() }}
                  </p>
                </div>

                <div class="border-t border-primary-200 pt-3">
                  <p class="text-sm text-primary-600">Estimated Delivery</p>
                  <p class="text-lg font-semibold text-primary-700">
                    {{ proposal.estimatedDeliveryDays }} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Job -->
          <div class="bg-neutral-white rounded-2xl shadow-float-md overflow-hidden">
            <div class="border-b border-primary-200 px-6 py-4">
              <h2 class="text-xl font-bold text-primary-900">Job Information</h2>
            </div>

            <div class="p-6 space-y-4">
              <div>
                <h3 class="font-semibold text-primary-900 mb-1 text-lg">Project Title</h3>

                <p
                  class="text-primary-700 bg-primary-100 p-4 rounded-lg border border-primary-200"
                >
                  {{ job.title }}
                </p>
              </div>

              <div>
                <h3 class="font-semibold text-primary-900 mb-1 text-lg">
                  Project Description
                </h3>

                <p
                  class="text-primary-700 bg-primary-100 p-4 rounded-lg border border-primary-200"
                >
                  {{ job.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Hire -->
          <div class="flex justify-end mt-2">
            <button
              :disabled="!canHire || hiring"
              @click="handleHire(proposal)"
              class="px-6 py-3 rounded-xl font-semibold text-primary-900 transition shadow-float-md bg-accent-500 hover:bg-accent-400 disabled:bg-primary-200 disabled:text-primary-500"
            >
              {{
                job.status === "assigned" || job.status === "in_progress"
                  ? "Expert Hired"
                  : "Hire Expert"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { clientApi } from "@/core/api/http";

const route = useRoute();
const backendURL = import.meta.env.VITE_API_BASE_URL || "";

/* ---------------- STATE ---------------- */
const job = ref(null);
const proposal = ref(null);
const loading = ref(true);
const error = ref("");
const hiring = ref(false);

/* ---------------- HELPERS ---------------- */
const resolvePhoto = (p) => {
  if (!p) return "";
  return p.startsWith("http") ? p : `${backendURL}${p}`;
};

const formatRelativeDate = (date) => {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
};

/* ---------------- COMPUTED ---------------- */
const canHire = computed(() => {
  if (!job.value || !proposal.value) return false;

  return job.value.status === "approved_for_bidding" && !hiring.value;
});

/* ---------------- FETCH PROPOSAL ---------------- */
const fetchProposal = async () => {
  loading.value = true;
  error.value = "";

  const jobId = route.params.jobId;
  const expertId = route.params.expertId;

  try {
    const { data } = await clientApi.getJobById(jobId);

    if (!data?.job) {
      throw new Error("Job not found");
    }

    job.value = data.job;

    const found = data.job.applications?.find(
      (app) => app.expertSnapshot?.expertId === expertId
    );

    if (!found) {
      error.value = "The requested proposal could not be found.";
      return;
    }

    proposal.value = found;
  } catch (err) {
    console.error("Fetch proposal error:", err);
    error.value =
      err.response?.data?.message || err.message || "Failed to load proposal.";
  } finally {
    loading.value = false;
  }
};

/* ---------------- HIRE EXPERT ---------------- */
const handleHire = async () => {
  if (!canHire.value) return;

  const confirm = await Swal.fire({
    title: "Hire Expert?",
    text: `Are you sure you want to hire ${proposal.value.expertSnapshot?.name}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, hire",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#22c55e",
    cancelButtonColor: "#ef4444",
  });

  if (!confirm.isConfirmed) return;

  hiring.value = true;

  const previousStatus = job.value.status;
  const previousExpert = job.value.hiredExpert;

  /* optimistic UI */
  job.value.status = "in_progress";
  job.value.hiredExpert = proposal.value.expertSnapshot;

  try {
    const { data } = await clientApi.hireExpert(job.value._id, {
      expertId: proposal.value.expertSnapshot.expertId,
      applicationId: proposal.value._id,
    });

    if (!data?.assignment) {
      throw new Error("Assignment failed");
    }

    job.value = {
      ...job.value,
      ...data.assignment.job,
    };

    proposal.value = job.value.applications?.find(
      (a) => a.expertSnapshot?.expertId === proposal.value.expertSnapshot?.expertId
    );

    await Swal.fire({
      title: "Success",
      text: `${proposal.value.expertSnapshot?.name} has been hired!`,
      icon: "success",
      confirmButtonColor: "#22c55e",
    });
  } catch (err) {
    console.error("Hire error:", err);

    /* rollback */
    job.value.status = previousStatus;
    job.value.hiredExpert = previousExpert;

    Swal.fire({
      title: "Error",
      text: err.response?.data?.message || err.message || "Failed to hire expert.",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    hiring.value = false;
  }
};

/* ---------------- INIT ---------------- */
onMounted(fetchProposal);
</script>
