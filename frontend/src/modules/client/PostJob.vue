<template>
  <div
    class="max-w-4xl mx-auto p-8 bg-neutral-white shadow-float-md rounded-xl mt-8"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <FileText class="w-8 h-8 text-primary-500" />
      <h1 class="text-3xl font-bold text-primary-900">Post a New Job</h1>
    </div>

    <form @submit.prevent="submitJob" class="space-y-6">
      <!-- Job Title -->
      <div>
        <label
          class="flex items-center gap-2 text-primary-800 font-semibold mb-2"
        >
          <Edit3 class="w-5 h-5 text-primary-500" /> Job Title
        </label>
        <input
          v-model="title"
          type="text"
          placeholder="Enter job title"
          class="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label
          class="flex items-center gap-2 text-primary-800 font-semibold mb-2"
        >
          <FileText class="w-5 h-5 text-primary-500" /> Description
        </label>
        <textarea
          v-model="description"
          rows="6"
          placeholder="Enter job description"
          class="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 focus:outline-none transition resize-none"
          required
        ></textarea>

        <p class="text-xs text-primary-300 mt-1">
          Provide a detailed description to attract the right experts.
        </p>
      </div>

      <!-- Deadline -->
      <div>
        <label
          class="flex items-center gap-2 text-primary-800 font-semibold mb-2"
        >
          <Calendar class="w-5 h-5 text-primary-500" /> Deadline
        </label>
        <input
          v-model="deadline"
          type="date"
          class="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
          required
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-400 text-primary-900 uppercase font-extrabold py-3 rounded-lg shadow-md transition disabled:opacity-60"
      >
        <Send class="w-5 h-5" />
        {{ loading ? 'Posting...' : 'Post Job' }}
      </button>
    </form>

    <!-- Tips Card -->
    <div class="mt-8 bg-primary-100 p-4 rounded-lg flex items-start gap-3">
      <Info class="w-6 h-6 text-primary-600 mt-1" />
      <p class="text-sm text-primary-700">
        Make sure to provide a clear and detailed description, set realistic
        deadlines, and optionally set a budget to attract high-quality experts.
        All jobs require admin approval before becoming active.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { clientApi } from '@/core/api/http.js';
import {
  FileText,
  Edit3,
  Calendar,
  DollarSign,
  Info,
  Send,
} from 'lucide-vue-next';

const router = useRouter();

const title = ref('');
const description = ref('');
const deadline = ref('');
const budget = ref(null);
const loading = ref(false);

const submitJob = async () => {
  if (!title.value.trim() || !description.value.trim() || !deadline.value) {
    return Swal.fire(
      'Incomplete',
      'Please fill all required fields.',
      'warning',
    );
  }

  loading.value = true;

  try {
    await clientApi.postJob({
      title: title.value.trim(),
      description: description.value.trim(),
      deadline: deadline.value,
      budget: budget.value,
    });

    await Swal.fire('Success', 'Job awaiting admin approval.', 'success');
    router.push('/client/job-tracking');
  } catch (err) {
    Swal.fire(
      'Error',
      err.response?.data?.message || 'Failed to post job.',
      'error',
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Smooth focus transition */
input:focus,
textarea:focus {
  outline: none;
}
</style>
