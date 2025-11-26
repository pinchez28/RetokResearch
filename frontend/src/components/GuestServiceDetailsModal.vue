<script setup>
import { ref } from 'vue';
import GuestSubmissionModal from './GuestSubmissionModal.vue';

const props = defineProps({
  visible: Boolean,
  service: { type: Object, default: null },
});

const emit = defineEmits(['close']);

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
        class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative overflow-y-auto max-h-[90vh]"
      >
        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <!-- Service Title -->
        <h2
          class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center"
        >
          {{ service.title }}
        </h2>

        <!-- Branch & Category -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="font-semibold text-gray-900">Branch:</label>
            <p class="text-gray-700">{{ service.branch }}</p>
          </div>
          <div>
            <label class="font-semibold text-gray-900">Category:</label>
            <p class="text-gray-700">{{ service.category }}</p>
          </div>
        </div>

        <!-- Short Description -->
        <div v-if="service.shortDescription" class="mb-4">
          <label class="font-semibold text-gray-900">Short Description:</label>
          <p class="text-gray-700 mt-1">{{ service.shortDescription }}</p>
        </div>

        <!-- Full Description -->
        <div v-if="service.fullDescription" class="mb-4">
          <label class="font-semibold text-gray-900">Full Description:</label>
          <p class="text-gray-700 mt-1">{{ service.fullDescription }}</p>
        </div>

        <!-- Price Range -->
        <div v-if="service.priceRange" class="mb-4">
          <label class="font-semibold text-gray-900">Price Range:</label>
          <p class="text-gray-700 mt-1">{{ service.priceRange }}</p>
        </div>

        <!-- Includes -->
        <div v-if="service.includes && service.includes.length" class="mb-4">
          <label class="font-semibold text-gray-900">Includes:</label>
          <ul class="list-disc list-inside text-gray-700 mt-1 space-y-1">
            <li v-for="(item, index) in service.includes" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Request Button -->
        <div class="text-center mt-6">
          <button
            @click="handleRequest"
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
          >
            Request This Research
          </button>
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
