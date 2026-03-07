<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <img
            :src="avatarUrl"
            @error="handleImageError"
            alt="Expert Avatar"
            class="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
          />

          <!-- Name & Email -->
          <div>
            <h2 class="text-xl font-bold text-gray-800">
              {{ expert.name || expert.user?.name || "N/A" }}
            </h2>
            <p class="text-sm text-gray-500">
              {{ expert.user?.email || "No email provided" }}
            </p>
          </div>
        </div>

        <!-- Close button -->
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 font-bold text-2xl"
        >
          &times;
        </button>
      </div>

      <!-- Status & Experience -->
      <div class="mb-4 flex items-center gap-3">
        <span
          :class="statusClass(expert.status)"
          class="inline-block px-4 py-1 rounded-full text-sm font-medium border"
        >
          {{ statusLabel(expert.status) }}
        </span>
        <span v-if="expert.experience" class="text-gray-500 text-sm">
          {{ expert.experience }} yrs experience
        </span>
      </div>

      <!-- Expert Info -->
      <div class="space-y-2 mb-4 text-gray-700">
        <p><strong>Phone:</strong> {{ expert.phone || "N/A" }}</p>
        <p><strong>Specialization:</strong> {{ expert.specialization || "N/A" }}</p>
        <p>
          <strong>Biography:</strong>
          {{ expert.bio || "No biography provided" }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="approveExpert"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ✓ Approve
        </button>
        <button
          @click="rejectExpert"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ✗ Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  expert: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "approve", "reject"]);

// Backend base URL (adjust .env if needed)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Compute full avatar URL
const avatarUrl = computed(() => {
  const photoPath = props.expert.photo || props.expert.user?.photo;
  return photoPath ? API_BASE_URL + photoPath : "/images/default-avatar.png";
});

// Handle missing or broken images
const handleImageError = (e) => {
  e.target.src = "/images/default-avatar.png";
};

// Status styling helpers
const statusClass = (status) => {
  const map = {
    pending_admin_review: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-blue-50 text-blue-800 border-blue-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    active: "bg-emerald-50 text-emerald-800 border-emerald-200",
    suspended: "bg-rose-50 text-rose-800 border-rose-200",
  };
  return map[status] || "bg-gray-50 text-gray-800 border-gray-200";
};

const statusLabel = (status) => {
  const map = {
    pending_admin_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    active: "Active",
    suspended: "Suspended",
  };
  return map[status] || "Unknown";
};

// Emitters
const close = () => emit("close");
const approveExpert = () => emit("approve", props.expert._id);
const rejectExpert = () => emit("reject", props.expert._id);
</script>

<style scoped>
/* Optional: smooth scroll for modal content */
div[role="dialog"] {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

div[role="dialog"]::-webkit-scrollbar {
  width: 6px;
}

div[role="dialog"]::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
