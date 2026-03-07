<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- HEADER SECTION -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Experts Management</h1>
          <p class="text-gray-600 mt-2">
            Review and manage expert profiles and applications
          </p>
        </div>

        <!-- FILTERS -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select
              v-model="statusFilter"
              class="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[180px]"
            >
              <option value="">All Statuses</option>
              <option value="pending_admin_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            @click="fetchExperts"
            class="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-blue-50 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Experts</p>
            <p class="text-2xl font-bold text-gray-900">{{ experts.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-amber-50 rounded-lg">
            <svg
              class="w-6 h-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Pending Review</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-emerald-50 rounded-lg">
            <svg
              class="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Approved</p>
            <p class="text-2xl font-bold text-gray-900">{{ approvedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE CONTAINER -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Expert
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="expert in filteredExperts"
              :key="expert._id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- NAME COLUMN -->
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-blue-600 font-semibold">
                      {{ expert.fullName.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ expert.fullName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ expert._id.slice(-8) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- CONTACT COLUMN -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="flex items-center text-sm text-gray-900">
                    <svg
                      class="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {{ expert.email }}
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <svg
                      class="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {{ expert.phone || "Not provided" }}
                  </div>
                </div>
              </td>

              <!-- STATUS COLUMN -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="statusClasses[expert.status]"
                >
                  <span
                    class="w-2 h-2 rounded-full mr-2"
                    :class="statusDotClasses[expert.status]"
                  ></span>
                  {{ formatStatus(expert.status) }}
                </span>
              </td>

              <!-- ACTIONS COLUMN -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <!-- VIEW BUTTON -->
                  <router-link
                    :to="{
                      name: 'AdminExpertDetails',
                      params: { id: expert._id },
                    }"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </router-link>

                  <!-- APPROVE BUTTON -->
                  <button
                    v-if="expert.status === 'pending_admin_review'"
                    @click="approveExpert(expert)"
                    class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </button>

                  <!-- REJECT BUTTON -->
                  <button
                    v-if="expert.status === 'pending_admin_review'"
                    @click="rejectExpert(expert)"
                    class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reject
                  </button>
                </div>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="filteredExperts.length === 0">
              <td colspan="4" class="px-6 py-16 text-center">
                <div class="text-gray-400 mb-4">
                  <svg
                    class="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
                <p class="text-gray-500">
                  {{
                    statusFilter
                      ? `No experts with status "${formatStatus(statusFilter)}"`
                      : "No experts available"
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TABLE FOOTER -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing
            <span class="font-medium">{{ filteredExperts.length }}</span> of
            <span class="font-medium">{{ experts.length }}</span> experts
          </div>
          <div class="text-sm text-gray-600">{{ pendingCount }} pending review</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "@/core/api/http.js";

const experts = ref([]);
const statusFilter = ref("");

// Status styling configuration
const statusClasses = {
  pending_admin_review: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-rose-50 text-rose-800",
};

const statusDotClasses = {
  pending_admin_review: "bg-amber-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
};

const formatStatus = (status) => {
  const statusMap = {
    pending_admin_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return (
    statusMap[status] || status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// Statistics
const pendingCount = computed(
  () => experts.value.filter((e) => e.status === "pending_admin_review").length
);

const approvedCount = computed(
  () => experts.value.filter((e) => e.status === "approved").length
);

// Fetch experts
const fetchExperts = async () => {
  try {
    const res = await api.get("/admin/experts");
    const expertsData = res.data.data || [];
    experts.value = expertsData.map((exp) => ({
      _id: exp._id,
      fullName: exp.fullName || exp.name || "Unnamed Expert",
      email: exp.user?.email || exp.email || "N/A",
      phone: exp.phone || "",
      status: exp.status || "pending_admin_review",
    }));
  } catch (err) {
    console.error("Failed to fetch experts:", err);
    Swal.fire({
      icon: "error",
      title: "Failed to load experts",
      text: "Please try again later",
      confirmButtonColor: "#3B82F6",
    });
  }
};

// Approve expert
const approveExpert = async (expert) => {
  const result = await Swal.fire({
    title: "Approve Expert?",
    html: `<p class="text-gray-600">You are about to approve <strong>${expert.fullName}</strong>.</p>
           <p class="text-gray-500 text-sm mt-2">This will grant them full access to the platform.</p>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, approve",
    confirmButtonColor: "#10B981",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    const res = await api.put(`/admin/experts/${expert._id}/approve`);
    if (res.data.success) {
      expert.status = "approved";
      Swal.fire({
        icon: "success",
        title: "Expert Approved",
        text: `${expert.fullName} has been approved successfully`,
        confirmButtonColor: "#10B981",
      });
    }
  } catch (err) {
    console.error("Failed to approve expert:", err);
    Swal.fire({
      icon: "error",
      title: "Approval Failed",
      text: "Failed to approve expert. Please try again.",
      confirmButtonColor: "#EF4444",
    });
  }
};

// Reject expert
const rejectExpert = async (expert) => {
  const result = await Swal.fire({
    title: "Reject Expert?",
    html: `<p class="text-gray-600">You are about to reject <strong>${expert.fullName}</strong>.</p>
           <p class="text-gray-500 text-sm mt-2">This action cannot be undone.</p>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject",
    confirmButtonColor: "#EF4444",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    const res = await api.put(`/admin/experts/${expert._id}/reject`);
    if (res.data.success) {
      expert.status = "rejected";
      Swal.fire({
        icon: "success",
        title: "Expert Rejected",
        text: `${expert.fullName} has been rejected`,
        confirmButtonColor: "#10B981",
      });
    }
  } catch (err) {
    console.error("Failed to reject expert:", err);
    Swal.fire({
      icon: "error",
      title: "Rejection Failed",
      text: "Failed to reject expert. Please try again.",
      confirmButtonColor: "#EF4444",
    });
  }
};

// Filtered experts
const filteredExperts = computed(() => {
  if (!statusFilter.value) return experts.value;
  return experts.value.filter((e) => e.status === statusFilter.value);
});

onMounted(fetchExperts);
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
