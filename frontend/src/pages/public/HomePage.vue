<template>
  <div>
    <Navbar />

    <HeroSection />

    <About />
    <HowItWorksSection />
    <AvailableJobsSection />
    <ServicesSection />

    <WhyUsSection />
    <TestimonialSection />
    <TopRatedExpertSection />
    <Contact />
    <CTASection />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import Navbar from '@/components/navbar/Navbar.vue';
import HeroSection from './HeroSection.vue';
import HowItWorksSection from './HowItWorksSection.vue';
import WhyUsSection from './WhyUsSection.vue';
import AvailableJobsSection from './AvailableJobsSection.vue';
import ServicesSection from './ServicesSection.vue';
import TestimonialSection from './TestimonialSection.vue';
import TopRatedExpertSection from './TopRatedExpertSection.vue';
import About from './About.vue';
import Contact from './Contact.vue';
import CTASection from './CTASection.vue';

const route = useRoute();

// Scroll to section if query.scrollTo exists
const scrollToQuerySection = () => {
  const id = route.query.scrollTo;
  if (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => scrollToQuerySection());

watch(
  () => route.query.scrollTo,
  () => scrollToQuerySection()
);
</script>
