<template>
  <section
    id="top-rated-experts"
    class="py-20 px-6 md:px-12 lg:px-20 bg-gray-50"
  >
    <!-- Section Title -->
    <h2
      class="text-3xl sm:text-4xl text-green-600 md:text-5xl font-extrabold mb-12 text-center animate-fadeUp"
    >
      Top Rated Experts
    </h2>

    <!-- Experts Grid -->
    <TopRatedExpertsGrid
      :experts="topExperts"
      @viewProfile="handleViewProfile"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import TopRatedExpertsGrid from '@/components/ui/TopRatedExpertGrid.vue';

/* Dummy Data - ready for backend integration */
const topExperts = ref([
  {
    _id: 'exp-1',
    name: 'Dr. Alice Johnson',
    role: 'Data Science Expert',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    _id: 'exp-2',
    name: 'Prof. Michael Smith',
    role: 'Market Research Analyst',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
  },
  {
    _id: 'exp-3',
    name: 'Dr. Sophia Lee',
    role: 'Academic Writing Specialist',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 4.9,
  },
  {
    _id: 'exp-4',
    name: 'Mr. David Brown',
    role: 'Business Research Consultant',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
  },
  {
    _id: 'exp-5',
    name: 'Dr. Emily Clark',
    role: 'Innovation & Product Expert',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 4.7,
  },
]);

const handleViewProfile = (id) => {
  alert(`View profile of expert ID: ${id}`);
  // Later: navigate to expert profile page
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
