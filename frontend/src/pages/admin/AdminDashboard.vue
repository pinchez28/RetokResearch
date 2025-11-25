<template>
  <div class="p-6 md:p-10 space-y-8">
    <!-- WELCOME HEADER -->
    <section
      class="bg-[#001BB7] text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-bold">Welcome, Admin 👋</h1>
        <p class="mt-2 text-sm md:text-base opacity-90">
          Manage clients, experts, requests, and homepage content efficiently.
        </p>
      </div>
      <button
        class="mt-4 md:mt-0 bg-[#FF8040] hover:bg-[#FFA366] text-[#001BB7] font-semibold px-5 py-2 rounded-lg transition"
      >
        Add New Announcement
      </button>
    </section>

    <!-- STATS CARDS -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#0046FF] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Total Clients</h3>
        <p class="text-3xl font-bold mt-2">120</p>
      </div>
      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#FF8040] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Pending Requests</h3>
        <p class="text-3xl font-bold mt-2">{{ notifications.length }}</p>
      </div>
      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#001BB7] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Total Experts</h3>
        <p class="text-3xl font-bold mt-2">45</p>
      </div>
      <div
        class="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#0046FF] hover:shadow-xl transition"
      >
        <h3 class="text-gray-600 text-sm">Active Projects</h3>
        <p class="text-3xl font-bold mt-2">32</p>
      </div>
    </section>

    <!-- RECENT GUEST REQUESTS -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl md:text-2xl font-semibold text-[#001BB7]">
          Recent Guest Requests
        </h2>
        <button
          @click="viewAllRequests"
          class="text-[#0046FF] hover:underline font-medium"
        >
          View all →
        </button>
      </div>

      <div
        v-if="notifications.length === 0"
        class="bg-white p-6 rounded-2xl shadow text-center text-gray-500"
      >
        No recent requests.
      </div>

      <div v-else class="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Topic
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="item in notifications"
              :key="item._id"
              class="hover:bg-gray-50 cursor-pointer transition"
            >
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                {{ item.name || 'Guest User' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                {{ item.topic }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                {{ formatDate(item.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="openRequest(item)"
                  class="text-[#FF8040] hover:text-[#FFA366] font-semibold"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section
      class="bg-[#FF8040] text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between"
    >
      <h3 class="text-xl font-semibold">Need help managing the platform?</h3>
      <button
        class="mt-3 md:mt-0 bg-white text-[#FF8040] font-semibold px-5 py-2 rounded-lg hover:bg-[#F5F1DC] transition"
      >
        Open Admin Tools
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/utils/api.js';

const router = useRouter();
const notifications = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get('/guest-requests');
    notifications.value = res.data || [];
  } catch (err) {
    console.error('Failed to fetch requests:', err);
  }
});

const viewAllRequests = () => {
  router.push('/admin/guest-support');
};

const openRequest = (request) => {
  console.log('Opening request:', request);
  router.push('/admin/guest-support');
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
/* Optional hover for table rows */
table tr:hover {
  background-color: rgba(0, 27, 183, 0.05);
}
</style>
