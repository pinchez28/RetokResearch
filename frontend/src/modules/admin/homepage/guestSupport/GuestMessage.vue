<template>
  <div class="p-6" v-if="message">
    <!-- Back -->
    <button @click="$router.back()" class="mb-4 text-sm text-gray-500 hover:text-black">
      ← Back to Messages
    </button>

    <div class="bg-white p-8 rounded-2xl shadow border border-gray-200">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold">
            {{ message.subject || "General Inquiry" }}
          </h2>
          <p class="text-gray-500">From: {{ message.name }} ({{ message.email }})</p>
          <!-- Show phone only if provided -->
          <p v-if="message.phone" class="text-gray-500">Phone: {{ message.phone }}</p>
        </div>

        <span :class="statusBadge(message.status)">
          {{ message.status || "new" }}
        </span>
      </div>

      <!-- Original Message -->
      <div class="mb-6">
        <h3 class="font-semibold mb-2 text-lg">Message</h3>
        <p class="text-gray-700 whitespace-pre-line">
          {{ message.message }}
        </p>
      </div>

      <!-- Reply Section -->
      <div class="mb-6" v-if="message.status !== 'replied'">
        <h3 class="font-semibold mb-2 text-lg">Reply</h3>
        <textarea
          v-model="replyText"
          rows="4"
          placeholder="Type your response..."
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
        ></textarea>

        <button @click="sendReply" class="mt-3 px-4 py-2 bg-black text-white rounded-lg">
          Send Reply
        </button>
      </div>

      <!-- Delete Button: Only show if already replied -->
      <button
        v-if="message.status === 'replied'"
        @click="deleteMessage"
        class="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Delete Message
      </button>

      <!-- Show admin reply if exists -->
      <div v-if="message.reply" class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 class="font-semibold mb-2 text-lg">Your Reply</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ message.reply }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/core/api/http.js";
import Swal from "sweetalert2";

export default {
  name: "GuestMessageDetails",
  data() {
    return {
      message: null,
      replyText: "",
    };
  },
  methods: {
    async fetchMessage() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/admin/guest-messages/${id}`);
        this.message = res.data.message;
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load message.", "error");
      }
    },

    async sendReply() {
      if (!this.replyText.trim()) return;

      try {
        const res = await api.patch(`/admin/guest-messages/${this.message._id}/reply`, {
          reply: this.replyText,
        });

        this.message.status = "replied";
        this.replyText = "";

        Swal.fire({
          title: "Reply Sent!",
          text: "The guest has been notified successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Send reply error:", err);
        Swal.fire("Error", "Failed to send reply.", "error");
      }
    },

    async deleteMessage() {
      const confirm = await Swal.fire({
        title: "Delete Message?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Delete",
      });

      if (!confirm.isConfirmed) return;

      try {
        await api.delete(`/admin/guest-messages/${this.message._id}`);

        Swal.fire({
          title: "Deleted!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
          didClose: () => {
            this.$router.push("/admin/guest-support/messages");
          },
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete message.", "error");
      }
    },

    statusBadge(status) {
      const base = "px-4 py-1 rounded-full text-xs font-semibold capitalize";

      const map = {
        pending: "bg-blue-100 text-blue-700",
        replied: "bg-green-100 text-green-700",
        closed: "bg-gray-100 text-gray-700",
      };

      return `${base} ${map[status] || "bg-gray-100 text-gray-700"}`;
    },
  },
  mounted() {
    this.fetchMessage();
  },
};
</script>
