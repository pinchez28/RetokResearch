<template>
  <section
    id="why-us"
    class="py-20 px-6 md:px-12 lg:px-20 bg-primary-900 text-neutral-white"
  >
    <!-- Section Title + CTA -->
    <div class="flex flex-col items-center mb-16 gap-8">
      <h2
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent-400 text-center animate-fadeUp"
        style="font-size: clamp(2rem, 5vw, 4rem)"
      >
        Why Choose Us
      </h2>

      <button
        class="bg-accent-500 hover:bg-accent-400 text-gray-900 font-bold uppercase py-4 px-10 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-float-md"
        @click="openSignup"
      >
        Get Started Today
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div
        v-for="card in whyUsCards"
        :key="card._id"
        class="p-8 rounded-3xl bg-primary-800 border border-primary-700 shadow-xl transition-all duration-500 hover:bg-primary-700 hover:-translate-y-2 hover:shadow-2xl"
      >
        <!-- Icon -->
        <div class="flex items-center justify-center mb-6">
          <component
            :is="card.icon"
            class="w-12 h-12 text-accent-500 transition duration-300 hover:scale-110"
          />
        </div>

        <!-- Title -->
        <h3 class="text-xl sm:text-2xl font-bold mb-3 text-neutral-white">
          {{ card.title }}
        </h3>

        <!-- Description -->
        <p class="text-sm sm:text-base mb-4 text-primary-200 leading-relaxed">
          {{ card.description }}
        </p>

        <!-- Features -->
        <ul class="list-disc list-inside mb-6 text-primary-200 space-y-1">
          <li v-for="(feature, idx) in card.features" :key="idx">
            {{ feature }}
          </li>
        </ul>

        <!-- CTA -->
        <button
          @click="card.ctaHandler"
          class="bg-accent-500 text-gray-900 font-semibold py-2 px-5 rounded-xl transition-all duration-300 hover:bg-accent-400 hover:scale-105 shadow-md"
        >
          {{ card.ctaText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { BookOpen, Users, Zap, Heart } from "lucide-vue-next";

const whyUsCards = ref([
  {
    _id: "wu-1",
    title: "Expert Researchers",
    description:
      "Our team consists of experienced researchers in various fields ensuring quality work.",
    features: ["PhD-level guidance", "Years of experience", "Field-specific expertise"],
    icon: BookOpen,
    ctaText: "Learn More",
    ctaHandler: () => alert("Expert Researchers clicked!"),
  },
  {
    _id: "wu-2",
    title: "Timely Delivery",
    description:
      "We guarantee to deliver your assignments and reports on time, every time.",
    features: ["Fast turnaround", "Deadline tracking", "Real-time updates"],
    icon: Users,
    ctaText: "See How",
    ctaHandler: () => alert("Timely Delivery clicked!"),
  },
  {
    _id: "wu-3",
    title: "Innovative Solutions",
    description:
      "We offer unique and innovative research solutions tailored to your needs.",
    features: ["Custom methodologies", "Data-driven insights", "Creative approach"],
    icon: Zap,
    ctaText: "Discover More",
    ctaHandler: () => alert("Innovative Solutions clicked!"),
  },
  {
    _id: "wu-4",
    title: "Customer Satisfaction",
    description:
      "Your satisfaction is our priority. We work closely to meet your expectations.",
    features: ["Dedicated support", "Revision options", "Transparent communication"],
    icon: Heart,
    ctaText: "Contact Us",
    ctaHandler: () => alert("Customer Satisfaction clicked!"),
  },
]);

const openSignup = () => window.openSignupOverlay?.();
</script>
