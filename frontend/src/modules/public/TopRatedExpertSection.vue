<template>
  <section
    id="top-rated-experts"
    class="py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#001BB7]/80 via-[#0046FF]/70 to-[#F5F1DC]/50"
  >
    <!-- Section Title -->
    <h2
      class="animate-fadeUp font-extrabold text-white text-center drop-shadow-lg mb-16"
      style="font-size: clamp(2rem, 5vw, 4rem)"
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
        <p class="text-yellow-400 font-bold mb-4">
          ⭐ {{ expert.rating.toFixed(1) }}
        </p>

        <button
          @click="openProfile(expert)"
          class="bg-white text-[#0046FF] font-semibold py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
        >
          View Profile
        </button>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] animate-fadeIn"
      @click.self="closeModal"
    >
      <div
        class="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl animate-scaleUp relative"
      >
        <!-- Close Button -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl font-bold"
          @click="closeModal"
        >
          ✕
        </button>

        <!-- Profile Info -->
        <div class="flex flex-col items-center text-center">
          <img
            :src="selectedExpert.photo"
            :alt="selectedExpert.name"
            class="w-24 h-24 rounded-full mb-3 border-2 border-[#0046FF] shadow-lg"
          />
          <h3 class="text-xl font-bold text-gray-800">
            {{ selectedExpert.name }}
          </h3>
          <p class="text-gray-600 text-sm">{{ selectedExpert.role }}</p>

          <p class="text-yellow-500 font-bold text-lg mt-2">
            ⭐ {{ selectedExpert.rating.toFixed(1) }}
          </p>

          <p class="text-gray-700 mt-4 leading-relaxed">
            {{
              selectedExpert.bio ||
              'This expert is highly qualified and trusted by students worldwide. More detailed biography will appear here once backend is connected.'
            }}
          </p>
        </div>

        <!-- CTA -->
        <button
          class="mt-6 w-full bg-gradient-to-r from-[#0046FF] to-[#001BB7] text-white font-bold py-2 rounded-lg shadow hover:scale-105 transition"
        >
          Request This Expert
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

/* Dummy Data */
const topExperts = ref([
  {
    _id: 'exp-1',
    name: 'Dr. Alice Johnson',
    role: 'Data Science Expert',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    bio: 'Alice has 10+ years of experience in Data Science and Machine Learning.',
  },
  {
    _id: 'exp-2',
    name: 'Prof. Michael Smith',
    role: 'Market Research Analyst',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    bio: 'Michael specializes in global market research and competitive analysis.',
  },
  {
    _id: 'exp-3',
    name: 'Dr. Sophia Lee',
    role: 'Academic Writing Specialist',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 4.9,
    bio: 'Sophia has authored multiple academic journals and guides students in writing.',
  },
  {
    _id: 'exp-4',
    name: 'Mr. David Brown',
    role: 'Business Research Consultant',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
    bio: 'David has extensive experience in business modeling and consultancy.',
  },
  {
    _id: 'exp-5',
    name: 'Dr. Emily Clark',
    role: 'Innovation & Product Expert',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 4.7,
    bio: 'Emily is a product innovation strategist with outstanding reviews.',
  },
]);

// Modal state
const showModal = ref(false);
const selectedExpert = ref({});

const openProfile = (expert) => {
  selectedExpert.value = expert;
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};

// Dynamic gradient for cards
const getExpertCardGradient = (id) => {
  switch (id) {
    case 'exp-1':
      return 'background: linear-gradient(135deg, #001BB7, #0046FF)';
    case 'exp-2':
      return 'background: linear-gradient(135deg, #FF8040, #F5F1DC)';
    case 'exp-3':
      return 'background: linear-gradient(135deg, #0046FF, #FF8040)';
    case 'exp-4':
      return 'background: linear-gradient(135deg, #001BB7, #FF8040)';
    case 'exp-5':
      return 'background: linear-gradient(135deg, #0046FF, #F5F1DC)';
    default:
      return 'background: linear-gradient(135deg, #001BB7, #0046FF)';
  }
};
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeUp {
  animation: fadeUp 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes scaleUp {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scaleUp {
  animation: scaleUp 0.3s ease-out forwards;
}
</style>

