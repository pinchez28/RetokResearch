<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Post a New Job</h1>

    <form @submit.prevent="submitJob" class="space-y-5">
      <!-- Job Title -->
      <div>
        <label for="title" class="block font-semibold mb-1">Job Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="w-full border rounded p-3"
          placeholder="Enter job title"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block font-semibold mb-1"
          >Description</label
        >
        <textarea
          id="description"
          v-model="description"
          class="w-full border rounded p-3"
          rows="5"
          placeholder="Describe your job in detail"
          required
        ></textarea>
      </div>

      <!-- Deadline -->
      <div>
        <label for="deadline" class="block font-semibold mb-1">Deadline</label>
        <input
          id="deadline"
          v-model="deadline"
          type="date"
          class="w-full border rounded p-3"
          required
        />
      </div>

      <!-- Attachments -->
      <div>
        <label for="attachments" class="block font-semibold mb-1"
          >Attachments (Optional)</label
        >
        <input
          id="attachments"
          type="file"
          multiple
          @change="handleAttachments"
          class="w-full border rounded p-3"
        />
        <ul class="mt-2 text-sm text-gray-600">
          <li v-for="file in attachments" :key="file.name">{{ file.name }}</li>
        </ul>
      </div>

      <!-- Budget (Optional) -->
      <div>
        <label class="block font-semibold mb-1"
          >Proposed Budget (Optional)</label
        >
        <div class="flex items-center border rounded p-3">
          <span class="mr-2 text-gray-600 font-semibold">KES</span>
          <input
            v-model.number="budget"
            type="number"
            min="0"
            class="w-full outline-none"
            placeholder="Enter proposed budget"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="bg-blue-600 text-white px-6 py-3 rounded w-full font-semibold"
        :disabled="loading"
      >
        {{ loading ? 'Posting...' : 'Post Job' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const title = ref('');
const description = ref('');
const deadline = ref('');
const attachments = ref([]);
const budget = ref(null);
const loading = ref(false);

const backendURL = import.meta.env.VITE_API_BASE_URL;

// Handle file attachments
const handleAttachments = (e) => {
  attachments.value = Array.from(e.target.files);
};

// Submit job function
const submitJob = async () => {
  if (!title.value || !description.value || !deadline.value) {
    alert('Please fill all required fields.');
    return;
  }

  loading.value = true;

  try {
    // Get logged-in user with profile
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !user.profile) {
      alert('User profile missing. Please login again.');
      loading.value = false;
      return;
    }

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('deadline', deadline.value);
    formData.append('client', user.profile._id); // <--- Important: link job to client profile
    if (budget.value) formData.append('budget', budget.value);
    attachments.value.forEach((file) => formData.append('attachments', file));

    const res = await axios.post(`${backendURL}/api/client/jobs`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Reset form if successful
    title.value = '';
    description.value = '';
    deadline.value = '';
    attachments.value = [];
    budget.value = null;

    alert('Job posted successfully! Awaiting admin approval.');
  } catch (err) {
    console.error('Post job error:', err);
    alert(err.response?.data?.message || 'Error posting job. Try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
}
</style>
