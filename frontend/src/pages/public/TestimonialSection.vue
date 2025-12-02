<template>
  <section
    id="testimonials"
    class="py-12 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#001BB7]/80 via-[#0046FF]/70 to-[#F5F1DC]/50 overflow-hidden relative"
  >
    <h2
      class="animate-fadeUp font-extrabold text-white text-center drop-shadow-lg"
      style="font-size: clamp(2rem, 5vw, 4rem)"
    >
      What Our Clients Say
    </h2>

    <p class="text-center text-white/80 max-w-2xl mx-auto mb-14 mt-10">
      Hear from researchers and organizations who trust us with their academic
      and market research needs.
    </p>

    <!-- Scrolling container -->
    <div class="relative w-full overflow-hidden">
      <div class="flex animate-scroll gap-8">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105"
          :style="getCardGradient(testimonial.id)"
        >
          <img
            :src="testimonial.photo"
            :alt="testimonial.name"
            class="w-20 h-20 rounded-full mb-4 border-2 border-white"
          />
          <h3 class="text-lg font-semibold text-white mb-1">
            {{ testimonial.name }}
          </h3>
          <p class="text-sm text-white/80 mb-4">{{ testimonial.role }}</p>
          <p class="text-white italic">"{{ testimonial.feedback }}"</p>
        </div>

        <!-- Duplicate cards for seamless scroll -->
        <div
          v-for="testimonial in testimonials"
          :key="'duplicate-' + testimonial.id"
          class="p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105"
          :style="getCardGradient(testimonial.id)"
        >
          <img
            :src="testimonial.photo"
            :alt="testimonial.name"
            class="w-20 h-20 rounded-full mb-4 border-2 border-white"
          />
          <h3 class="text-lg font-semibold text-white mb-1">
            {{ testimonial.name }}
          </h3>
          <p class="text-sm text-white/80 mb-4">{{ testimonial.role }}</p>
          <p class="text-white italic">"{{ testimonial.feedback }}"</p>
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

// Dynamic card gradients based on palette
const getCardGradient = (id) => {
  switch (id) {
    case 1:
      return 'background: linear-gradient(135deg, #001BB7, #0046FF);';
    case 2:
      return 'background: linear-gradient(135deg, #FF8040, #F5F1DC);';
    case 3:
      return 'background: linear-gradient(135deg, #0046FF, #FF8040);';
    default:
      return 'background: linear-gradient(135deg, #001BB7, #0046FF);';
  }
};
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
