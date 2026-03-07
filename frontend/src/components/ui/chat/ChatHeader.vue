<template>
  <div class="border-b bg-primary-900 px-5 py-4 flex justify-between items-center">
    <!-- Left -->
    <div class="flex items-center gap-3">
      <!-- Avatars -->
      <div class="flex -space-x-2">
        <div
          v-for="p in visibleParticipants"
          :key="p._id"
          class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2"
          :class="avatarClass(p)"
          :title="tooltip(p)"
        >
          {{ getInitials(p) }}
        </div>
      </div>

      <!-- Names -->
      <div>
        <h3 class="text-sm font-semibold text-white leading-tight">
          {{ title }}
        </h3>
        <p class="text-xs text-gray-300 flex items-center gap-2">
          {{ subtitle }}
          <span
            v-if="hasAdmin"
            class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          >
            Moderator
          </span>
        </p>
      </div>
    </div>

    <!-- Status -->
    <span
      v-if="status"
      :class="['text-xs font-medium px-3 py-1 rounded-full capitalize', statusStyles]"
    >
      {{ status.replace("_", " ") }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  participants: {
    type: Object,
    default: () => ({ client: null, expert: null, admin: null }),
  },
  currentUserId: { type: String, required: true },
  currentUserRole: { type: String, required: true },
  status: { type: String, default: "" },
});

// ---------------- Computed ----------------

const visibleParticipants = computed(() =>
  Object.values(props.participants).filter(Boolean)
);

const hasAdmin = computed(() => !!props.participants.admin);

const title = computed(() =>
  visibleParticipants.value.length
    ? visibleParticipants.value.map((p) => p.email || p.role).join(", ")
    : "Chat"
);

const subtitle = computed(() => `${visibleParticipants.value.length} participant(s)`);

// ---------------- Helpers ----------------

const isMe = (p) => p._id === props.currentUserId;

const avatarClass = (p) => [
  isMe(p)
    ? "bg-primary-500 text-white border-primary-400 ring-2 ring-primary-600"
    : "bg-primary-700 text-white border-white",
];

const tooltip = (p) => (isMe(p) ? `${p.role} (You)` : p.email || p.role);

const getInitials = (user) => {
  if (!user?.email) return user?.role?.slice(0, 2).toUpperCase() || "?";
  return user.email.slice(0, 2).toUpperCase();
};

// ---------------- Status Styles ----------------

const statusStyles = computed(() => {
  switch (props.status) {
    case "in_progress":
      return "bg-primary-600 text-white"; // readable on dark bg
    case "completed":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-primary-700 text-white";
  }
});
</script>
