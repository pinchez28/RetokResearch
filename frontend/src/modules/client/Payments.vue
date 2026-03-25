<template>
  <div class="min-h-screen bg-slate-50 px-6 py-10">
    <!-- Back -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-indigo-600"
    >
      <ArrowLeft class="w-4 h-4" /> Back
    </button>

    <div v-if="loading" class="flex justify-center py-24 text-slate-500">
      Loading payment details…
    </div>
    <div v-else-if="error" class="text-center py-24 text-red-600">
      {{ error }}
    </div>

    <div v-else-if="project" class="max-w-xl mx-auto space-y-6">
      <!-- Project Summary -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
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
            <span class="font-semibold text-indigo-600">KES {{ project.budget }}</span>
          </p>
        </div>
      </section>

      <!-- Payment Section -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CreditCard class="w-5 h-5 text-indigo-600" /> Complete Payment
        </h2>

        <!-- Payment Method Selector -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Payment Method</label
          >
          <select
            v-model="paymentMethod"
            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="mpesa_stk">M-Pesa STK Push</option>
            <option value="paybill">Paybill</option>
          </select>
        </div>

        <!-- STK Phone Input -->
        <div v-if="paymentMethod === 'mpesa_stk'" class="mb-5">
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >M-Pesa Phone Number</label
          >
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
            Accepted formats: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX
          </p>
        </div>

        <!-- Paybill Info -->
        <div
          v-if="paymentMethod === 'paybill'"
          class="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm"
        >
          <h3 class="text-lg font-semibold text-green-700 mb-3">
            Pay via M-PESA Paybill
          </h3>

          <p class="text-sm text-slate-600 mb-3">
            Follow the details below to complete your payment:
          </p>

          <div class="space-y-2 text-base">
            <p>
              <span class="font-medium text-slate-600">Paybill Number:</span>
              <span class="ml-2 font-bold text-xl text-green-800 tracking-wide">
                222111
              </span>
            </p>

            <p>
              <span class="font-medium text-slate-600">Account Number:</span>
              <span class="ml-2 font-bold text-xl text-green-800 tracking-wide">
                169624
              </span>
            </p>
          </div>

          <div class="mt-4 p-3 bg-white border border-dashed border-green-300 rounded-lg">
            <p class="text-xs text-slate-500">
              Payment is completed outside this app. After paying, return and confirm from
              your dashboard.
            </p>
          </div>
        </div>

        <!-- Failed payment warning -->
        <p v-if="project?.paymentStatus === 'failed'" class="text-red-600 text-sm mb-2">
          Your previous payment attempt failed. Click “Retry Payment”.
        </p>

        <!-- Pay Button (STK Only) -->
        <div v-if="paymentMethod === 'mpesa_stk'">
          <button
            @click="handlePayment"
            :disabled="paying || !isValidKenyanPhone(phone)"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF8040] hover:bg-[#26c506] text-gray-900 uppercase font-extrabold transition disabled:opacity-60"
          >
            <Loader2 v-if="paying" class="w-5 h-5 animate-spin" />
            <span>
              {{
                paying
                  ? "Processing payment…"
                  : project?.paymentStatus === "failed"
                  ? "Retry Payment"
                  : "Pay Now"
              }}
            </span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { clientApi } from "@/core/api/http";
import { io } from "socket.io-client";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const projectId = route.params.projectId;

const project = ref(null);
const loading = ref(true);
const error = ref("");
const paying = ref(false);
const phone = ref("");
const paymentMethod = ref("mpesa_stk");

let stkTimeout = null;

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");

function joinProjectRoom() {
  socket.emit("join-project", projectId);
  socket.on("project-paid", async (data) => {
    if (data.projectId === projectId) {
      clearTimeout(stkTimeout);
      paying.value = false;
      project.value.paymentStatus = "confirmed";
      Swal.close();
      await Swal.fire({
        icon: "success",
        title: "Payment Confirmed",
        timer: 2000,
        showConfirmButton: false,
      });
      router.replace(`/client/projects/${projectId}`);
    }
  });
}

onUnmounted(() => {
  socket.off("project-paid");
  clearTimeout(stkTimeout);
});

function isValidKenyanPhone(value) {
  const cleaned = value.replace(/\s+/g, "");
  return /^(?:\+254|254|0)?(7\d{8}|1\d{8})$/.test(cleaned);
}

function normalizePhone(value) {
  let p = value.replace(/\s+/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("0")) p = "254" + p.slice(1);
  return p;
}

function handleBlurNormalize() {
  if (isValidKenyanPhone(phone.value)) {
    phone.value = normalizePhone(phone.value);
  }
}

async function loadProject() {
  loading.value = true;
  try {
    const res = await clientApi.getProjectById(projectId);
    project.value = res.data.project;
    if (project.value.clientPhone)
      phone.value = normalizePhone(project.value.clientPhone);

    const statusRes = await clientApi.getProjectPaymentStatus(projectId);
    project.value.paymentStatus = statusRes.data.status || "none";
  } catch (err) {
    console.error(err);
    error.value = "Failed to load payment details.";
  } finally {
    loading.value = false;
  }
}

async function handlePayment() {
  if (paying.value) return;
  paying.value = true;

  try {
    if (paymentMethod.value === "mpesa_stk") {
      if (!phone.value || !isValidKenyanPhone(phone.value)) {
        await Swal.fire({
          icon: "warning",
          title: "Invalid Phone Number",
          text: "Enter a valid Kenyan mobile number.",
          confirmButtonColor: "#4f46e5",
        });
        paying.value = false;
        return;
      }
      await clientApi.initiateProjectPayment(projectId, normalizePhone(phone.value));
      project.value.paymentStatus = "pending";
      Swal.fire({
        icon: "info",
        title: "Check Your Phone",
        text: "Complete the M-Pesa payment on your phone.",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      stkTimeout = setTimeout(async () => {
        paying.value = false;
        Swal.close();
        const { value: confirm } = await Swal.fire({
          icon: "warning",
          title: "Payment Pending",
          text: "Click 'I have paid' to verify payment.",
          showCancelButton: true,
          confirmButtonText: "I have paid",
          cancelButtonText: "Cancel",
        });
        if (confirm) {
          const statusRes = await clientApi.getProjectPaymentStatus(projectId);
          project.value.paymentStatus = statusRes.data.status || "none";
        }
      }, 60000);
    } else if (paymentMethod.value === "paybill") {
      await Swal.fire({
        icon: "info",
        title: "Pay via Paybill",
        html: `Pay KES ${project.value.budget} to <strong>516600</strong> with Account Number: <strong>${project.value.accountNumber}</strong>`,
      });
    }
  } catch (err) {
    console.error(err);
    paying.value = false;
    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: err.response?.data?.message || "Payment could not be initiated.",
    });
  }
}

onMounted(async () => {
  await loadProject();
  joinProjectRoom();
});
</script>
