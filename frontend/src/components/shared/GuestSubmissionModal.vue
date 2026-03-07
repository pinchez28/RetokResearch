<script setup>
import { reactive, watch, ref } from "vue";
import Swal from "sweetalert2";
import api from "@/core/api/http.js"; // Axios instance

const props = defineProps({
  visible: Boolean,
  service: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const loading = ref(false);

// Reactive form state
const guestForm = reactive({
  name: "",
  email: "",
  topic: "",
  description: "",
  phone: "",
  deadline: "",
});

// Reset form when modal opens or service changes
watch(
  () => [props.visible, props.service],
  ([isVisible, svc]) => {
    if (isVisible) {
      guestForm.name = "";
      guestForm.email = "";
      guestForm.phone = "";
      guestForm.topic = svc?.title || "";
      guestForm.description = svc?.fullDescription || "";
      guestForm.deadline = "";
    }
  }
);

// Simple email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Submit handler
const submitGuestRequest = async () => {
  if (
    !guestForm.name.trim() ||
    !guestForm.email.trim() ||
    !guestForm.phone.trim() ||
    !guestForm.topic.trim() ||
    !guestForm.description.trim() ||
    !guestForm.deadline.trim()
  ) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill in all required fields.",
    });
    return;
  }

  if (!isValidEmail(guestForm.email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address.",
    });
    return;
  }

  loading.value = true;

  try {
    const payload = {
      name: guestForm.name.trim(),
      email: guestForm.email.trim(),
      phone: guestForm.phone.trim(),
      topic: guestForm.topic.trim(),
      description: guestForm.description.trim(),
      deadline: guestForm.deadline.trim(),
      service: props.service?.title || "Quick Request",
    };

    await api.post("/guest/guest-requests", payload);

    Swal.fire({
      icon: "success",
      title: "Request Submitted",
      html: `Your request has been submitted successfully!<br/>
             Admin has been notified and will contact you shortly.`,
    });

    // Reset form
    guestForm.name = "";
    guestForm.email = "";
    guestForm.phone = "";
    guestForm.topic = "";
    guestForm.description = "";
    guestForm.deadline = "";

    emit("close");
  } catch (err) {
    console.error("Error submitting request:", err);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: err.response?.data?.message || "Failed to submit request.",
    });
  } finally {
    loading.value = false;
  }
};

// Redirect to client signup page
const redirectToSignup = () => {
  window.location.href = "/signup/client";
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto"
        style="height: 75vh"
      >
        <!-- Close button -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900 text-center">
          {{
            props.service?.title
              ? `Request "${props.service.title}"`
              : "Quick Research Request"
          }}
        </h3>

        <!-- Guest Form -->
        <form @submit.prevent="submitGuestRequest" class="space-y-6">
          <!-- Name & Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="text-gray-700 font-semibold mb-2">Your Name</label>
              <input
                v-model="guestForm.name"
                type="text"
                placeholder="Enter your full name"
                required
                class="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-gray-700 font-semibold mb-2">Your Email</label>
              <input
                v-model="guestForm.email"
                type="email"
                placeholder="Enter your email"
                required
                class="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Phone & Deadline -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="text-gray-700 font-semibold mb-2">Phone Number</label>
              <input
                v-model="guestForm.phone"
                type="text"
                placeholder="Enter your phone number"
                required
                class="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-gray-700 font-semibold mb-2">Deadline</label>
              <input
                v-model="guestForm.deadline"
                type="text"
                placeholder="DD/MM/YYYY"
                required
                class="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
              <small class="text-gray-400 text-sm mt-1">
                Enter deadline in DD/MM/YYYY format
              </small>
            </div>
          </div>

          <!-- Topic & Description -->
          <div class="flex flex-col">
            <label class="text-gray-700 font-semibold mb-2">Research Topic</label>
            <input
              v-model="guestForm.topic"
              type="text"
              placeholder="Topic of research"
              required
              class="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-gray-700 font-semibold mb-2">Full Description</label>
            <textarea
              v-model="guestForm.description"
              placeholder="Describe your request"
              required
              rows="4"
              class="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <button
              type="submit"
              :disabled="loading"
              class="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50"
            >
              {{ loading ? "Submitting..." : "Submit Request" }}
            </button>
          </div>
        </form>

        <!-- Divider -->
        <hr class="my-6 border-gray-300" />

        <!-- Benefits Section + CTA -->
        <div
          class="p-6 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-2xl transform -translate-y-4"
        >
          <h3 class="text-2xl font-extrabold mb-4 text-white text-center drop-shadow-lg">
            Why Create a Client Account?
          </h3>
          <ul class="list-disc pl-5 space-y-2 text-white text-lg font-semibold mb-6">
            <li>Track your project requests in real time</li>
            <li>Receive email notifications and updates</li>
            <li>Manage multiple projects from a single dashboard</li>
            <li>Save your preferences for faster submissions</li>
            <li>Communicate directly with experts and admins</li>
          </ul>
          <div class="text-center">
            <button
              @click="redirectToSignup"
              class="bg-yellow-400 hover:bg-blue-500 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-1"
            >
              Create a Client Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
