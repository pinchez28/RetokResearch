<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6 relative">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div
        class="loader border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16 animate-spin"
      ></div>
    </div>

    <div
      class="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 relative z-10"
    >
      <h1 class="text-3xl font-bold text-[#001bb7] mb-8">Manage About Page</h1>

      <!-- Mission -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Mission</h2>
        <textarea
          v-model="mission"
          rows="4"
          class="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001bb7]"
          placeholder="Enter mission text..."
        ></textarea>
      </section>

      <!-- Vision -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Vision</h2>
        <textarea
          v-model="vision"
          rows="4"
          class="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001bb7]"
          placeholder="Enter vision text..."
        ></textarea>
      </section>

      <!-- Core Values -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Core Values</h2>
          <button
            @click="addCoreValue"
            class="px-4 py-2 bg-[#001bb7] text-white rounded-lg hover:bg-blue-900"
          >
            + Add Value
          </button>
        </div>

        <div v-if="coreValues.length === 0" class="text-gray-500 text-sm">
          No core values added yet.
        </div>

        <div
          v-for="(value, index) in coreValues"
          :key="index"
          class="bg-gray-50 border rounded-xl p-6 mb-4"
        >
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-700">
              Core Value {{ index + 1 }}
            </h3>
            <button
              @click="removeCoreValue(index)"
              class="text-red-500 font-medium hover:underline"
            >
              Remove
            </button>
          </div>

          <input
            v-model="value.title"
            class="w-full p-3 mb-3 border rounded-lg"
            placeholder="Title"
          />

          <textarea
            v-model="value.description"
            rows="3"
            class="w-full p-3 border rounded-lg"
            placeholder="Description"
          ></textarea>
        </div>
      </section>

      <!-- Save Button -->
      <button
        @click="saveChanges"
        class="w-full mt-8 py-3 bg-[#FF8040] text-white font-semibold rounded-lg hover:bg-orange-600"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/api.js';
import { toast } from 'vue-sonner';

const mission = ref('');
const vision = ref('');
const coreValues = ref([]);
const loading = ref(false);

// Fetch About content
const fetchAbout = async () => {
  try {
    const res = await axios.get('/about');
    const data = res.data.about;

    if (data) {
      mission.value = data.mission || '';
      vision.value = data.vision || '';
      coreValues.value = data.coreValues || [];
    }
  } catch (err) {
    console.error('Failed to fetch about data:', err);
    toast.error('Failed to load About section');
  }
};

// Add/remove core values
const addCoreValue = () =>
  coreValues.value.push({ title: '', description: '' });
const removeCoreValue = (index) => coreValues.value.splice(index, 1);

// Save changes
const saveChanges = async () => {
  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Please log in as admin.');

    await axios.put(
      '/about',
      {
        mission: mission.value,
        vision: vision.value,
        coreValues: coreValues.value,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success('About section updated successfully!');

    // Clear fields
    mission.value = '';
    vision.value = '';
    coreValues.value = [];
  } catch (err) {
    console.error('Failed to save:', err);
    toast.error(
      err.response?.data?.message || 'Failed to update About section'
    );
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAbout);
</script>

<style scoped>
/* Loading spinner */
.loader {
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

