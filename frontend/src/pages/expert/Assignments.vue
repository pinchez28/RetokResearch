<template>
  <div class="bg-white p-6 rounded-3xl shadow-2xl overflow-x-auto">
    <h2 class="text-3xl font-bold text-[#001bb7] mb-4">My Assignments</h2>
    <table class="w-full table-auto border-collapse text-left">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2">Title</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Due Date</th>
          <th class="px-4 py-2">Client</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(assignment, idx) in assignments"
          :key="idx"
          class="border-b hover:bg-gray-50 transition"
        >
          <td class="px-4 py-2">{{ assignment.title }}</td>
          <td class="px-4 py-2">{{ assignment.status }}</td>
          <td class="px-4 py-2">{{ assignment.dueDate }}</td>
          <td class="px-4 py-2">{{ assignment.client }}</td>
        </tr>
      </tbody>
    </table>
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
</script>
