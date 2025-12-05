<template>
  <div class="flex flex-col">
    <HeroSection />
    <About />
    <HowItWorksSection />
    <AvailableJobsSection />
    <!-- Only place to render Available Jobs -->
    <ServicesSection />
    <WhyUsSection />
    <TestimonialSection />
    <TopRatedExpertSection />
    <Contact />
    <CTASection />
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import HeroSection from "./HeroSection.vue";
import About from "./About.vue";
import HowItWorksSection from "./HowItWorksSection.vue";
import AvailableJobsSection from "./AvailableJobsSection.vue";
import ServicesSection from "./ServicesSection.vue";
import WhyUsSection from "./WhyUsSection.vue";
import TestimonialSection from "./TestimonialSection.vue";
import TopRatedExpertSection from "./TopRatedExpertSection.vue";
import Contact from "./Contact.vue";
import CTASection from "./CTASection.vue";
import Navbar from "@/components/navbar/Navbar.vue";

const route = useRoute();

// Scroll to section if query.scrollTo exists
const scrollToQuerySection = () => {
  const id = route.query.scrollTo;
  if (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

onMounted(() => scrollToQuerySection());

watch(
  () => route.query.scrollTo,
  () => scrollToQuerySection()
);
</script>
