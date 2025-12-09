<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-bold text-[#001BB7] mb-6">My Assignments</h2>

    <!-- Assignment Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(assignment, idx) in assignments"
        :key="idx"
        class="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          {{ assignment.title }}
        </h3>
        <p class="text-sm text-gray-500 mb-1">
          <strong>Client:</strong> {{ assignment.client }}
        </p>
        <p class="text-sm text-gray-500 mb-1">
          <strong>Due Date:</strong> {{ formatDate(assignment.dueDate) }}
        </p>
        <p
          class="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-green-100 text-green-800': assignment.status === 'Completed',
            'bg-yellow-100 text-yellow-800': assignment.status === 'Pending',
            'bg-red-100 text-red-800': assignment.status === 'Overdue',
          }"
        >
          {{ assignment.status }}
        </p>
      </div>
    </div>

    <!-- No assignments message -->
    <p v-if="assignments.length === 0" class="text-gray-500 mt-6 text-center">
      No assignments found.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const assignments = ref([
  {
    title: 'Data Analysis Report',
    status: 'Pending',
    dueDate: '2025-12-31',
    client: 'John Doe',
  },
  {
    title: 'AI Research Paper',
    status: 'Completed',
    dueDate: '2025-11-15',
    client: 'Jane Smith',
  },
]);

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
</script>

<style scoped></style>

