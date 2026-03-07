<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Pending Experts</h1>

    <table class="min-w-full text-left">
      <thead class="bg-gray-800 text-white">
        <tr>
          <th class="px-4 py-2">Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Specialization</th>
          <th>Status</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expert in experts" :key="expert._id" class="border-b">
          <td class="px-4 py-2">{{ expert.name }}</td>
          <td>{{ expert.user.email }}</td>
          <td>{{ expert.phone }}</td>
          <td>{{ expert.specialization }}</td>
          <td>{{ expert.status }}</td>
          <td class="text-center space-x-2">
            <button
              @click="approveExpert(expert._id)"
              class="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              @click="rejectExpert(expert._id)"
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const token = localStorage.getItem('token');
const experts = ref([]);

const fetchExperts = async () => {
  const { data } = await axios.get(
    'http://localhost:4000/api/admin/experts/pending',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  experts.value = data.data;
};

const approveExpert = async (id) => {
  await axios.put(
    `http://localhost:4000/api/admin/experts/${id}/approve`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  fetchExperts();
};

const rejectExpert = async (id) => {
  await axios.put(
    `http://localhost:4000/api/admin/experts/${id}/reject`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  fetchExperts();
};

onMounted(fetchExperts);
</script>

