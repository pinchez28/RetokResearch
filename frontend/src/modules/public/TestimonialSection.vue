<template>
  <section
    id="testimonials"
    class="py-16 px-6 md:px-12 lg:px-20 bg-primary-900 text-neutral-white overflow-hidden relative"
  >
    <!-- Title -->
    <h2
      class="animate-fadeUp font-extrabold text-accent-400 text-center"
      style="font-size: clamp(2rem, 5vw, 4rem)"
    >
      What Our Clients Say
    </h2>

    <!-- Subtitle -->
    <p class="text-center text-primary-200 max-w-2xl mx-auto mb-14 mt-6">
      Hear from researchers and organizations who trust us with their academic and market
      research needs.
    </p>

    <!-- Scrolling container -->
    <div class="relative w-full overflow-hidden">
      <div class="flex animate-scroll gap-10">
        <!-- Original Cards -->
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="p-8 rounded-3xl bg-primary-800 border border-primary-700 shadow-xl flex flex-col items-center text-center min-w-[280px] flex-shrink-0 transition-all duration-500 hover:bg-primary-700 hover:-translate-y-2 hover:shadow-2xl"
        >
          <img
            :src="testimonial.photo"
            :alt="testimonial.name"
            class="w-20 h-20 rounded-full mb-4 border-2 border-accent-500"
          />

          <h3 class="text-lg font-semibold text-neutral-white mb-1">
            {{ testimonial.name }}
          </h3>

          <p class="text-sm text-primary-300 mb-4">
            {{ testimonial.role }}
          </p>

          <p class="text-primary-200 italic">"{{ testimonial.feedback }}"</p>
        </div>

        <!-- Duplicate Cards for seamless scroll -->
        <div
          v-for="testimonial in testimonials"
          :key="'duplicate-' + testimonial.id"
          class="p-8 rounded-3xl bg-primary-800 border border-primary-700 shadow-xl flex flex-col items-center text-center min-w-[280px] flex-shrink-0 transition-all duration-500 hover:bg-primary-700 hover:-translate-y-2 hover:shadow-2xl"
        >
          <img
            :src="testimonial.photo"
            :alt="testimonial.name"
            class="w-20 h-20 rounded-full mb-4 border-2 border-accent-500"
          />

          <h3 class="text-lg font-semibold text-neutral-white mb-1">
            {{ testimonial.name }}
          </h3>

          <p class="text-sm text-primary-300 mb-4">
            {{ testimonial.role }}
          </p>

          <p class="text-primary-200 italic">"{{ testimonial.feedback }}"</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    name: "Dr. Jane Mwangi",
    role: "PhD Candidate, University of Nairobi",
    photo: "https://i.pravatar.cc/150?img=32",
    feedback:
      "The team guided me through my dissertation with exceptional expertise and attention to detail.",
  },
  {
    id: 2,
    name: "Samuel Ochieng",
    role: "Business Analyst, TechCorp Ltd",
    photo: "https://i.pravatar.cc/150?img=12",
    feedback:
      "Their market research insights helped our company make confident, data-driven decisions.",
  },
  {
    id: 3,
    name: "Prof. Amina Ali",
    role: "Research Supervisor, Strathmore University",
    photo: "https://i.pravatar.cc/150?img=45",
    feedback: "A reliable service for both students and researchers. Highly recommended.",
  },
];
</script>

<style scoped>
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
  animation: scroll 25s linear infinite;
}
</style>
