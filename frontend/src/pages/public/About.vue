<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mission & Vision -->
    <section id="about" class="py-24 max-w-6xl mx-auto px-6">
      <!-- Section Heading -->
      <div class="text-center mb-16 animate-fadeUp">
        <h1 class="text-5xl md:text-6xl font-extrabold text-[#001bb7] mb-4">
          About <span class="text-[#FF8040]">Retok</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-700">
          Learn about our mission, vision, and core values that drive excellence in
          research collaboration.
        </p>
      </div>

      <!-- Mission & Vision Columns -->
      <div class="grid md:grid-cols-2 gap-12">
        <div class="animate-fadeLeft">
          <h2 class="text-4xl font-bold mb-4 text-[#001bb7]">Our Mission</h2>
          <p class="text-gray-700 text-lg">
            To provide a seamless platform where researchers, academics, and professionals
            can find trusted expertise to accelerate their projects and elevate the
            quality of research.
          </p>
        </div>

        <div class="animate-fadeRight">
          <h2 class="text-4xl font-bold mb-4 text-[#001bb7]">Our Vision</h2>
          <p class="text-gray-700 text-lg">
            To be the global standard for verified, high-quality research collaboration
            and knowledge exchange.
          </p>
        </div>
      </div>
    </section>

    <!-- Team / Values -->
    <section class="py-16 bg-[#001bb7] max-w-6xl mx-auto px-6 text-center rounded-3xl">
      <h2 class="text-4xl font-bold mb-12 text-white animate-fadeUp">Core Values</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          class="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition animate-fadeUp delay-150"
        >
          <h3 class="font-bold text-xl mb-2 text-[#001bb7]">Integrity</h3>
          <p class="text-gray-600">Trusted and verified experts ensuring quality work.</p>
        </div>
        <div
          class="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition animate-fadeUp delay-300"
        >
          <h3 class="font-bold text-xl mb-2 text-[#001bb7]">Collaboration</h3>
          <p class="text-gray-600">Seamless teamwork between researchers and experts.</p>
        </div>
        <div
          class="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition animate-fadeUp delay-450"
        >
          <h3 class="font-bold text-xl mb-2 text-[#001bb7]">Innovation</h3>
          <p class="text-gray-600">
            Advanced tools and insights for better research outcomes.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Navbar from "@/components/navbar/Navbar.vue";
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
.delay-150 {
  animation-delay: 0.15s;
}
.delay-300 {
  animation-delay: 0.3s;
}
.delay-450 {
  animation-delay: 0.45s;
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
  box-shadow: 0 35px 60px rgba(0, 27, 183, 0.25);
}
</style>
