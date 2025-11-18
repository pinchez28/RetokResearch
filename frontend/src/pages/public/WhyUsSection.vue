<template>
  <section id="why-us" class="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
    <!-- Section Title + CTA -->
    <div class="flex flex-col items-center mb-12 gap-4">
      <h2
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-600 animate-fadeUp text-center"
      >
        Why Choose Us
      </h2>

      <button
        @click="handleCTA"
        class="bg-gradient-to-r from-[#ff8040] to-[#ffb366] text-gray-900 font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl py-2 sm:py-3 px-4 sm:px-6 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300 w-full md:w-auto text-center"
      >
        Get Started Today
      </button>
    </div>

    <!-- Cards Grid -->
    <WhyUsGrid :cards="whyUsCards" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import WhyUsGrid from '@/components/ui/WhyUsGrid.vue';

/* Sample data */
import { BookOpen, Users, Zap, Heart } from 'lucide-vue-next'; // Example icons

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
</style>
