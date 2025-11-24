<script setup>
import { ref } from "vue";
import GuestSubmissionModal from "./GuestSubmissionModal.vue";

const { visible, service } = defineProps({
  visible: Boolean,
  service: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const showGuestModal = ref(false);

const handleRequest = () => {
  showGuestModal.value = true;
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible && service"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative overflow-y-auto"
        style="max-height: 90vh"
      >
        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <!-- Service Header -->
        <h2
          class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight text-center"
        >
          {{ service.title }}
        </h2>

        <!-- Branch & Category -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <span class="font-semibold text-gray-900">Branch:</span>
            <span class="text-gray-700">{{ service.branch }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-900">Category:</span>
            <span class="text-gray-700">{{ service.category }}</span>
          </div>
        </div>

        <!-- Descriptions -->
        <div class="space-y-4 mb-6">
          <div v-if="service.shortDescription">
            <span class="font-semibold text-gray-900">Short Description:</span>
            <p class="text-gray-700 mt-1">{{ service.shortDescription }}</p>
          </div>
          <div v-if="service.fullDescription">
            <span class="font-semibold text-gray-900">Full Description:</span>
            <p class="text-gray-700 mt-1">{{ service.fullDescription }}</p>
          </div>
        </div>

        <!-- Price & Includes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div v-if="service.priceRange">
            <span class="font-semibold text-gray-900">Price Range:</span>
            <span class="text-gray-700">{{ service.priceRange }}</span>
          </div>
          <div v-if="service.includes && service.includes.length">
            <span class="font-semibold text-gray-900">Includes:</span>
            <ul class="list-disc list-inside text-gray-700 mt-1 space-y-1">
              <li v-for="(item, index) in service.includes" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center mt-6">
          <button
            @click="handleRequest"
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
          >
            Request This Research
          </button>
          <!-- <p class="mt-3 text-sm text-gray-600">
            Benefits of registering: Track your request in real-time, receive
            updates, and manage your submissions efficiently.
          </p> -->
        </div>
      </div>

      <!-- Guest Submission Modal -->
      <GuestSubmissionModal
        :visible="showGuestModal"
        :service="service"
        @close="showGuestModal = false"
      />
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
