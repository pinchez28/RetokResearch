<template>
  <section
    id="top-rated-experts"
    class="py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#001BB7]/80 via-[#0046FF]/70 to-[#F5F1DC]/50"
  >
    <!-- Section Title -->
    <h2
      class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center text-white drop-shadow-lg animate-fadeUp"
    >
      Top Rated Research Experts
    </h2>

    <!-- Experts Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto"
    >
      <div
        v-for="expert in topExperts"
        :key="expert._id"
        class="p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
        :style="getExpertCardGradient(expert._id)"
      >
        <img
          :src="expert.photo"
          :alt="expert.name"
          class="w-24 h-24 rounded-full mb-4 border-2 border-white shadow-lg"
        />
        <h3 class="text-lg font-semibold text-white mb-1">{{ expert.name }}</h3>
        <p class="text-sm text-white/80 mb-2">{{ expert.role }}</p>
        <p class="text-yellow-400 font-bold mb-4">⭐ {{ expert.rating.toFixed(1) }}</p>
        <button
          @click="$emit('viewProfile', expert._id)"
          class="bg-white text-[#0046FF] font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
        >
          View Profile
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

/* Dummy Data - ready for backend integration */
const topExperts = ref([
  {
    _id: "exp-1",
    name: "Dr. Alice Johnson",
    role: "Data Science Expert",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    _id: "exp-2",
    name: "Prof. Michael Smith",
    role: "Market Research Analyst",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
  },
  {
    _id: "exp-3",
    name: "Dr. Sophia Lee",
    role: "Academic Writing Specialist",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4.9,
  },
  {
    _id: "exp-4",
    name: "Mr. David Brown",
    role: "Business Research Consultant",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
  },
  {
    _id: "exp-5",
    name: "Dr. Emily Clark",
    role: "Innovation & Product Expert",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 4.7,
  },
]);

// Dynamic gradient for cards
const getExpertCardGradient = (id) => {
  switch (id) {
    case "exp-1":
      return "background: linear-gradient(135deg, #001BB7, #0046FF);";
    case "exp-2":
      return "background: linear-gradient(135deg, #FF8040, #F5F1DC);";
    case "exp-3":
      return "background: linear-gradient(135deg, #0046FF, #FF8040);";
    case "exp-4":
      return "background: linear-gradient(135deg, #001BB7, #FF8040);";
    case "exp-5":
      return "background: linear-gradient(135deg, #0046FF, #F5F1DC);";
    default:
      return "background: linear-gradient(135deg, #001BB7, #0046FF);";
  }
};
</script>

<style scoped>
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
  animation: fadeUp 0.8s cubic-bezier(0.22, 0.9, 0.35, 1) forwards;
}
</style>
