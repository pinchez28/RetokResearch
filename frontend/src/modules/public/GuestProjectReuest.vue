<template>
  <div class="min-h-screen bg-primary-900">
    <!-- Hero Section -->
    <section
      class="bg-primary-800 text-accent-500 py-28 text-center rounded-b-3xl"
      id="guest-project-request"
    >
      <h1
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent-400 text-center animate-fadeUp"
        style="font-size: clamp(2rem, 5vw, 4rem)"
      >
        Submit Your Project
      </h1>
      <p
        class="mt-6 text-lg md:text-xl animate-fadeUp delay-150 font-light text-primary-200"
      >
        Tell us about your project and our team will review it shortly.
      </p>
    </section>

    <!-- Request Form -->
    <section
      class="relative z-10 -mt-20 max-w-3xl mx-auto py-24 px-6 bg-primary-700 rounded-3xl shadow-2xl shadow-primary-900/50 animate-fadeUp delay-300 overflow-hidden"
    >
      <!-- Subtle animated pattern -->
      <div
        class="absolute inset-0 opacity-10 bg-gradient-to-br from-primary-600 to-primary-500 animate-pulse-slow pointer-events-none"
      ></div>

      <form @submit.prevent="submitRequest" class="grid gap-6 relative z-10">
        <!-- Floating Input -->
        <div class="floating-group">
          <input
            v-model="name"
            type="text"
            placeholder=" "
            required
            class="floating-input peer"
          />
          <label class="floating-label">Full Name *</label>
        </div>

        <div class="floating-group">
          <input
            v-model="email"
            type="email"
            placeholder=" "
            required
            class="floating-input peer"
          />
          <label class="floating-label">Email Address *</label>
        </div>

        <div class="floating-group">
          <input v-model="phone" type="tel" placeholder=" " class="floating-input peer" />
          <label class="floating-label">Phone Number</label>
        </div>

        <div class="floating-group">
          <input
            v-model="topic"
            type="text"
            placeholder=" "
            required
            class="floating-input peer"
          />
          <label class="floating-label">Project Topic / Title *</label>
        </div>

        <div class="floating-group">
          <AutoTextArea
            v-model="description"
            placeholder=" "
            required
            class="floating-input peer"
          />
          <label class="floating-label">Project Description *</label>
        </div>

        <div class="floating-group">
          <input
            v-model="deadline"
            type="date"
            placeholder=" "
            required
            class="floating-input peer"
          />
          <label class="floating-label">Deadline *</label>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="bg-accent-500 hover:bg-accent-400 text-primary-900 font-extrabold uppercase py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 text-lg"
        >
          {{ loading ? "Submitting..." : "Submit Request" }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { guestApi } from "@/core/api/http.js";
import AutoTextArea from "@/components/shared/AutoTextArea.vue";

const name = ref("");
const email = ref("");
const phone = ref("");
const topic = ref("");
const description = ref("");
const deadline = ref("");
const loading = ref(false);

const submitRequest = async () => {
  if (
    !name.value ||
    !email.value ||
    !topic.value ||
    !description.value ||
    !deadline.value
  ) {
    return Swal.fire({
      icon: "warning",
      title: "Missing Required Fields",
      text: "Please fill in all required fields.",
      confirmButtonColor: "#04293A", // primary-800
    });
  }

  loading.value = true;

  try {
    await guestApi.submitGuestRequest({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      topic: topic.value.trim(),
      description: description.value.trim(),
      deadline: new Date(deadline.value),
    });

    await Swal.fire({
      icon: "success",
      title: "Request Submitted Successfully",
      text: "Your request has been received and is under review.",
      confirmButtonColor: "#04293A", // primary-800
    });

    name.value = "";
    email.value = "";
    phone.value = "";
    topic.value = "";
    description.value = "";
    deadline.value = "";
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "Something went wrong. Please try again.",
      confirmButtonColor: "#ECB365", // accent-500
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Floating Label */
.floating-group {
  position: relative;
}

.floating-input {
  @apply w-full p-4 rounded-xl bg-primary-500 text-white border border-primary-400 shadow-md
  transition-all duration-300 focus:outline-none;
}

/* Brighter placeholder color */
.floating-input::placeholder {
  color: #cbd5e1; /* light gray */
  opacity: 0.7;
}

/* Floating label styles */
.floating-label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #cbd5e1;
  pointer-events: none;
  transition: all 0.3s ease;
}

/* Label floats when input has value or is focused/hovered */
.peer:focus ~ .floating-label,
.peer:not(:placeholder-shown) ~ .floating-label,
.peer:hover ~ .floating-label {
  top: -0.6rem;
  left: 0.8rem;
  font-size: 0.75rem;
  color: #ecb365;
  background: #064663;
  padding: 0 0.3rem;
  border-radius: 4px;
}

/* Focus input effects: gradient border + soft inner glow */
.floating-input:focus {
  border: 2px solid transparent;
  background-image: linear-gradient(#064663, #064663),
    linear-gradient(135deg, #ecb365, #0e7490);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.15), 0 6px 20px rgba(0, 0, 0, 0.35);
}

/* Hero & general animations */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeUp {
  animation: fadeUp 1s ease-out forwards;
}

.delay-150 {
  animation-delay: 0.15s;
}
.delay-300 {
  animation-delay: 0.3s;
}

/* Animated subtle background pattern */
@keyframes pulseSlow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.15;
  }
}

.animate-pulse-slow {
  animation: pulseSlow 6s ease-in-out infinite;
}
</style>
