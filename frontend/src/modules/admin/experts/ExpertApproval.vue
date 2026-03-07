<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#001BB7] mb-2">Expert Applications</h1>
      <p class="text-gray-600">Review pending expert registrations</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard v-for="stat in stats" :key="stat.title" :stat="stat" />
    </div>

    <!-- Expert Cards -->
    <div
      v-if="experts.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="expert in experts"
        :key="expert._id"
        class="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-[#001BB7] to-[#0046FF] p-5 text-white flex justify-between items-center"
        >
          <div>
            <h3 class="text-xl font-bold truncate">
              {{ expert?.name || expert?.user?.name || "N/A" }}
            </h3>
            <p class="text-blue-100 text-sm truncate">
              {{ expert?.user?.email || "N/A" }}
            </p>
          </div>
          <StatusBadge :status="expert?.status" />
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4">
          <p><strong>Phone:</strong> {{ expert?.phone || "No phone" }}</p>
          <p>
            <strong>Specialization:</strong>
            {{ expert?.specialization || "N/A" }}
          </p>
          <p><strong>Experience:</strong> {{ expert?.experience ?? 0 }} years</p>
          <p><strong>Education:</strong> {{ expert?.education || "N/A" }}</p>
          <p>
            <strong>Certifications:</strong>
            <span v-if="expert?.certifications?.length">{{
              expert.certifications.join(", ")
            }}</span>
            <span v-else>N/A</span>
          </p>
          <p class="text-gray-500 text-sm line-clamp-2 border-t pt-3">
            {{ expert?.bio || "No biography provided" }}
          </p>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-3">
            <BaseButton class="flex-1" @click="openExpertPage(expert)">
              👁 View Details
            </BaseButton>
            <div class="flex gap-2 ml-3">
              <BaseButton
                variant="success"
                class="w-10 h-10"
                @click="approveExpert(expert._id)"
                >✓</BaseButton
              >
              <BaseButton
                variant="danger"
                class="w-10 h-10"
                @click="rejectExpert(expert._id)"
                >✗</BaseButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else
      title="No pending applications"
      description="All expert applications have been reviewed."
      icon="👨‍💼"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

import StatsCard from "@/components/ui/StatsCard.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

import { adminApi } from "@/core/api/http.js";

const router = useRouter();
const experts = ref([]);

const fetchExperts = async () => {
  try {
    const { data } = await adminApi.getPendingExperts();
    experts.value = data.data?.filter((e) => e.user) ?? [];
  } catch (err) {
    console.error("Failed to fetch experts:", err);
    experts.value = [];
  }
};

const stats = computed(() => [
  {
    title: "Pending Review",
    value: experts.value.filter((e) => e.status === "pending_admin_review").length,
    description: "Experts awaiting approval",
    color: "border-blue-500",
    bgColor: "bg-blue-100",
    icon: "briefcase",
    iconColor: "text-blue-500",
  },
  {
    title: "Approved",
    value: experts.value.filter((e) => e.status === "approved").length,
    description: "Experts approved by admin",
    color: "border-green-500",
    bgColor: "bg-green-100",
    icon: "check-circle",
    iconColor: "text-green-500",
  },
  {
    title: "Rejected",
    value: experts.value.filter((e) => e.status === "rejected").length,
    description: "Experts rejected by admin",
    color: "border-red-500",
    bgColor: "bg-red-100",
    icon: "message-square",
    iconColor: "text-red-500",
  },
]);

const openExpertPage = (expert) =>
  router.push({ name: "AdminExpertDetails", params: { id: expert._id } });

const approveExpert = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: "Approve Expert?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10B981",
  });
  if (!isConfirmed) return;
  try {
    await adminApi.approveExpert(id);
    fetchExperts();
  } catch (err) {
    console.error(err);
  }
};

const rejectExpert = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: "Reject Expert?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EF4444",
  });
  if (!isConfirmed) return;
  try {
    await adminApi.rejectExpert(id);
    fetchExperts();
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => fetchExperts());
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
