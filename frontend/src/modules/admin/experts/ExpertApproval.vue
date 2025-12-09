<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-[#001BB7]">Pending Experts</h1>

    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead class="bg-[#001BB7] text-white">
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
        <tr
          v-for="expert in experts"
          :key="expert._id"
          class="border-b hover:bg-[#F5F1DC]/40 transition"
        >
          <td class="px-4 py-2 font-semibold">{{ expert.name }}</td>
          <td>{{ expert.user.email }}</td>
          <td>{{ expert.phone }}</td>
          <td>{{ expert.specialization }}</td>
          <td>
            <span
              :class="{
                'text-yellow-500': expert.status === 'pending_admin_review',
                'text-green-500': expert.status === 'approved',
                'text-red-500': expert.status === 'rejected',
              }"
              class="font-semibold"
            >
              {{ expert.status }}
            </span>
          </td>
          <td class="text-center space-x-2">
            <button
              @click="openExpertModal(expert)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              View Details
            </button>
          </td>
        </tr>
        <tr v-if="experts.length === 0">
          <td colspan="6" class="text-center py-6 text-gray-500">
            No pending experts.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Expert Details Modal -->
    <div
      v-if="selectedExpert"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
      >
        <button
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          @click="selectedExpert = null"
        >
          ✖
        </button>

        <h2 class="text-2xl font-bold mb-4 text-[#001BB7]">
          {{ selectedExpert.name }}'s Profile
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Email:</strong> {{ selectedExpert.user.email }}</div>
          <div><strong>Phone:</strong> {{ selectedExpert.phone }}</div>
          <div>
            <strong>Specialization:</strong> {{ selectedExpert.specialization }}
          </div>
          <div>
            <strong>Experience:</strong> {{ selectedExpert.experience }} years
          </div>
          <div><strong>Education:</strong> {{ selectedExpert.education }}</div>
          <div><strong>Bio:</strong> {{ selectedExpert.bio }}</div>
        </div>

        <div class="mt-4">
          <strong>Certifications:</strong>
          <span v-if="selectedExpert.certifications.length">
            {{ selectedExpert.certifications.join(', ') }}
          </span>
          <span v-else>—</span>
        </div>

        <div class="mt-4">
          <strong>Portfolio:</strong>
          <ul class="list-disc ml-5">
            <li v-for="(p, i) in selectedExpert.portfolio" :key="i">
              <a
                :href="p"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                {{ p }}
              </a>
            </li>
          </ul>
          <span v-if="selectedExpert.portfolio.length === 0">—</span>
        </div>

        <div class="mt-4">
          <strong>CV PDF:</strong>
          <div v-if="selectedExpert.cvPdf">
            <a
              :href="selectedExpert.cvPdf"
              target="_blank"
              class="text-blue-600 hover:underline"
            >
              View CV
            </a>
          </div>
          <span v-else>—</span>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="approveExpert(selectedExpert._id)"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
          <button
            @click="rejectExpert(selectedExpert._id)"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
const experts = ref([]);
const selectedExpert = ref(null);

// -------------------- SOCKET.IO --------------------
const socket = io('http://localhost:4000');
socket.emit('joinRoom', { userId: 'admin', role: 'admin' });

socket.on('notification', () => {
  fetchExperts();
});

// -------------------- FETCH PENDING EXPERTS --------------------
const fetchExperts = async () => {
  try {
    const { data } = await axios.get(
      'http://localhost:4000/api/admin/experts/pending',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    experts.value = data.data;
  } catch (err) {
    console.error('Failed to fetch experts:', err);
  }
};

// -------------------- MODAL --------------------
const openExpertModal = (expert) => {
  selectedExpert.value = expert;
};

// -------------------- APPROVE --------------------
const approveExpert = async (id) => {
  const result = await Swal.fire({
    title: 'Approve Expert?',
    text: 'Are you sure you want to approve this expert?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/experts/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('Approved!', 'The expert has been approved.', 'success');
      selectedExpert.value = null;
      fetchExperts();
    } catch (err) {
      Swal.fire('Error', 'Failed to approve expert', 'error');
    }
  }
};

// -------------------- REJECT --------------------
const rejectExpert = async (id) => {
  const result = await Swal.fire({
    title: 'Reject Expert?',
    text: 'Are you sure you want to reject this expert?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/experts/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('Rejected!', 'The expert has been rejected.', 'success');
      selectedExpert.value = null;
      fetchExperts();
    } catch (err) {
      Swal.fire('Error', 'Failed to reject expert', 'error');
    }
  }
};

onMounted(fetchExperts);
</script>

<style scoped>
/* Smooth modal scroll for long profiles */
.modal-content {
  overflow-y: auto;
}
</style>

