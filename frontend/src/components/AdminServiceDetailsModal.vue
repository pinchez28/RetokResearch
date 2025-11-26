<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { toast } from 'vue-sonner';
import api from '@/utils/api.js';

const props = defineProps({
  visible: Boolean,
  service: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved', 'deleted']);

// Branches with their categories
const branches = {
  'Academin Research': [
    'Academic Reports',
    'Market Analysis',
    'Survey Studies',
    'Feasibility Studies',
  ],
  'Industrial Research': [
    'Product Testing',
    'Process Improvement',
    'Industrial Surveys',
    'Tech Feasibility',
  ],
};

const form = reactive({
  title: '',
  branch: '',
  category: '',
  shortDescription: '',
  fullDescription: '',
  priceRange: '',
  includes: [],
});

const loading = ref(false);

// Populate form when service changes
const populateForm = () => {
  if (!props.service) return;
  Object.assign(form, {
    ...props.service,
    includes: props.service.includes ? [...props.service.includes] : [],
  });
};
watch(() => props.service, populateForm, { immediate: true });

// Filter categories based on selected branch
const filteredCategories = computed(() => {
  return form.branch ? branches[form.branch] || [] : [];
});

// Reset category if branch changes
watch(
  () => form.branch,
  () => {
    form.category = '';
  }
);

const saveService = async () => {
  loading.value = true;
  try {
    // Convert includes string to array if user typed comma-separated values
    if (typeof form.includes === 'string') {
      form.includes = form.includes
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);
    }

    const response = props.service._id
      ? await api.put(`/services/${props.service._id}`, form)
      : await api.post('/services', form);

    emit('saved', response.data);
    toast.success('Service saved successfully');
    emit('close');
  } catch (err) {
    console.error(err);
    toast.error('Failed to save service');
  } finally {
    loading.value = false;
  }
};

const deleteService = async () => {
  if (!props.service._id) return;
  if (!confirm('Are you sure you want to delete this service?')) return;
  try {
    await api.delete(`/services/${props.service._id}`);
    emit('deleted', props.service._id);
    toast.success('Service deleted successfully');
    emit('close');
  } catch (err) {
    console.error(err);
    toast.error('Failed to delete service');
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 relative overflow-y-auto max-h-[90vh]"
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <!-- Title -->
        <h2
          class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center"
        >
          {{ props.service._id ? 'Edit Service' : 'Add New Service' }}
        </h2>

        <!-- Form -->
        <form @submit.prevent="saveService" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Service Title -->
            <div class="flex flex-col">
              <label class="font-semibold text-gray-700 mb-1"
                >Service Title</label
              >
              <input
                v-model="form.title"
                placeholder="Enter service title"
                class="border p-2 rounded w-full"
                required
              />
            </div>

            <!-- Branch -->
            <div class="flex flex-col">
              <label class="font-semibold text-gray-700 mb-1">Branch</label>
              <select
                v-model="form.branch"
                class="border p-2 rounded w-full"
                required
              >
                <option disabled value="">Select Branch</option>
                <option
                  v-for="branch in Object.keys(branches)"
                  :key="branch"
                  :value="branch"
                >
                  {{ branch }}
                </option>
              </select>
            </div>

            <!-- Category -->
            <div class="flex flex-col">
              <label class="font-semibold text-gray-700 mb-1">Category</label>
              <select
                v-model="form.category"
                class="border p-2 rounded w-full"
                :disabled="!form.branch"
                required
              >
                <option disabled value="">
                  {{ form.branch ? 'Select Category' : 'Select Branch First' }}
                </option>
                <option
                  v-for="cat in filteredCategories"
                  :key="cat"
                  :value="cat"
                >
                  {{ cat }}
                </option>
              </select>
            </div>
          </div>

          <!-- Short Description -->
          <div class="flex flex-col">
            <label class="font-semibold text-gray-700 mb-1"
              >Short Description</label
            >
            <textarea
              v-model="form.shortDescription"
              placeholder="Enter a brief description"
              class="border p-2 rounded w-full"
            ></textarea>
          </div>

          <!-- Full Description -->
          <div class="flex flex-col">
            <label class="font-semibold text-gray-700 mb-1"
              >Full Description</label
            >
            <textarea
              v-model="form.fullDescription"
              placeholder="Enter full description"
              class="border p-2 rounded w-full"
            ></textarea>
          </div>

          <!-- Price Range -->
          <div class="flex flex-col">
            <label class="font-semibold text-gray-700 mb-1">Price Range</label>
            <input
              v-model="form.priceRange"
              placeholder="e.g., $100 - $500"
              class="border p-2 rounded w-full"
            />
          </div>

          <!-- Includes -->
          <div class="flex flex-col">
            <label class="font-semibold text-gray-700 mb-1">Includes</label>
            <input
              v-model="form.includes"
              placeholder="Comma separated items"
              class="border p-2 rounded w-full"
            />
          </div>

          <!-- Buttons -->
          <div class="flex justify-between mt-4">
            <button
              type="submit"
              :disabled="loading"
              class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-xl"
            >
              {{ props.service._id ? 'Save Changes' : 'Add Service' }}
            </button>
            <button
              v-if="props.service._id"
              type="button"
              @click="deleteService"
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl"
            >
              Delete
            </button>
          </div>
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
