<template>
  <section
    id="testimonials"
    class="py-12 px-6 md:px-12 lg:px-20 bg-gray-50 overflow-hidden relative"
  >
    <h2
      class="text-4xl md:text-5xl font-extrabold text-center mb-8 text-primary text-green-600"
    >
      What Our Clients Say
    </h2>

    <p class="text-center text-gray-600 max-w-2xl mx-auto mb-14">
      Hear from researchers and organizations who trust us with their academic
      and market research needs.
    </p>

    <!-- Scrolling container -->
    <div class="relative w-full overflow-hidden">
      <div class="flex animate-scroll gap-8">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center min-w-[250px] flex-shrink-0"
        >
          <img
            :src="testimonial.photo"
            alt="testimonial.name"
            class="w-20 h-20 rounded-full mb-4 border-2 border-primary"
          />
          <h3 class="text-lg font-semibold text-gray-800 mb-1">
            {{ testimonial.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">{{ testimonial.role }}</p>
          <p class="text-gray-700 italic">"{{ testimonial.feedback }}"</p>
        </div>

        <!-- Duplicate cards for seamless scroll -->
        <div
          v-for="testimonial in testimonials"
          :key="'duplicate-' + testimonial.id"
          class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center min-w-[250px] flex-shrink-0"
        >
          <img
            :src="testimonial.photo"
            alt="testimonial.name"
            class="w-20 h-20 rounded-full mb-4 border-2 border-primary"
          />
          <h3 class="text-lg font-semibold text-gray-800 mb-1">
            {{ testimonial.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">{{ testimonial.role }}</p>
          <p class="text-gray-700 italic">"{{ testimonial.feedback }}"</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    name: 'Dr. Jane Mwangi',
    role: 'PhD Candidate, University of Nairobi',
    photo: 'https://i.pravatar.cc/150?img=32',
    feedback:
      'The team guided me through my dissertation with exceptional expertise and attention to detail.',
  },
  {
    id: 2,
    name: 'Samuel Ochieng',
    role: 'Business Analyst, TechCorp Ltd',
    photo: 'https://i.pravatar.cc/150?img=12',
    feedback:
      'Their market research insights helped our company make confident, data-driven decisions.',
  },
  {
    id: 3,
    name: 'Prof. Amina Ali',
    role: 'Research Supervisor, Strathmore University',
    photo: 'https://i.pravatar.cc/150?img=45',
    feedback:
      'A reliable service for both students and researchers. Highly recommended.',
  },
];
</script>

<style scoped>
/* Continuous scroll animation */
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  display: flex;
  gap: 2rem;
  animation: scroll 20s linear infinite;
}
</style>
