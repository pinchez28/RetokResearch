<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-4">My Assignments</h1>

    <!-- Loading spinner -->
    <div v-if="loading" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Loading assignments…</p>
    </div>

    <!-- No assignments -->
    <div
      v-else-if="assignments.length === 0"
      class="bg-white rounded-2xl p-8 text-center text-gray-500"
    >
      You don’t have any assignments yet.
    </div>

    <!-- Assignments grid -->
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="assignment in assignments"
          :key="assignment._id"
          class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
        >
          <!-- Job Title with Admin Assigned Badge -->
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            {{ assignment.job?.title || "Untitled Job" }}
            <span
              v-if="assignment.isAdminAssigned"
              class="inline-block text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-800"
            >
              Admin Assigned
            </span>
          </h3>

          <p class="text-sm text-gray-500">
            Client: {{ assignment.client?.name || "—" }}
          </p>

          <!-- Assignment status badge -->
          <span
            class="mt-2 inline-block text-xs font-semibold px-2 py-1 rounded"
            :class="statusBadgeClass(assignment.status)"
          >
            {{ assignment.status.replace(/_/g, " ") }}
          </span>

          <!-- Action buttons -->
          <div class="mt-4">
            <!-- Confirm assignment -->
            <BaseButton
              v-if="assignment.status === 'assigned'"
              :loading="confirming[assignment._id]"
              class="w-full bg-blue-600 text-white"
              @click="confirmAssignment(assignment._id, assignment.isAdminAssigned)"
            >
              Start Work
            </BaseButton>

            <!-- View assignment -->
            <BaseButton
              v-else
              class="w-full bg-gray-700 text-white"
              @click="viewAssignment(assignment._id)"
            >
              View Assignment
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { expertApi } from "@/core/api/http.js";
import BaseButton from "@/components/ui/BaseButton.vue";

const router = useRouter();

const assignments = ref([]);
const loading = ref(false);
const confirming = ref({});

/* ======================================================
   FETCH ASSIGNMENTS
====================================================== */
const fetchAssignments = async () => {
  loading.value = true;
  try {
    const res = await expertApi.getAssignments();

    // Ensure isAdminAssigned is set for guest requests
    assignments.value = Array.isArray(res.data.assignments)
      ? res.data.assignments.map((a) => ({
          ...a,
          isAdminAssigned: !!a.isAdminAssigned || !!a.adminAssigned, // support backend flags
        }))
      : [];
  } catch (err) {
    console.error("Failed to load assignments:", err);
    assignments.value = [];
  } finally {
    loading.value = false;
  }
};

/* ======================================================
   VIEW ASSIGNMENT (SAFE ROUTING)
====================================================== */
const viewAssignment = (assignmentId) => {
  if (!assignmentId) {
    console.warn("viewAssignment called without assignmentId");
    return;
  }

  console.log("➡ Navigating to assignment:", assignmentId);

  router
    .push({
      name: "AssignmentDetails",
      params: { assignmentId },
    })
    .catch((err) => {
      if (err?.name !== "NavigationDuplicated") {
        console.error("Router navigation error:", err);
      }
    });
};

/* ======================================================
   CONFIRM ASSIGNMENT (SUPPORTS ADMIN ASSIGNED)
====================================================== */
const confirmAssignment = async (assignmentId, isAdminAssigned = false) => {
  if (!assignmentId) return;

  confirming.value[assignmentId] = true;

  try {
    if (isAdminAssigned) {
      // Admin assigned guest request
      await expertApi.confirmGuestAssignment(assignmentId);
    } else {
      // Normal assignment
      await expertApi.confirmAssignment(assignmentId);
    }

    await fetchAssignments(); // refresh list after confirming
  } catch (err) {
    console.error("Failed to confirm assignment:", err);
  } finally {
    confirming.value[assignmentId] = false;
  }
};

/* ======================================================
   STATUS BADGE
====================================================== */
const statusBadgeClass = (status) => {
  switch (status) {
    case "assigned":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

/* ======================================================
   LIFECYCLE (SAFE)
====================================================== */
onMounted(async () => {
  try {
    await fetchAssignments();
  } catch (err) {
    console.error("Assignments mounted hook failed:", err);
  }
});
</script>
