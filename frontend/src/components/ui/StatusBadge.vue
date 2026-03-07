<template>
  <span
    class="inline-flex items-center justify-center font-semibold rounded-full border text-center whitespace-nowrap"
    :class="[badgeClass, sizeClass]"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: { type: String, required: true },
  size: { type: String, default: "md" }, // sm, md, lg
});

const map = {
  pending_admin_review: {
    label: "Pending Review",
    class: "bg-amber-50 text-amber-800 border border-amber-200 shadow-sm",
  },
  approved: {
    label: "Approved",
    class: "bg-green-50 text-green-800 border border-green-200 shadow-sm",
  },
  rejected: {
    label: "Rejected",
    class: "bg-red-50 text-red-800 border border-red-200 shadow-sm",
  },
  active: {
    label: "Active",
    class: "bg-blue-50 text-blue-800 border border-blue-200 shadow-sm",
  },
  completed: {
    label: "Completed",
    class: "bg-gray-50 text-gray-800 border border-gray-200 shadow-sm",
  },
  suspended: {
    label: "Suspended",
    class: "bg-rose-50 text-rose-800 border border-rose-200 shadow-sm",
  },
};

const badgeClass = computed(
  () => map[props.status]?.class || "bg-gray-100 text-gray-800 border border-gray-300"
);
const label = computed(() => map[props.status]?.label || props.status);

// Adjust container height via py, min-h, and line-height
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-[1px] min-h-[20px] text-xs leading-[18px]";
    case "md":
      return "px-4 py-[2px] min-h-[24px] text-sm leading-[22px]";
    case "lg":
      return "px-5 py-[3px] min-h-[28px] text-base leading-[26px]";
    default:
      return "px-4 py-[2px] min-h-[24px] text-sm leading-[22px]";
  }
});
</script>
