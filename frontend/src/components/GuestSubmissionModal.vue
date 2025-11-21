<script setup>
import { reactive, watch } from 'vue';
import api from '@/utils/api.js'; // your axios instance

const { visible, service } = defineProps({
  visible: Boolean,
  service: { type: Object, default: null },
});

const emit = defineEmits(['close']);

// Form state using reactive
const guestForm = reactive({
  name: '',
  email: '',
  topic: '',
  description: '',
  phone: '',
  deadline: '',
  proposedPrice: '',
});

// Reset form when modal opens or service changes
watch(
  () => [visible, service],
  ([isVisible, svc]) => {
    if (isVisible) {
      guestForm.name = '';
      guestForm.email = '';
      guestForm.phone = '';
      guestForm.topic = svc?.title || '';
      guestForm.description = svc?.fullDescription || '';
      guestForm.deadline = '';
      guestForm.proposedPrice = '';
    }
  }
);

// Submit handler
const submitGuestRequest = async () => {
  try {
    const payload = {
      name: guestForm.name,
      email: guestForm.email,
      topic: guestForm.topic,
      description: guestForm.description,
      phone: guestForm.phone,
      deadline: guestForm.deadline,
      service: service?.title || 'Quick Request',
      proposedPrice: guestForm.proposedPrice || null,
    };

    await api.post('/guest-requests', payload);

    alert('Request submitted successfully! Admin has been notified.');
    emit('close');
  } catch (err) {
    console.error('Error submitting request:', err);
    alert(err.response?.data?.message || 'Failed to submit request.');
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative overflow-y-auto"
        style="max-height: 90vh"
      >
        <!-- Close button -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900 text-center">
          {{
            service?.title
              ? `Request "${service.title}"`
              : 'Quick Research Request'
          }}
        </h3>

        <form @submit.prevent="submitGuestRequest" class="space-y-4">
          <!-- Name & Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold text-gray-900 mb-1 block"
                >Your Name</label
              >
              <input
                v-model="guestForm.name"
                type="text"
                required
                placeholder="Enter your full name"
                class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label class="font-semibold text-gray-900 mb-1 block"
                >Your Email</label
              >
              <input
                v-model="guestForm.email"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Phone & Deadline -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold text-gray-900 mb-1 block"
                >Phone Number</label
              >
              <input
                v-model="guestForm.phone"
                type="text"
                required
                placeholder="Enter your phone number"
                class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label class="font-semibold text-gray-900 mb-1 block"
                >Timeline / Deadline</label
              >
              <input
                v-model="guestForm.deadline"
                type="text"
                required
                placeholder="Enter timeline / deadline"
                class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Topic & Description -->
          <div>
            <label class="font-semibold text-gray-900 mb-1 block"
              >Research Topic</label
            >
            <input
              v-model="guestForm.topic"
              type="text"
              required
              placeholder="Topic of research"
              class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          <div>
            <label class="font-semibold text-gray-900 mb-1 block"
              >Full Description</label
            >
            <textarea
              v-model="guestForm.description"
              required
              placeholder="Describe your request"
              class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              rows="3"
            ></textarea>
          </div>

          <!-- Proposed Price -->
          <div>
            <label class="font-semibold text-gray-900 mb-1 block"
              >Proposed Price (Optional)</label
            >
            <input
              v-model="guestForm.proposedPrice"
              type="text"
              placeholder="Optional"
              class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl w-full"
          >
            Submit Request
          </button>
        </form>

        <div
          class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-gray-800 text-sm"
        >
          <h4 class="font-semibold text-gray-900 mb-2">Why Register?</h4>
          <ul class="list-disc list-inside space-y-1">
            <li>Track your request progress</li>
            <li>Receive instant updates</li>
            <li>Manage multiple submissions</li>
          </ul>
          <p class="mt-2 text-gray-700">
            Registration gives you a dashboard and faster support.
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
