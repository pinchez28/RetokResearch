<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6 flex-wrap">
      <h1 class="text-3xl font-bold text-[#001BB7]">All Clients</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, email, or phone..."
        class="px-4 py-2 rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
      />
    </div>

    <!-- STATUS FILTER -->
    <div class="flex gap-3 mb-6 flex-wrap">
      <button
        v-for="status in statusOptions"
        :key="status.value"
        @click="filterStatus = status.value"
        class="px-4 py-2 rounded-md font-semibold transition"
        :class="{
          'bg-[#D4AF37] text-[#001BB7]': filterStatus === status.value,
          'bg-white text-[#001BB7] hover:bg-[#FF8040] hover:text-white':
            filterStatus !== status.value,
        }"
      >
        {{ status.label }}
      </button>
      <button
        class="px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300 text-[#001BB7]"
        @click="resetFilters"
      >
        Reset
      </button>
    </div>

    <!-- CLIENT CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="client in filteredClients"
        :key="client._id"
        @click="openModal(client)"
        class="cursor-pointer bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition"
      >
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ client.name }}</h2>
        <p class="text-gray-900 text-sm">{{ client.email || 'N/A' }}</p>
        <p class="text-gray-900 text-sm">{{ client.phone || 'N/A' }}</p>
        <span
          class="inline-block px-3 py-1 mt-2 rounded-md font-semibold text-sm"
          :style="{
            backgroundColor: statusColors[client.status || 'pending'],
            color: '#001BB7',
          }"
        >
          {{ formatStatus(client.status) }}
        </span>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedClient"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-4xl space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 class="text-2xl font-bold text-gray-900">
          {{ selectedClient.name }}
        </h2>
        <p class="text-gray-900">
          <strong>Email:</strong> {{ selectedClient.email || 'N/A' }}
        </p>
        <p class="text-gray-900">
          <strong>Phone:</strong> {{ selectedClient.phone || 'N/A' }}
        </p>

        <p class="text-gray-900">
          <strong>Status:</strong> {{ formatStatus(selectedClient.status) }}
        </p>
        <p class="text-gray-900">
          <strong>Joined:</strong> {{ formatDate(selectedClient.createdAt) }}
        </p>
        <p class="text-gray-900 font-semibold mt-2">All Projects:</p>
        <ul
          class="list-disc list-inside text-gray-600 max-h-40 overflow-y-auto"
        >
          <li
            v-for="project in selectedClient.projects || []"
            :key="project._id"
          >
            {{ project.title || 'Untitled Project' }}
          </li>
        </ul>

        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <!-- Suspend / Activate -->
          <button
            v-if="selectedClient.status !== 'suspended'"
            @click="updateStatus('suspended')"
            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl font-semibold transition"
          >
            Suspend
          </button>
          <button
            v-else
            @click="updateStatus('active')"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition"
          >
            Activate
          </button>

          <!-- Delete -->
          <button
            @click="deleteClient(selectedClient._id)"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition"
          >
            Delete
          </button>

          <!-- Close -->
          <button
            @click="selectedClient = null"
            class="flex-1 bg-[#FF8040] hover:bg-[#0046FF] text-white py-2 rounded-xl font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const clients = ref([]);
const searchQuery = ref('');
const filterStatus = ref('all');
const selectedClient = ref(null);

const statusColors = {
  active: '#00E676',
  pending: '#FFA366',
  suspended: '#FF8040',
};

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Suspended', value: 'suspended' },
];

// Fetch clients from API
const fetchClients = async () => {
  try {
    const token = localStorage.getItem('token') || '';
    const { data } = await axios.get(
      'http://localhost:4000/api/admin/clients',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    clients.value = data;
  } catch (err) {
    console.error('Failed to fetch clients', err);
  }
};

onMounted(fetchClients);

const filteredClients = computed(() =>
  clients.value
    .filter(
      (c) => filterStatus.value === 'all' || c.status === filterStatus.value
    )
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (c.email &&
          c.email.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (c.phone && c.phone.includes(searchQuery.value))
    )
);

const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : 'N/A';

const resetFilters = () => {
  filterStatus.value = 'all';
  searchQuery.value = '';
};

const openModal = (client) => {
  selectedClient.value = client;
};

// Update client status
const updateStatus = async (status) => {
  if (!selectedClient.value) return;
  try {
    const token = localStorage.getItem('token') || '';
    const { data } = await axios.put(
      `http://localhost:4000/api/admin/clients/${selectedClient.value._id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update modal and list immediately
    selectedClient.value.status = data.status;
    const index = clients.value.findIndex((c) => c._id === data._id);
    if (index !== -1) clients.value[index].status = data.status;
  } catch (err) {
    console.error('Failed to update client status', err);
  }
};

// Delete client
const deleteClient = async (id) => {
  if (!confirm('Are you sure you want to delete this client?')) return;
  try {
    const token = localStorage.getItem('token') || '';
    await axios.delete(`http://localhost:4000/api/admin/clients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    clients.value = clients.value.filter((c) => c._id !== id);
    selectedClient.value = null;
  } catch (err) {
    console.error('Failed to delete client', err);
  }
};
</script>

<style scoped>
/* Optional: card hover effect handled inline */
</style>

