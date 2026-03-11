<template>
  <div class="min-h-screen bg-slate-50 px-6 py-10">
    <!-- Back -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-indigo-600"
    >
      <ArrowLeft class="w-4 h-4" />
      Back
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-24 text-slate-500">
      Loading payment details…
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-24 text-red-600">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="project" class="max-w-xl mx-auto space-y-6">
      <!-- Project Summary -->
      <section
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
      >
        <h1 class="text-xl font-semibold text-slate-800">
          {{ project.title }}
        </h1>
        <p class="mt-1 text-sm text-slate-600">{{ project.description }}</p>

        <div class="mt-4 space-y-2 text-sm">
          <p>
            <strong>Status:</strong>
            <span class="capitalize">{{ project.status }}</span>
          </p>

          <p>
            <strong>Amount:</strong>
            <span class="font-semibold text-indigo-600">
              KES {{ project.finalAmount ?? project.budget }}
            </span>
          </p>
        </div>
      </section>

      <!-- Payment Box -->
      <section
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
      >
        <h2
          class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"
        >
          <CreditCard class="w-5 h-5 text-indigo-600" />
          Complete Payment
        </h2>

        <p class="text-sm text-slate-600 mb-4">
          Payment is required before you can download the final submission.
        </p>

        <!-- Phone Input -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            M-Pesa Phone Number
          </label>

          <input
            v-model="phone"
            @blur="handleBlurNormalize"
            type="tel"
            inputmode="numeric"
            placeholder="07XXXXXXXX or 01XXXXXXXX"
            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :disabled="paying"
          />

          <p class="text-xs text-slate-400 mt-1">
            Accepted formats: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX,
            +2547XXXXXXXX
          </p>
        </div>

        <!-- Failed Payment Alert -->
        <p
          v-if="project?.paymentStatus === 'failed'"
          class="text-red-600 text-sm mb-2"
        >
          Your previous payment attempt failed. Click “Retry Payment” to try
          again.
        </p>

        <!-- Pay Button -->
        <button
          @click="handlePayment"
          :disabled="paying"
          class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF8040] hover:bg-[#26c506] text-gray-900 uppercase font-extrabold transition disabled:opacity-60"
        >
          <Loader2 v-if="paying" class="w-5 h-5 animate-spin" />
          <span>
            {{
              paying
                ? 'Processing payment…'
                : project?.paymentStatus === 'failed'
                  ? 'Retry Payment'
                  : 'Pay Now'
            }}
          </span>
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { clientApi } from '@/core/api/http';
import { io } from 'socket.io-client';

import { ArrowLeft, CreditCard, Loader2 } from 'lucide-vue-next';

/* -----------------------------
   Route & State
-------------------------------- */
const route = useRoute();
const router = useRouter();
const projectId = route.params.projectId;

const project = ref(null);
const loading = ref(true);
const error = ref('');
const paying = ref(false);
const phone = ref('');

let stkTimeout = null;

/* -----------------------------
   Socket.IO Setup
-------------------------------- */
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');

function joinProjectRoom() {
  socket.emit('join-project', projectId);

  socket.on('project-paid', (data) => {
    if (data.projectId === projectId) {
      clearTimeout(stkTimeout);
      paying.value = false;
      project.value.paymentStatus = 'confirmed';
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Payment Confirmed',
        text: 'You can now download your project.',
        confirmButtonColor: '#4f46e5',
      });
    }
  });
}

onUnmounted(() => {
  socket.off('project-paid');
  clearTimeout(stkTimeout);
});

/* -----------------------------
   Kenyan Phone Validation
-------------------------------- */
function isValidKenyanPhone(value) {
  const cleaned = value.replace(/\s+/g, '');
  return /^(?:\+254|254|0)?(7\d{8}|1\d{8})$/.test(cleaned);
}

function normalizePhone(value) {
  let p = value.replace(/\s+/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) p = '254' + p.slice(1);
  return p;
}

function handleBlurNormalize() {
  if (isValidKenyanPhone(phone.value))
    phone.value = normalizePhone(phone.value);
}

/* -----------------------------
   Load Project
-------------------------------- */
async function loadProject() {
  loading.value = true;
  error.value = '';

  try {
    const res = await clientApi.getProjectById(projectId);
    project.value = res.data.project;

    if (res.data.project.clientPhone)
      phone.value = normalizePhone(res.data.project.clientPhone);

    const statusRes = await clientApi.getProjectPaymentStatus(projectId);
    project.value.paymentStatus = statusRes.data.payment?.status || 'none';
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load payment details.';
  } finally {
    loading.value = false;
  }
}

/* -----------------------------
   Handle Payment / Retry
-------------------------------- */
async function handlePayment() {
  if (paying.value) return;

  if (!phone.value || !isValidKenyanPhone(phone.value)) {
    await Swal.fire({
      icon: 'warning',
      title: 'Invalid Phone Number',
      text: 'Enter a valid Kenyan mobile number.',
      confirmButtonColor: '#4f46e5',
    });
    return;
  }

  paying.value = true;
  const normalized = normalizePhone(phone.value);

  try {
    const statusRes = await clientApi.getProjectPaymentStatus(projectId);
    const status = statusRes.data.payment?.status;

    if (['failed', 'cancelled', 'timeout'].includes(status)) {
      await clientApi.retryProjectPayment(projectId, normalized);
    } else {
      await clientApi.initiateProjectPayment(projectId, normalized);
    }

    project.value.paymentStatus = 'pending';

    // Show loader modal
    Swal.fire({
      icon: 'info',
      title: 'Check Your Mobile Device',
      text: 'Please complete payment on your device.',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // -------------------- Sandbox / fallback --------------------
    // If using sandbox test numbers, simulate confirmation
    if (['254708374149', '254708374150', '254708374151'].includes(normalized)) {
      // Auto-fire event in 2 seconds
      stkTimeout = setTimeout(() => {
        socket.emit('project-paid', { projectId });
      }, 2000);
      return;
    }

    // -------------------- Production fallback --------------------
    // If no callback received in 60 seconds, allow user to manually check
    stkTimeout = setTimeout(async () => {
      paying.value = false;
      Swal.close();

      const { value: confirm } = await Swal.fire({
        icon: 'warning',
        title: 'Payment Pending',
        text: 'Payment is still not confirmed. Click "I have paid" to check status.',
        showCancelButton: true,
        confirmButtonText: 'I have paid',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
      });

      if (confirm) {
        const statusRes = await clientApi.getProjectPaymentStatus(projectId);
        project.value.paymentStatus = statusRes.data.payment?.status || 'none';

        if (project.value.paymentStatus === 'confirmed') {
          Swal.fire({
            icon: 'success',
            title: 'Payment Confirmed',
            text: 'You can now download your project.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Payment Not Confirmed',
            text: 'Payment is still pending. Please try again.',
          });
        }
      }
    }, 60000);
  } catch (err) {
    console.error(err);
    paying.value = false;
    clearTimeout(stkTimeout);

    if (err.response?.status === 409) {
      await Swal.fire({
        icon: 'warning',
        title: 'Payment Already Initiated',
        text: 'This project has already been paid or is currently in progress.',
        confirmButtonColor: '#f59e0b',
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text:
          err.response?.data?.message ||
          'Payment could not be initiated. Please try again.',
        confirmButtonColor: '#dc2626',
      });
    }
  }
}

/* -----------------------------
   Lifecycle
-------------------------------- */
onMounted(async () => {
  await loadProject();
  joinProjectRoom();
});
</script>
