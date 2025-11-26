<script setup>
import { reactive, watch, ref } from 'vue';
import api from '@/utils/api.js'; // Axios instance

const props = defineProps({
  visible: Boolean,
  service: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const loading = ref(false);

// Reactive form state
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
  () => [props.visible, props.service],
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

// Simple email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Submit handler
const submitGuestRequest = async () => {
  // Basic validation
  if (
    !guestForm.name.trim() ||
    !guestForm.email.trim() ||
    !guestForm.phone.trim() ||
    !guestForm.topic.trim() ||
    !guestForm.description.trim() ||
    !guestForm.deadline.trim()
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!isValidEmail(guestForm.email)) {
    alert('Please enter a valid email address.');
    return;
  }

  loading.value = true;

  try {
    const payload = {
      name: guestForm.name.trim(),
      email: guestForm.email.trim(),
      phone: guestForm.phone.trim(),
      topic: guestForm.topic.trim(),
      description: guestForm.description.trim(),
      deadline: guestForm.deadline.trim(),
      service: props.service?.title || 'Quick Request',
      proposedPrice: guestForm.proposedPrice?.trim() || null,
    };

    await api.post('/guest-requests', payload);

    alert(
      'Your request has been submitted successfully!\nA Service Provider will contact you shortly.'
    );

    // Reset form
    guestForm.name = '';
    guestForm.email = '';
    guestForm.phone = '';
    guestForm.topic = '';
    guestForm.description = '';
    guestForm.deadline = '';
    guestForm.proposedPrice = '';

    emit('close');
  } catch (err) {
    console.error('Error submitting request:', err);
    alert(err.response?.data?.message || 'Failed to submit request.');
  } finally {
    loading.value = false;
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
            props.service?.title
              ? `Request "${props.service.title}"`
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
                placeholder="Enter your full name"
                required
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
                placeholder="Enter your email"
                required
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
                placeholder="Enter your phone number"
                required
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
                placeholder="Enter timeline / deadline"
                required
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
              placeholder="Topic of research"
              required
              class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          <div>
            <label class="font-semibold text-gray-900 mb-1 block"
              >Full Description</label
            >
            <textarea
              v-model="guestForm.description"
              placeholder="Describe your request"
              required
              rows="3"
              class="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
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

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl w-full"
          >
            {{ loading ? 'Submitting...' : 'Submit Request' }}
          </button>
        </form>
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
