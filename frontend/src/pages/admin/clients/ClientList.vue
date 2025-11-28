<template>
  <div class="p-6 text-[#001BB7]">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-[#001BB7]">All Clients</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or email..."
        class="px-4 py-2 rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-[#FF8040]"
      />
    </div>

    <!-- STATUS FILTER -->
    <div class="flex gap-3 mb-6">
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

    <!-- CLIENT TABLE -->
    <div class="bg-white rounded-lg shadow p-6">
      <table class="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-[#FF8040] text-[#001BB7]">
            <th class="px-4 py-2 border">Name</th>
            <th class="px-4 py-2 border">Email</th>
            <th class="px-4 py-2 border">Phone</th>
            <th class="px-4 py-2 border">Company</th>
            <th class="px-4 py-2 border">Status</th>
            <th class="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in filteredClients"
            :key="client.id"
            class="text-center border-t border-gray-200 hover:bg-gray-100"
          >
            <td class="px-4 py-2">{{ client.name }}</td>
            <td class="px-4 py-2">{{ client.email }}</td>
            <td class="px-4 py-2">{{ client.phone || "N/A" }}</td>
            <td class="px-4 py-2">{{ client.company || "N/A" }}</td>
            <td class="px-4 py-2">
              <span
                class="px-3 py-1 rounded-md font-semibold"
                :style="{
                  backgroundColor: statusColors[client.status],
                  color: '#001BB7',
                }"
              >
                {{ formatStatus(client.status) }}
              </span>
            </td>
            <td class="px-4 py-2">
              <button
                class="px-3 py-1 rounded-md font-semibold text-white"
                style="background-color: #001bb7"
                @click="viewClient(client.id)"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredClients.length === 0">
            <td colspan="6" class="py-4 text-gray-500">No clients found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// DUMMY CLIENT DATA
const clients = ref([
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+254712345678",
    company: "Acme Ltd.",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "",
    company: "",
    status: "pending",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+254711223344",
    company: "Research Co.",
    status: "suspended",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("all");

const statusColors = {
  active: "#00E676",
  pending: "#FFA366",
  suspended: "#FF8040",
};

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

const filteredClients = computed(() => {
  return clients.value
    .filter(
      (client) => filterStatus.value === "all" || client.status === filterStatus.value
    )
    .filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const resetFilters = () => {
  filterStatus.value = "all";
  searchQuery.value = "";
};

const viewClient = (id) => {
  router.push(`/admin/clients-management/${id}`);
};
</script>

<style scoped>
table th,
table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 0.5rem;
}
</style>
