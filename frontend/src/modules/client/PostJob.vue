<template>
  <div
    class="max-w-4xl mx-auto mt-10 p-10 rounded-2xl bg-neutral-white dark:bg-primary-800 shadow-float-md animate-fadeUp border border-primary-200 dark:border-primary-700"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 mb-10">
      <div class="p-3 rounded-xl bg-primary-100 dark:bg-primary-700 shadow-inner-glow">
        <FileText class="w-7 h-7 text-primary-600 dark:text-primary-300" />
      </div>

      <h1
        class="text-3xl font-bold text-primary-900 dark:text-primary-200 tracking-tight"
      >
        Post a New Research Job
      </h1>
    </div>

    <form @submit.prevent="submitJob" class="space-y-7">
      <!-- Title -->
      <div>
        <label
          class="flex items-center gap-2 text-primary-800 dark:text-primary-200 font-semibold mb-2"
        >
          <Edit3 class="w-5 h-5 text-primary-500" />
          Research Title
        </label>

        <input
          v-model="title"
          type="text"
          placeholder="Enter the title of the research"
          class="w-full px-4 py-3 rounded-lg border border-primary-200 bg-neutral-white dark:bg-primary-900 text-primary-900 dark:text-primary-200 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label
          class="flex items-center gap-2 text-primary-800 dark:text-primary-200 font-semibold mb-2"
        >
          <FileText class="w-5 h-5 text-primary-500" />
          Research Description
        </label>

        <AutoTextArea
          v-model="description"
          placeholder="Describe your research extensively..."
          class="w-full"
        />

        <p class="text-xs text-primary-400 mt-1">
          Provide a detailed description to attract the right experts.
        </p>
      </div>

      <!-- Deadline -->
      <div>
        <label
          class="flex items-center gap-2 text-primary-800 dark:text-primary-200 font-semibold mb-2"
        >
          <Calendar class="w-5 h-5 text-primary-500" />
          Deadline
        </label>

        <input
          v-model="deadline"
          type="date"
          class="w-full px-4 py-3 rounded-lg border border-primary-200 bg-neutral-white dark:bg-primary-900 text-primary-900 dark:text-primary-200 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
          required
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-400 text-primary-900 font-extrabold uppercase py-3 rounded-lg shadow-float-md transition-all duration-200 disabled:opacity-60"
      >
        <Send class="w-5 h-5" />

        {{ loading ? "Posting..." : "Post Job" }}
      </button>
    </form>

    <!-- Tips -->
    <div
      class="mt-10 flex items-start gap-3 p-5 rounded-xl bg-primary-100 dark:bg-primary-700 border border-primary-200 dark:border-primary-600"
    >
      <Info class="w-6 h-6 text-primary-600 dark:text-primary-300 mt-1" />

      <p class="text-sm text-primary-700 dark:text-primary-200">
        Make sure to provide a clear and detailed description, set realistic deadlines,
        and optionally set a budget to attract high-quality experts. All jobs require
        admin approval before becoming active.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { clientApi } from "@/core/api/http.js";
import AutoTextArea from "@/components/shared/AutoTextArea.vue";

import { FileText, Edit3, Calendar, Info, Send } from "lucide-vue-next";

const router = useRouter();

const title = ref("");
const description = ref("");
const deadline = ref("");
const budget = ref(null);
const loading = ref(false);

const submitJob = async () => {
  if (!title.value.trim() || !description.value.trim() || !deadline.value) {
    return Swal.fire("Incomplete", "Please fill all required fields.", "warning");
  }

  loading.value = true;

  try {
    await clientApi.postJob({
      title: title.value.trim(),
      description: description.value.trim(),
      deadline: deadline.value,
      budget: budget.value,
    });

    await Swal.fire("Success", "Job awaiting admin approval.", "success");
    router.push("/client/job-tracking");
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Failed to post job.", "error");
  } finally {
    loading.value = false;
  }
};
</script>
