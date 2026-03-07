<template>
  <div class="flex flex-col h-full bg-gray-50 rounded-2xl shadow border overflow-hidden">
    <!-- Header -->
    <ChatHeader
      :participants="normalizedParticipants"
      :current-user-id="currentUserId"
      :current-user-role="currentUserRole"
      :status="statusLabel"
    />

    <!-- Chat body -->
    <div ref="body" class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- Empty / Loading States -->
      <ChatEmpty
        v-if="!isChatOpen"
        message="Chat will open once the assignment starts."
      />
      <ChatEmpty v-else-if="loading" message="Loading conversation..." />
      <ChatEmpty
        v-else-if="!normalizedMessages.length"
        message="No messages yet. Start the conversation."
      />

      <!-- Chat messages -->
      <ChatMessage
        v-else
        v-for="(msg, index) in normalizedMessages"
        :key="msg?._id || index"
        :message="msg"
        :current-user-id="currentUserId"
        :admin-mode="adminMode"
        :thread-id="threadId"
        @moderated="updateMessage"
        @deleted="removeMessage"
      />
    </div>

    <!-- Input -->
    <ChatInput v-if="isChatOpen && canSend" @send="emitSend" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import ChatHeader from "./ChatHeader.vue";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import ChatEmpty from "./ChatEmpty.vue";

const props = defineProps({
  messages: { type: Array, default: () => [] },
  participants: { type: Object, default: () => ({}) },
  loading: Boolean,
  threadId: String,
  currentUserId: String,
  currentUserRole: String,
  adminMode: Boolean,
  status: { type: String, default: "" },
});

const emit = defineEmits(["send"]);

const body = ref(null);
const isChatOpen = computed(() => props.status === "in_progress");
const statusLabel = computed(() => (isChatOpen.value ? "Active Chat" : "Chat Locked"));
const canSend = computed(() => !props.adminMode && isChatOpen.value);

// Auto-scroll to bottom on new messages
watch(
  () => props.messages?.length,
  async () => {
    await nextTick();
    body.value?.scrollTo({
      top: body.value.scrollHeight,
      behavior: "smooth",
    });
  }
);

// Participants normalization
const normalizedParticipants = computed(() => {
  const p = props.participants || {};
  const list = [];

  if (p.admin)
    list.push({
      ...p.admin,
      role: "Admin",
      isModerator: true,
      isCurrentUser: p.admin._id === props.currentUserId,
    });
  if (p.client)
    list.push({
      ...p.client,
      role: "Client",
      isCurrentUser: p.client._id === props.currentUserId,
    });
  if (p.expert)
    list.push({
      ...p.expert,
      role: "Expert",
      isCurrentUser: p.expert._id === props.currentUserId,
    });

  return list;
});

// Normalize messages
const normalizedMessages = computed(() =>
  (props.messages || []).map((msg) => ({
    ...msg,
    senderDisplayName:
      msg.sender?.role || msg.sender?.email || msg.sender?.username || "Unknown",
  }))
);

// Emit send
const emitSend = (payload) => emit("send", payload);

// Update message after moderation
const updateMessage = (updated) => {
  const idx = props.messages.findIndex((m) => m?._id === updated?._id);
  if (idx !== -1) props.messages[idx] = updated;
};

// Remove message after deletion
const removeMessage = (deleted) => {
  const idx = props.messages.findIndex((m) => m?._id === deleted?._id);
  if (idx !== -1) props.messages.splice(idx, 1);
};
</script>

<style scoped>
/* Scrollbar styling */
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
