<template>
  <div class="min-h-screen bg-gray-100 p-6 md:p-12">
    <!-- Back Button -->
    <div class="max-w-5xl mx-auto mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl shadow hover:bg-gray-50 hover:shadow-md transition font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-500">
      Loading expert details...
    </div>

    <!-- Expert Details -->
    <div v-else class="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <!-- Profile Image -->
        <div class="md:w-1/3 bg-gray-200 flex items-center justify-center p-6">
          <img
            v-if="expert.photo"
            :src="resolvePhotoUrl(expert.photo)"
            class="w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />
          <div
            v-else
            class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-500"
          >
            No Photo
          </div>
        </div>

        <!-- Info Section -->
        <div class="md:w-2/3 p-6 space-y-4">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ expert.name || expert.user?.name || "N/A" }}
          </h1>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-700">
                <strong>Email:</strong> {{ expert.user?.email || "N/A" }}
              </p>
              <p class="text-gray-700">
                <strong>Phone:</strong> {{ expert.phone || "N/A" }}
              </p>
              <p class="text-gray-700">
                <strong>Specialization:</strong>
                {{ expert.specialization || "N/A" }}
              </p>
            </div>

            <div>
              <p class="text-gray-700">
                <strong>Experience:</strong> {{ expert.experience ?? 0 }} years
              </p>
              <p class="text-gray-700">
                <strong>Education:</strong> {{ expert.education || "N/A" }}
              </p>
              <p>
                <strong>Certifications:</strong>
                <span v-if="expert.certifications.length">{{
                  expert.certifications.join(", ")
                }}</span>
                <span v-else>N/A</span>
              </p>
            </div>
          </div>

          <p class="text-gray-600 italic pt-4">
            {{ expert.bio || "No biography provided" }}
          </p>

          <!-- CV Button -->
          <div class="pt-6">
            <button
              v-if="expert.cvPdf"
              @click="showCvModal = true"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View CV
            </button>
            <span v-else class="text-gray-400 italic">CV not uploaded</span>
          </div>

          <!-- Approve / Reject Buttons -->
          <div v-if="isApprovalMode" class="pt-6 flex gap-4">
            <button
              @click="approveExpert"
              :disabled="actionLoading"
              class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>

            <button
              @click="rejectExpert"
              :disabled="actionLoading"
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CV Modal -->
    <div v-if="showCvModal" class="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div class="flex justify-end p-4 bg-black/90">
        <button
          @click="showCvModal = false"
          class="text-white text-3xl font-bold hover:text-gray-300"
        >
          &times;
        </button>
      </div>
      <iframe
        :src="expert.cvPdf ? `${VITE_API_BASE_URL}${expert.cvPdf}` : ''"
        class="flex-1 w-full"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { adminApi } from "@/core/api/http.js";

const route = useRoute();
const router = useRouter();

const expert = ref({ certifications: [] });
const loading = ref(true);
const showCvModal = ref(false);
const actionLoading = ref(false);

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* ✅ Approval mode: show buttons if expert is pending_admin_review or route query = pending */
const isApprovalMode = computed(() => {
  return route.query.mode === "pending" || expert.value.status === "pending_admin_review";
});

const resolvePhotoUrl = (photo) => (photo ? `${VITE_API_BASE_URL}${photo}` : "");

/* Back button */
const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push({ name: "PendingExperts" });
};

/* Normalize certifications */
const normalizeCertifications = (cert) => {
  if (!cert) return [];
  if (Array.isArray(cert)) return cert.filter(Boolean);
  if (typeof cert === "string") {
    const v = cert.trim().toUpperCase();
    if (v === "NA" || v === "N/A") return [];
    return cert
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }
  return [];
};

/* Load expert */
const loadExpert = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getExpertById(route.params.id);
    const data = res.data?.data ?? {};
    expert.value = {
      ...data,
      certifications: normalizeCertifications(data.certifications),
    };
  } catch (err) {
    console.error("Failed to load expert:", err);
  } finally {
    loading.value = false;
  }
};

/* Approve expert */
const approveExpert = async () => {
  actionLoading.value = true;
  try {
    await adminApi.approveExpert(route.params.id);
    router.push({ name: "PendingExperts" });
  } catch (err) {
    console.error("Approve failed:", err);
  } finally {
    actionLoading.value = false;
  }
};

/* Reject expert */
const rejectExpert = async () => {
  actionLoading.value = true;
  try {
    await adminApi.rejectExpert(route.params.id);
    router.push({ name: "PendingExperts" });
  } catch (err) {
    console.error("Reject failed:", err);
  } finally {
    actionLoading.value = false;
  }
};

onMounted(loadExpert);
</script>

<style scoped>
iframe {
  background: #f5f5f5;
}
</style>
