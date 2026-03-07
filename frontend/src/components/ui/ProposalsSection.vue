<template>
  <section class="proposals-section py-6">
    <h2 class="text-2xl font-semibold mb-6">Your Proposals</h2>

    <div v-if="proposals.length" class="overflow-x-auto">
      <table
        class="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden"
      >
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Job Title
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Your Quote
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Submitted
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
          <tr
            v-for="item in proposals"
            :key="item._id"
            class="hover:bg-gray-50 transition cursor-pointer"
            @click="$emit('row-click', item)"
          >
            <!-- JOB -->
            <td class="px-6 py-4 font-medium text-gray-900 flex items-center">
              <span
                :class="getStatusDotClass(item)"
                class="w-2 h-2 rounded-full mr-3"
              ></span>
              {{ item.job?.title || "Untitled Job" }}
            </td>

            <!-- QUOTE -->
            <td class="px-6 py-4 text-gray-700">
              KES {{ formatCurrency(item.quote || 0) }}
            </td>

            <!-- STATUS -->
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-1 text-xs rounded-full font-semibold"
                :class="getStatusColorClass(item)"
              >
                {{ getStatusLabel(item) }}
              </span>
            </td>

            <!-- DATE -->
            <td class="px-6 py-4 text-gray-500 text-sm">
              {{ formatDate(item.createdAt) }}
            </td>

            <!-- ACTIONS -->
            <td class="px-6 py-4 space-x-3">
              <button
                @click.stop="$emit('view-proposal', item)"
                class="text-blue-700 hover:text-blue-900 text-sm font-medium"
              >
                View Details
              </button>

              <!-- CONFIRM BUTTON -->
              <button
                v-if="canConfirm(item)"
                @click.stop="$emit('confirm-job', item.job._id)"
                class="ml-3 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
              >
                Confirm & Start
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">No proposals submitted yet.</div>
  </section>
</template>

<script setup>
import { formatCurrency, formatDate } from "@/core/utils/formatters.js";

defineProps({
  proposals: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["view-proposal", "row-click", "confirm-job"]);

/* =====================================================
   LOGIC
===================================================== */

const canConfirm = (item) => {
  return item.status === "accepted" && item.job && item.job.status === "assigned";
};

const getStatusLabel = (item) => {
  if (item.job?.status === "assigned") return "Awaiting Confirmation";
  if (item.job?.status === "in_progress") return "In Progress";
  if (item.job?.status === "completed") return "Completed";

  return item.status || "pending";
};

const getStatusDotClass = (item) => {
  if (item.job?.status === "assigned") return "bg-yellow-500";
  if (item.job?.status === "in_progress") return "bg-blue-500";
  if (item.job?.status === "completed") return "bg-purple-500";

  return (
    {
      pending: "bg-yellow-500",
      accepted: "bg-green-500",
      rejected: "bg-red-500",
    }[item.status] || "bg-gray-500"
  );
};

const getStatusColorClass = (item) => {
  if (item.job?.status === "assigned") return "bg-yellow-100 text-yellow-800";

  if (item.job?.status === "in_progress") return "bg-blue-100 text-blue-800";

  if (item.job?.status === "completed") return "bg-purple-100 text-purple-800";

  return (
    {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }[item.status] || "bg-gray-100 text-gray-800"
  );
};
</script>

<style scoped>
.proposals-section {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
