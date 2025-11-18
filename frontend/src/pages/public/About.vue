<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="bg-[#001bb7] text-white py-32 relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold animate-fadeUp">
          About Retok
        </h1>
        <p
          class="mt-6 text-lg md:text-xl text-gray-200 animate-fadeUp delay-150"
        >
          Connecting you with verified research experts for collaboration,
          review, and analysis.
        </p>
      </div>
      <!-- Background blob -->
      <div
        class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-40 animate-blobFloatReverse"
      ></div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
      <div class="animate-fadeLeft">
        <h2 class="text-4xl font-bold mb-4">Our Mission</h2>
        <p class="text-gray-700 text-lg">
          To provide a seamless platform where researchers, academics, and
          professionals can find trusted expertise to accelerate their projects
          and elevate the quality of research.
        </p>
      </div>
      <div class="animate-fadeRight">
        <h2 class="text-4xl font-bold mb-4">Our Vision</h2>
        <p class="text-gray-700 text-lg">
          To be the global standard for verified, high-quality research
          collaboration and knowledge exchange.
        </p>
      </div>
    </section>

    <!-- Team / Values -->
    <section class="py-8 bg-gray-50 max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-4xl font-bold mb-12 animate-fadeUp">Core Values</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition animate-fadeUp delay-150"
        >
          <h3 class="font-bold text-xl mb-2">Integrity</h3>
          <p class="text-gray-600">
            Trusted and verified experts ensuring quality work.
          </p>
        </div>
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition animate-fadeUp delay-300"
        >
          <h3 class="font-bold text-xl mb-2">Collaboration</h3>
          <p class="text-gray-600">
            Seamless teamwork between researchers and experts.
          </p>
        </div>
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition animate-fadeUp delay-450"
        >
          <h3 class="font-bold text-xl mb-2">Innovation</h3>
          <p class="text-gray-600">
            Advanced tools and insights for better research outcomes.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/Navbar.vue';
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

@keyframes blobFloatReverse {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-25px) translateX(-15px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}
.animate-blobFloatReverse {
  animation: blobFloatReverse 10s ease-in-out infinite;
}
</style>
