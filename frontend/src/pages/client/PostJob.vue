<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold text-[#001BB7]">Post a New Job</h1>
    <p class="text-gray-600">
      Fill in the details below to post a project and connect with experts.
    </p>

    <form
      @submit.prevent="submitJob"
      class="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
    >
      <!-- Project Title -->
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Project Title</label
        >
        <input
          v-model="title"
          type="text"
          placeholder="Enter project title"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Project Description -->
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Project Description</label
        >
        <textarea
          v-model="description"
          rows="6"
          placeholder="Describe your project requirements"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        ></textarea>
      </div>

      <!-- Project Category / Service -->
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Category / Service</label
        >
        <select
          v-model="service"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        >
          <option value="" disabled>Select a category</option>
          <option value="Research">Research</option>
          <option value="Analysis">Analysis</option>
          <option value="Survey">Survey</option>
          <option value="Report">Report</option>
        </select>
      </div>

      <!-- Deadline -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">Deadline</label>
        <input
          v-model="deadline"
          type="date"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Proposed Budget -->
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Proposed Budget ($)</label
        >
        <input
          v-model="budget"
          type="number"
          min="0"
          placeholder="Enter budget"
          required
          class="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0046FF] shadow"
        />
      </div>

      <!-- Submit Button -->
      <div class="text-right">
        <button
          type="submit"
          :disabled="loading"
          class="bg-[#FF8040] hover:bg-[#FFA366] text-white font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50"
        >
          {{ loading ? 'Posting...' : 'Post Job' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/utils/api.js';

const title = ref('');
const description = ref('');
const service = ref('');
const deadline = ref('');
const budget = ref('');
const loading = ref(false);

const submitJob = async () => {
  if (
    !title.value ||
    !description.value ||
    !service.value ||
    !deadline.value ||
    !budget.value
  )
    return;

  loading.value = true;
  try {
    await axios.post('/guest-requests', {
      name: 'Client User', // Replace with actual client info if available
      email: 'client@example.com', // Replace with actual client email
      topic: title.value,
      description: description.value,
      service: service.value,
      deadline: deadline.value,
      proposedPrice: budget.value,
    });

    // Clear form
    title.value = '';
    description.value = '';
    service.value = '';
    deadline.value = '';
    budget.value = '';

    alert('Job posted successfully!');
  } catch (err) {
    console.error('Failed to post job', err);
    alert('Failed to post job. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Tailwind styling applied; add any extra tweaks if needed */
</style>
