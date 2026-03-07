<template>
  <div class="min-h-screen bg-primary-900">
    <!-- Mission & Vision -->
    <section id="about" class="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Heading -->
      <div class="text-center mb-16 animate-fadeUp">
        <h1
          class="font-extrabold text-primary-500 mb-4"
          style="font-size: clamp(2rem, 4vw, 3.75rem); line-height: 1.1"
        >
          About <span class="text-accent-500">Retok</span>
        </h1>
        <p
          class="text-primary-300 text-white"
          style="font-size: clamp(1rem, 1.4vw, 1.25rem); line-height: 1.7"
        >
          Learn about our mission, vision, and core values that drive excellence in
          research collaboration.
        </p>
      </div>

      <!-- Mission & Vision Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="animate-fadeLeft">
          <h2
            class="font-bold mb-4 text-primary-500"
            style="font-size: clamp(1.75rem, 3vw, 2.5rem)"
          >
            Our Mission
          </h2>
          <p
            class="text-primary-300 text-white"
            style="font-size: clamp(1rem, 1.2vw, 1.125rem); line-height: 1.7"
          >
            To empower students, researchers, and professionals by connecting them with
            verified experts, simplifying research workflows, and delivering high-quality
            academic support through technology.
          </p>
        </div>

        <div class="animate-fadeRight">
          <h2
            class="font-bold mb-4 text-primary-500"
            style="font-size: clamp(1.75rem, 3vw, 2.5rem)"
          >
            Our Vision
          </h2>
          <p
            class="text-primary-300 text-white"
            style="font-size: clamp(1rem, 1.2vw, 1.125rem); line-height: 1.7"
          >
            To become Africa’s leading digital research collaboration platform, fostering
            innovation, academic excellence, and impactful knowledge creation worldwide.
          </p>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section
      class="py-16 bg-primary-800 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl"
    >
      <h2
        class="font-bold mb-4 text-primary-500"
        style="font-size: clamp(1.75rem, 3vw, 2.5rem)"
      >
        Core Values
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        <div
          v-for="(value, index) in coreValues"
          :key="index"
          class="bg-primary-700 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition animate-fadeUp"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <h3
            class="font-bold mb-2 text-accent-400"
            style="font-size: clamp(1.1rem, 1.5vw, 1.25rem)"
          >
            {{ value.title }}
          </h3>
          <p
            class="text-primary-200 text-white"
            style="font-size: clamp(0.9rem, 1vw, 1rem); line-height: 1.6"
          >
            {{ value.description }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Fully static data for testing
const coreValues = [
  {
    title: "Excellence",
    description:
      "We are committed to delivering high-quality research assistance and maintaining the highest academic standards.",
  },
  {
    title: "Integrity",
    description:
      "We uphold transparency, honesty, and ethical research practices in all collaborations.",
  },
  {
    title: "Innovation",
    description:
      "We leverage modern technology to simplify research processes and improve outcomes.",
  },
  {
    title: "Collaboration",
    description:
      "We believe strong partnerships between clients and experts drive meaningful impact.",
  },
  {
    title: "Reliability",
    description:
      "We ensure timely communication, dependable delivery, and consistent support.",
  },
  {
    title: "Growth",
    description:
      "We continuously evolve our platform to empower academic and professional success.",
  },
];
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
  animation: fadeUp 1s ease-out forwards;
}

@keyframes fadeLeft {
  0% {
    opacity: 0;
    transform: translateX(-25px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fadeLeft {
  animation: fadeLeft 1s ease-out forwards;
}

@keyframes fadeRight {
  0% {
    opacity: 0;
    transform: translateX(25px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fadeRight {
  animation: fadeRight 1s ease-out forwards;
}

.shadow-3xl {
  box-shadow: 0 35px 60px rgba(4, 28, 50, 0.35);
}
</style>
