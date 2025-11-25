<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-[#001BB7]">Payments</h1>

    <!-- Balance summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center"
      >
        <p class="text-gray-500">Available Balance</p>
        <p class="text-2xl font-bold text-[#0046FF] mt-2">
          $ {{ balance.toFixed(2) }}
        </p>
      </div>
      <div
        class="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center"
      >
        <p class="text-gray-500">Pending Payments</p>
        <p class="text-2xl font-bold text-[#FF8040] mt-2">
          $ {{ pending.toFixed(2) }}
        </p>
      </div>
      <div
        class="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center"
      >
        <p class="text-gray-500">Total Paid</p>
        <p class="text-2xl font-bold text-[#001BB7] mt-2">
          $ {{ totalPaid.toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Payment history table -->
    <div class="bg-white rounded-2xl shadow p-4 overflow-x-auto">
      <table class="min-w-full table-auto">
        <thead class="bg-[#001BB7] text-white rounded-t-2xl">
          <tr>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Project</th>
            <th class="px-4 py-2 text-left">Expert</th>
            <th class="px-4 py-2 text-left">Amount</th>
            <th class="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="payment in payments"
            :key="payment.id"
            class="hover:bg-[#0046FF]/10 cursor-pointer transition"
          >
            <td class="px-4 py-2">{{ formatDate(payment.date) }}</td>
            <td class="px-4 py-2">{{ payment.projectTitle }}</td>
            <td class="px-4 py-2">{{ payment.expertName }}</td>
            <td class="px-4 py-2 font-semibold">
              $ {{ payment.amount.toFixed(2) }}
            </td>
            <td class="px-4 py-2">
              <span
                :class="{
                  'bg-[#0046FF] text-white px-2 py-1 rounded-full text-xs':
                    payment.status === 'Completed',
                  'bg-[#FF8040] text-white px-2 py-1 rounded-full text-xs':
                    payment.status === 'Pending',
                  'bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs':
                    payment.status === 'Failed',
                }"
              >
                {{ payment.status }}
              </span>
            </td>
          </tr>
          <tr v-if="payments.length === 0">
            <td colspan="5" class="text-center py-10 text-gray-500">
              No payment history available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/api.js';

const balance = ref(1250.5);
const pending = ref(300);
const totalPaid = ref(950);

const payments = ref([]);

const loadPayments = async () => {
  try {
    // Replace with your API call
    // const { data } = await axios.get("/client/payments");
    // payments.value = data.payments;

    // Mock data
    payments.value = [
      {
        id: 'pay1',
        date: '2025-11-20T10:30:00Z',
        projectTitle: 'Market Research Report',
        expertName: 'Jane Doe',
        amount: 500,
        status: 'Completed',
      },
      {
        id: 'pay2',
        date: '2025-11-22T14:15:00Z',
        projectTitle: 'Competitive Analysis',
        expertName: 'John Smith',
        amount: 300,
        status: 'Pending',
      },
      {
        id: 'pay3',
        date: '2025-11-23T09:00:00Z',
        projectTitle: 'Customer Survey',
        expertName: 'Alice Johnson',
        amount: 150,
        status: 'Completed',
      },
    ];
  } catch (err) {
    console.error('Failed to load payments', err);
  }
};

onMounted(() => {
  loadPayments();
});

const formatDate = (date) => {
  const d = new Date(date);
  return (
    d.toLocaleDateString() +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
};
</script>

<style scoped>
/* Tailwind colors already applied, add custom spacing or tweaks if needed */
</style>
