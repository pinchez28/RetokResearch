<template>
  <div class="h-full p-4">
    <ChatThread
      :thread-id="threadId"
      :current-user-id="auth.user._id"
      :admin-mode="isAdmin"
      :can-send="canSend"
      :status="jobStatus"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/core/store/auth";

import ChatThread from "@/components/ui/chat/ChatThread.vue";

const route = useRoute();
const auth = useAuthStore();

const threadId = computed(() => route.params.threadId);

const isAdmin = computed(() => auth.userRole === "Admin");

// Admin can always send (moderation replies)
// Client & Expert can send only if job is active
const canSend = computed(() => auth.userRole !== "Admin" || true);

// Optional (if you later pass job status)
const jobStatus = "";
</script>
