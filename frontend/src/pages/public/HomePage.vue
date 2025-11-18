<template>
  <div>
    <Navbar />
    <HeroSection />
    <HowItWorksSection />
    <ServicesSection />
    <WhyUsSection />
    <TestimonialSection />
    <TopRatedExpertSection />
    <CTASection />
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/Navbar.vue';
import HeroSection from './HeroSection.vue';
import HowItWorksSection from './HowItWorksSection.vue';
import WhyUsSection from './WhyUsSection.vue';
import ServicesSection from './ServicesSection.vue';
import TestimonialSection from './TestimonialSection.vue';
import TopRatedExpertSection from './TopRatedExpertSection.vue';
import CTASection from './CTASection.vue';
</script>
