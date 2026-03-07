<template>
  <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
          >
            Job Title
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
          >
            Your Quote
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
          >
            Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
          >
            Submitted
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <tr
          v-for="item in proposals"
          :key="item._id"
          class="hover:bg-gray-50 transition cursor-pointer"
          @click="$emit('row-click', item)"
        >
          <td class="px-6 py-4 font-medium text-gray-900">
            <div class="flex items-center">
              <div
                :class="getStatusDotClass(item.status)"
                class="w-2 h-2 rounded-full mr-3"
              ></div>
              {{ item.job?.title || 'Job' }}
            </div>
          </td>
          <td class="px-6 py-4 text-gray-700">
            KES {{ formatCurrency(item.quote || 0) }}
          </td>
          <td class="px-6 py-4">
            <span
              class="px-2.5 py-1 text-xs rounded-full font-semibold"
              :class="getStatusColorClass(item.status)"
            >
              {{ item.status || 'pending' }}
            </span>
          </td>
          <td class="px-6 py-4 text-gray-500 text-sm">
            {{ formatDate(item.createdAt) }}
          </td>
          <td class="px-6 py-4">
            <button
              @click.stop="$emit('view-proposal', item)"
              class="text-[#001BB7] hover:text-[#0046FF] text-sm font-medium"
            >
              View Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatCurrency, formatDate } from '@/utils/formatters.js';

defineProps({
  proposals: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['view-proposal', 'row-click']);

const getStatusDotClass = (status) => {
  const colors = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-purple-500',
    under_review: 'bg-indigo-500',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-500';
};

const getStatusColorClass = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    under_review: 'bg-indigo-100 text-indigo-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
</script>
