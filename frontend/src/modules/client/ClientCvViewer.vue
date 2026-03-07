<template>
  <div class="client-expert-cv-viewer min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <div class="p-6 bg-white shadow flex items-center gap-4">
      <button
        @click="$router.back()"
        class="px-4 py-2 bg-white rounded shadow hover:bg-gray-50"
      >
        ← Back
      </button>
      <div>
        <h1 class="text-2xl font-bold">{{ expertName }}</h1>
        <p class="text-gray-600 text-sm">{{ jobTitle }}</p>
      </div>
    </div>

    <!-- CV Viewer -->
    <div class="flex-1 p-4">
      <ExpertCvViewer v-if="cvUrl" :cv-url="cvUrl" />
      <p v-else class="text-center text-gray-500 mt-12">CV not available</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { clientApi } from "@/core/api/http";
import ExpertCvViewer from "@/components/ui/ExpertCvViewer.vue";

const route = useRoute();
const backendURL = import.meta.env.VITE_API_BASE_URL || "";

const jobId = route.params.jobId;
const expertId = route.params.expertId;

const cvUrl = ref(null);
const expertName = ref("Expert");
const jobTitle = ref("Job");

const fetchCv = async () => {
  try {
    const { data } = await clientApi.getJobById(jobId);
    if (data.success && data.job) {
      jobTitle.value = data.job.title;

      const app = data.job.applications.find(
        (a) => a.expertSnapshot?.expertId === expertId
      );

      if (app) {
        cvUrl.value = app.expertSnapshot.cvPdf
          ? `${backendURL}${app.expertSnapshot.cvPdf}`
          : null;
        expertName.value = app.expertSnapshot.name || "Expert";
      }
    }
  } catch (err) {
    console.error("Failed to fetch CV:", err);
  }
};

onMounted(fetchCv);
</script>

<style scoped>
.client-expert-cv-viewer {
  height: 100vh;
}
</style>
