<template>
  <div :class="['flex w-full mb-2', isMine ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'relative max-w-[75%] rounded-2xl px-4 py-2 text-sm break-words shadow-md',
        messageBubbleClass,
        isMine ? 'rounded-br-none' : 'rounded-bl-none',
      ]"
    >
      <!-- Role / Sender Name -->
      <p class="text-xs font-semibold mb-1" :class="senderTextClass">
        {{ senderDisplay }}
      </p>

      <!-- Message Content -->
      <p class="whitespace-pre-wrap font-medium">
        {{ messageContent }}
      </p>

      <!-- Footer -->
      <div class="flex justify-between items-center mt-1 text-xs">
        <span class="opacity-70">{{ formattedTime }}</span>

        <!-- Admin moderation -->
        <div
          v-if="adminMode && localMessage.status === 'pending'"
          class="flex gap-2 ml-2"
        >
          <button
            @click="handleApprove"
            class="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            <CheckIcon class="w-4 h-4" /> Approve
          </button>

          <button
            @click="openRejectModal"
            class="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            <XIcon class="w-4 h-4" /> Reject
          </button>
        </div>

        <!-- Approved / Rejected badges -->
        <span
          v-else-if="localMessage.status === 'approved'"
          class="ml-2 px-2 py-0.5 rounded-full bg-green-700 text-white font-semibold text-xs"
        >
          Approved
        </span>

        <span
          v-else-if="localMessage.status === 'rejected'"
          class="ml-2 px-2 py-0.5 rounded-full bg-red-700 text-white font-semibold text-xs"
        >
          Rejected: {{ localMessage.rejectionReason || "No reason provided" }}
        </span>

        <!-- Delete -->
        <button
          v-if="isMine && !adminMode"
          @click="handleDelete"
          class="text-red-600 hover:underline ml-2"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Reject modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-gray-800 p-6 rounded-xl w-96 text-white">
        <h3 class="font-bold text-lg mb-4">Reject Message</h3>

        <textarea
          v-model="rejectReason"
          class="w-full p-2 border rounded mb-4 bg-gray-900 text-white placeholder-gray-400"
          placeholder="Reason for rejection"
        ></textarea>

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 rounded border border-gray-700 text-white"
            @click="closeRejectModal"
          >
            Cancel
          </button>

          <button
            :disabled="!rejectReason.trim()"
            class="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
            @click="handleReject"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Swal from "sweetalert2";
import { CheckIcon, XIcon } from "lucide-vue-next";
import { useChat } from "@/composables/chat/useChat.js";

// Props
const props = defineProps({
  message: { type: Object, required: true },
  currentUserId: { type: String, required: true },
  adminMode: { type: Boolean, default: false },
  threadId: { type: String, required: true },
});

// Emits
const emit = defineEmits(["moderated", "deleted", "chat-ready"]);

// Local message state
const localMessage = ref({ ...props.message });
if (typeof localMessage.value.sender === "string") {
  localMessage.value.sender = {
    _id: localMessage.value.sender,
    role: localMessage.value.senderRole?.toLowerCase() || "unknown",
    name: localMessage.value.senderRole
      ? localMessage.value.senderRole.charAt(0).toUpperCase() +
        localMessage.value.senderRole.slice(1)
      : "Unknown",
  };
}
watch(
  () => props.message,
  (newMsg) => {
    localMessage.value = { ...newMsg };
    if (typeof localMessage.value.sender === "string") {
      localMessage.value.sender = {
        _id: localMessage.value.sender,
        role: localMessage.value.senderRole?.toLowerCase() || "unknown",
        name: localMessage.value.senderRole
          ? localMessage.value.senderRole.charAt(0).toUpperCase() +
            localMessage.value.senderRole.slice(1)
          : "Unknown",
      };
    }
  },
  { deep: true }
);

// Chat composable
const { moderateMessage, deleteMessage } = useChat(
  ref(props.threadId),
  false,
  { _id: props.currentUserId },
  props.adminMode,
  emit
);

// Computed
const isMine = computed(() => localMessage.value.sender?._id === props.currentUserId);
const senderDisplay = computed(() => {
  const sender = localMessage.value.sender;
  if (!sender) return "UNKNOWN";
  if (props.adminMode) return (sender.role || "unknown").toUpperCase();
  if (sender._id === props.currentUserId) return "You";
  return (sender.role || sender.name || "UNKNOWN").toUpperCase();
});
const messageContent = computed(() => localMessage.value.content || "");
const formattedTime = computed(() => {
  const ts = localMessage.value.createdAt;
  return ts
    ? new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
});

// Bubble color per role
const messageBubbleClass = computed(() => {
  const role = localMessage.value.sender?.role?.toLowerCase();
  if (role === "admin")
    return "bg-gradient-to-r from-purple-600 to-purple-500 text-white";
  if (role === "expert") return "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
  if (role === "client")
    return "bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold";
  return "bg-gray-200 text-gray-900";
});

const senderTextClass = computed(() =>
  localMessage.value.sender?.role ? "text-white font-bold" : "text-gray-700"
);

// Modal state
const showModal = ref(false);
const rejectReason = ref("");
const openRejectModal = () => {
  rejectReason.value = "";
  showModal.value = true;
};
const closeRejectModal = () => {
  showModal.value = false;
  rejectReason.value = "";
};

// Actions
const handleApprove = async () => {
  if (localMessage.value.status !== "pending") return;
  const result = await Swal.fire({
    title: "Approve this message?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Approve",
    confirmButtonColor: "#16a34a",
  });
  if (!result.isConfirmed) return;
  try {
    const updated = await moderateMessage(localMessage.value._id, "approve");
    localMessage.value.status = "approved";
    localMessage.value.rejectionReason = null;
    emit("moderated", updated);
  } catch (err) {
    Swal.fire("Error", err.message || "Moderation failed", "error");
  }
};

const handleReject = async () => {
  if (localMessage.value.status !== "pending" || !rejectReason.value.trim()) return;
  const result = await Swal.fire({
    title: "Reject this message?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Reject",
    confirmButtonColor: "#dc2626",
  });
  if (!result.isConfirmed) return;
  try {
    const updated = await moderateMessage(
      localMessage.value._id,
      "reject",
      rejectReason.value.trim()
    );
    localMessage.value.status = "rejected";
    localMessage.value.rejectionReason = rejectReason.value.trim();
    emit("moderated", updated);
    closeRejectModal();
  } catch (err) {
    Swal.fire("Error", err.message || "Moderation failed", "error");
  }
};

const handleDelete = async () => {
  if (!isMine.value) return;
  const result = await Swal.fire({
    title: "Delete this message?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    confirmButtonColor: "#dc2626",
  });
  if (!result.isConfirmed) return;
  try {
    const deleted = await deleteMessage(localMessage.value._id);
    emit("deleted", deleted);
  } catch (err) {
    Swal.fire("Error", err.message || "Delete failed", "error");
  }
};
</script>

<style scoped>
div.shadow {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}
div p {
  word-break: break-word;
}

/* WhatsApp-style subtle bubble tails */
.relative::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
}

.relative.rounded-br-none::after {
  right: -6px;
  border-left: 6px solid transparent;
  border-bottom: 6px solid white;
  border-top: 0;
}

.relative.rounded-bl-none::after {
  left: -6px;
  border-right: 6px solid transparent;
  border-bottom: 6px solid white;
  border-top: 0;
}
</style>
