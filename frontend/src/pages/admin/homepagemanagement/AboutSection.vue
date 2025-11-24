<template>
  <section class="admin-about py-10 max-w-6xl mx-auto px-4">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold">About Page Management</h2>

      <!-- Delete Entire About Page -->
      <button
        @click="deleteAllAbout"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Delete Entire About Page
      </button>
    </div>

    <!-- Editing Notice -->
    <div v-if="isEditing" class="mb-6">
      <div
        class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold flex items-center"
      >
        <span class="mr-2">✏️</span> You are editing the About Page
      </div>
    </div>

    <!-- Mission -->
    <div
      class="mb-6 p-5 bg-blue-50 rounded-xl shadow-lg border-2 transition"
      :class="isEditing ? 'border-blue-500' : 'border-transparent'"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-lg">Mission</h3>
        <span v-if="isEditing" class="text-sm text-blue-700 font-medium"
          >Editing</span
        >
      </div>

      <textarea
        v-model="mission"
        rows="3"
        class="w-full border rounded p-2"
        @input="startEditing"
      ></textarea>
    </div>

    <!-- Vision -->
    <div
      class="mb-6 p-5 bg-blue-50 rounded-xl shadow-lg border-2 transition"
      :class="isEditing ? 'border-blue-500' : 'border-transparent'"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-lg">Vision</h3>
        <span v-if="isEditing" class="text-sm text-blue-700 font-medium"
          >Editing</span
        >
      </div>

      <textarea
        v-model="vision"
        rows="3"
        class="w-full border rounded p-2"
        @input="startEditing"
      ></textarea>
    </div>

    <!-- Core Values -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Core Values</h3>
        <button
          @click="addCoreValue"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Core Value
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-5">
        <div
          v-for="(value, index) in coreValues"
          :key="index"
          class="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border-2 relative transition"
          :class="isEditing ? 'border-blue-500' : 'border-transparent'"
        >
          <button
            @click="deleteCoreValue(index)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="Delete"
          >
            🗑
          </button>

          <input
            v-model="value.title"
            placeholder="Title"
            class="w-full border rounded px-2 py-1 mb-2"
            @input="startEditing"
          />

          <textarea
            v-model="value.description"
            placeholder="Description"
            rows="3"
            class="w-full border rounded px-2 py-1"
            @input="startEditing"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="text-center mt-8">
      <button
        @click="saveAbout"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
      >
        Save Changes
      </button>
    </div>
  </section>
</template>

<script>
import axios from '@/utils/api.js';

export default {
  name: 'AdminAboutPage',
  data() {
    return {
      mission: '',
      vision: '',
      coreValues: [],
      isEditing: false,
    };
  },

  async mounted() {
    await this.fetchAbout();
  },

  methods: {
    async fetchAbout() {
      try {
        const res = await axios.get('/about');
        const about = res.data.about;

        if (about) {
          this.mission = about.mission;
          this.vision = about.vision;
          this.coreValues = about.coreValues || [];
        }
      } catch (err) {
        console.error('Failed to fetch About page', err);
      }
    },

    startEditing() {
      this.isEditing = true;
    },

    addCoreValue() {
      this.coreValues.push({ title: '', description: '' });
      this.startEditing();
    },

    deleteCoreValue(index) {
      this.coreValues.splice(index, 1);
      this.startEditing();
    },

    async deleteAllAbout() {
      if (!confirm('Are you sure you want to delete the entire About page?'))
        return;

      try {
        await axios.delete('/about');
        alert('About page deleted completely.');

        // Clear UI
        this.mission = '';
        this.vision = '';
        this.coreValues = [];
        this.isEditing = false;
      } catch (err) {
        alert('Failed to delete About page');
      }
    },

    async saveAbout() {
      try {
        await axios.post('/about', {
          mission: this.mission,
          vision: this.vision,
          coreValues: this.coreValues,
        });

        alert('About page updated successfully!');
        this.isEditing = false;
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to save changes');
      }
    },
  },
};
</script>

<style scoped>
textarea {
  resize: vertical;
}
</style>
