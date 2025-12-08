<template>
  <section
    id="why-us"
    class="py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#F5F1DC] via-[#FF8040] to-[#0046FF] text-gray-900"
  >
    <!-- Section Title + CTA -->
    <div class="flex flex-col items-center mb-12 gap-6">
      <h2
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#001BB7] animate-fadeUp text-center drop-shadow-xl mb-10"
        style="font-size: clamp(2rem, 5vw, 4rem)"
      >
        Why Choose Us
      </h2>

      <button
        class="bg-[#FF8040] hover:bg-[#2aac10] hover:text-white text-gray-900 font-extrabold uppercase py-4 px-8 rounded-xl transition transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 animate-bounce text-lg"
        @mouseover="hoverCTA"
        @mouseleave="leaveCTA"
        @click="openSignup()"
      >
        Get Started Today
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="card in whyUsCards"
        :key="card._id"
        class="relative p-6 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
        :style="getCardGradient(card._id)"
      >
        <!-- DARK OVERLAY FOR READABILITY -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

        <!-- Card Content -->
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-4">
            <component
              :is="card.icon"
              class="w-12 h-12 text-white drop-shadow-xl"
            />
          </div>

          <h3
            class="text-xl sm:text-2xl font-bold mb-2 text-white drop-shadow-xl"
          >
            {{ card.title }}
          </h3>

          <p
            class="text-sm sm:text-base mb-4 text-white/90 leading-relaxed drop-shadow"
          >
            {{ card.description }}
          </p>

          <ul
            class="list-disc list-inside mb-4 text-white/90 space-y-1 drop-shadow"
          >
            <li v-for="(feature, idx) in card.features" :key="idx">
              {{ feature }}
            </li>
          </ul>

          <button
            @click="card.ctaHandler"
            class="bg-white text-[#0046FF] font-bold py-2 px-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {{ card.ctaText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { BookOpen, Users, Zap, Heart } from 'lucide-vue-next';

const whyUsCards = ref([
  {
    _id: 'wu-1',
    title: 'Expert Researchers',
    description:
      'Our team consists of experienced researchers in various fields ensuring quality work.',
    features: [
      'PhD-level guidance',
      'Years of experience',
      'Field-specific expertise',
    ],
    icon: BookOpen,
    ctaText: 'Learn More',
    ctaHandler: () => alert('Expert Researchers clicked!'),
  },
  {
    _id: 'wu-2',
    title: 'Timely Delivery',
    description:
      'We guarantee to deliver your assignments and reports on time, every time.',
    features: ['Fast turnaround', 'Deadline tracking', 'Real-time updates'],
    icon: Users,
    ctaText: 'See How',
    ctaHandler: () => alert('Timely Delivery clicked!'),
  },
  {
    _id: 'wu-3',
    title: 'Innovative Solutions',
    description:
      'We offer unique and innovative research solutions tailored to your needs.',
    features: [
      'Custom methodologies',
      'Data-driven insights',
      'Creative approach',
    ],
    icon: Zap,
    ctaText: 'Discover More',
    ctaHandler: () => alert('Innovative Solutions clicked!'),
  },
  {
    _id: 'wu-4',
    title: 'Customer Satisfaction',
    description:
      'Your satisfaction is our priority. We work closely to meet your expectations.',
    features: [
      'Dedicated support',
      'Revision options',
      'Transparent communication',
    ],
    icon: Heart,
    ctaText: 'Contact Us',
    ctaHandler: () => alert('Customer Satisfaction clicked!'),
  },
]);

const handleCTA = () => {
  alert('Get Started CTA clicked!');
};

// Dynamic gradients
const getCardGradient = (id) => {
  switch (id) {
    case 'wu-1':
      return 'background: linear-gradient(135deg, #001BB7, #0046FF)';
    case 'wu-2':
      return 'background: linear-gradient(135deg, #FF8040, #F5F1DC)';
    case 'wu-3':
      return 'background: linear-gradient(135deg, #0046FF, #FF8040)';
    case 'wu-4':
      return 'background: linear-gradient(135deg, #F5F1DC, #001BB7)';
    default:
      return 'background: linear-gradient(135deg, #001BB7, #0046FF)';
  }
};

const openSignup = () => window.openSignupOverlay?.();
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

.drop-shadow {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}
.drop-shadow-xl {
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.85);
}
</style>
