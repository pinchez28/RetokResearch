<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Loading State -->
    <div v-if="!request" class="text-gray-500 animate-pulse">
      Loading request...
    </div>

    <!-- Actual Page -->
    <div v-else>
      <!-- Back button -->
      <button
        @click="$router.back()"
        class="mb-4 text-sm text-gray-500 hover:text-black"
      >
        ← Back to Requests
      </button>

      <div class="bg-white p-8 rounded-2xl shadow border border-gray-200">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold">{{ request?.guest?.name }}</h2>
            <p class="text-gray-500">{{ request?.guest?.email }}</p>
          </div>
          <span :class="statusBadge(request?.status)">
            {{ request?.status }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-green-600 h-3 rounded-full"
              :style="{ width: (request?.progress || 0) + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Progress: {{ request?.progress || 0 }}%
          </p>
        </div>

        <!-- Request Details -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p>
              <strong>Service:</strong>
              {{ request?.serviceType || 'Not assigned' }}
            </p>
            <p><strong>Price:</strong> KES {{ request?.price || 0 }}</p>
            <p>
              <strong>Payment:</strong>
              <span
                :class="
                  request?.payment?.paid ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ request?.payment?.paid ? 'Confirmed' : 'Pending' }}
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Deadline:</strong>
              {{ request?.deadline ? formatDate(request.deadline) : 'N/A' }}
            </p>
            <p>
              <strong>Created:</strong>
              {{ request?.createdAt ? formatDate(request.createdAt) : 'N/A' }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Description</h3>
          <p class="text-gray-700 whitespace-pre-line">
            {{ request?.description }}
          </p>
        </div>

        <!-- Notifications -->
        <div
          v-if="notification.message"
          :class="
            notification.type === 'success'
              ? 'bg-green-100 text-green-700 p-3 rounded mb-4'
              : 'bg-red-100 text-red-700 p-3 rounded mb-4'
          "
        >
          {{ notification.message }}
        </div>

        <!-- Workflow Section -->
        <div class="space-y-6">
          <!-- Step 1: Acknowledge -->
          <div v-if="request?.status === 'new'">
            <p class="text-gray-600 mb-2 font-semibold">
              Step 1: Acknowledge Request
            </p>
            <button
              @click="acknowledgeRequest"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Acknowledge
            </button>
          </div>

          <!-- Step 2: Update Request -->
          <div v-else-if="request?.status === 'acknowledged'">
            <p class="text-gray-600 mb-4 font-semibold">
              Step 2: Update Request
            </p>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Service Type -->
              <div class="flex flex-col">
                <label class="mb-1 font-medium text-gray-700"
                  >Service Type</label
                >
                <select
                  v-model="request.serviceType"
                  class="border rounded p-2 focus:ring focus:ring-blue-200"
                >
                  <option disabled value="">Select Service</option>
                  <option
                    v-for="type in serviceTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div class="flex flex-col">
                <label class="mb-1 font-medium text-gray-700"
                  >Price (KES)</label
                >
                <input
                  type="number"
                  v-model.number="request.price"
                  placeholder="Enter price"
                  class="border rounded p-2 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div class="flex flex-col mb-4">
              <label class="mb-1 font-medium text-gray-700"
                >Optional Note</label
              >
              <textarea
                v-model="note"
                placeholder="Add a note (optional)"
                class="w-full border rounded p-2 focus:ring focus:ring-blue-200"
              ></textarea>
            </div>

            <button
              @click="updateRequest"
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Update Request
            </button>
          </div>

          <!-- Step 3: Full Request Details -->
          <div v-else-if="request?.status === 'full_request'">
            <p class="text-gray-600 mb-2 font-semibold">Full Request Details</p>
            <div class="mt-4 bg-gray-50 p-4 rounded-lg border">
              <p><strong>Service:</strong> {{ request.serviceType }}</p>
              <p><strong>Price:</strong> KES {{ request.price }}</p>
              <p>
                <strong>Payment Status:</strong>
                <span
                  :class="
                    request.payment.paid ? 'text-green-600' : 'text-red-600'
                  "
                >
                  {{ request.payment.paid ? 'Confirmed' : 'Pending' }}
                </span>
              </p>
              <p>
                <strong>Deadline:</strong> {{ formatDate(request.deadline) }}
              </p>
              <p><strong>Description:</strong> {{ request.description }}</p>
              <p><strong>Timeline:</strong></p>
              <ul class="list-disc ml-6">
                <li v-for="entry in request.timeline" :key="entry._id">
                  {{ entry.actor }}: {{ entry.message }} ({{
                    formatDate(entry.createdAt)
                  }})
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminApi } from '@/core/api/http.js';

export default {
  name: 'GuestRequestDetails',

  data() {
    return {
      request: null,
      note: '',
      serviceTypes: [
        'Research Paper',
        'Essay Writing',
        'Thesis',
        'Dissertation',
        'Proposal',
        'Editing',
      ],
      notification: { message: '', type: '' },
    };
  },

  methods: {
    async fetchRequest() {
      try {
        const id = this.$route.params.id;
        const { data } = await adminApi.getGuestRequestById(id);
        this.request = data.request;
      } catch {
        this.showNotification('Failed to load request', 'error');
      }
    },

    async acknowledgeRequest() {
      try {
        await adminApi.acknowledgeGuestRequest(this.request._id);
        await this.fetchRequest();
        this.showNotification('Request acknowledged', 'success');
      } catch {
        this.showNotification('Failed to acknowledge request', 'error');
      }
    },

    async updateRequest() {
      if (!this.request.serviceType || this.request.price == null) {
        this.showNotification('Please fill service type and price', 'error');
        return;
      }
      try {
        await adminApi.adminUpdateGuestRequest(this.request._id, {
          serviceType: this.request.serviceType,
          price: this.request.price,
        });

        await this.fetchRequest();
        this.showNotification('Request updated and expert assigned', 'success');
      } catch (err) {
        console.error(err);
        this.showNotification('Failed to update request', 'error');
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    statusBadge(status) {
      const base = 'px-4 py-1 rounded-full text-xs font-semibold capitalize';
      const map = {
        new: 'bg-blue-100 text-blue-700',
        acknowledged: 'bg-teal-100 text-teal-700',
        full_request: 'bg-indigo-100 text-indigo-700',
      };
      return `${base} ${map[status] || 'bg-gray-100 text-gray-700'}`;
    },

    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => (this.notification.message = ''), 4000);
    },
  },

  mounted() {
    this.fetchRequest();
  },
};
</script>

<style scoped>
button:hover {
  opacity: 0.9;
}
</style>
