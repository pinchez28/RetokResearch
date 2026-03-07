<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center border border-gray-200 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
  >
    <!-- Expert Photo -->
    <img
      :src="photo"
      alt="Expert Photo"
      class="w-28 h-28 rounded-full object-cover mb-4 border-4 border-blue-200"
    />

    <!-- Expert Name -->
    <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
      {{ name }}
    </h3>

    <!-- Expert Role / Field -->
    <p class="text-gray-600 mb-2">{{ role }}</p>

    <!-- Rating -->
    <div class="flex items-center justify-center mb-4">
      <span class="text-yellow-400 mr-1" v-for="star in 5" :key="star">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            v-if="star <= rating"
            d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.783 1.4 8.168L12 18.897l-7.334 3.863 1.4-8.168-5.934-5.783 8.2-1.191z"
          />
          <path
            v-else
            d="M12 17.27l6.18 3.245-1.64-7.03 5.46-5.28-7.19-1.045L12 0 9.19 10.16l-7.19 1.045 5.46 5.28-1.64 7.03L12 17.27z"
          />
        </svg>
      </span>
      <span class="ml-2 text-gray-600 font-medium">{{ rating }}/5</span>
    </div>

    <!-- CTA Button -->
    <button
      @click="$emit('viewProfile', id)"
      class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
    >
      View Profile
    </button>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  name: String,
  role: String,
  photo: String,
  rating: { type: Number, default: 5 },
});
</script>

