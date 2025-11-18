<template>
  <section id="whyus" class="py-12 px-6 md:px-12 lg:px-20 bg-gray-50">
    <h2 class="text-4xl font-extrabold text-center mb-12 text-primary">
      Why Choose Us
    </h2>

    <FeatureGrid :features="features" />
  </section>
</template>

<script setup>
import FeatureGrid from '@/components/ui/FeatureGrid.vue';

const features = [
  {
    title: 'Verified Experts',
    description: 'All experts are thoroughly vetted and reviewed.',
    icon: '✅',
  },
  {
    title: 'Secure Collaboration',
    description: 'End-to-end secure communication for your projects.',
    icon: '🔒',
  },
  {
    title: 'Fast Turnaround',
    description: 'Quick project delivery without compromising quality.',
    icon: '⚡',
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees; clear pricing for all services.',
    icon: '💰',
  },
  {
    title: 'Global Reach',
    description: 'Access experts from around the world.',
    icon: '🌍',
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored research services to meet your unique needs.',
    icon: '🛠️',
  },
];
</script>
