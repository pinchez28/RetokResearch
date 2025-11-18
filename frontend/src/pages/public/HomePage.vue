<template>
  <div>
    <Navbar />
    <HeroSection />
    <HowItWorksSection />
    <ServicesSection />
    <WhyUsSection />
    <TestimonialSection />
    <FeatureSection />
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/Navbar.vue';
import HeroSection from './HeroSection.vue';
import FeatureSection from './FeatureSection.vue'; // <-- updated
import HowItWorksSection from './HowItWorksSection.vue';
import WhyUsSection from './WhyUsSection.vue';
import ServicesSection from './ServicesSection.vue';
import TestimonialSection from './TestimonialSection.vue';
</script>
