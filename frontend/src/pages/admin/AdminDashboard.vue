<template>
  <div class="admin-dashboard flex flex-col min-h-screen bg-[#F5F1DC]">
    <div class="flex flex-1">
      <!-- Sidebar would go here if needed -->

      <!-- Main Content -->
      <main class="flex-1 p-6 pt-20 overflow-y-auto">
        <h1 class="text-3xl font-bold text-[#001BB7] mb-6">
          Homepage & User Support Management
        </h1>

        <!-- Homepage Management Sections -->
        <section class="space-y-6 mb-10">
          <ServiceSection />
          <TopRatedExperts />
          <AboutSection />
          <PublicContactSection />
        </section>

        <!-- User Support Sections -->
        <section class="space-y-6">
          <GuestSupport />
          <ClientSupport />
          <ExpertSupport />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
// Homepage management sections
import ServiceSection from "./homepagemanagement/ServiceSection.vue";
import TopRatedExperts from "./homepagemanagement/TopRatedExperts.vue";
import AboutSection from "./homepagemanagement/AboutSection.vue";
import PublicContactSection from "./homepagemanagement/PublicContactSection.vue";

// User Support Sections
import GuestSupport from "../admin/homepagemanagement/GuestSupport.vue";
import ClientSupport from "../admin/homepagemanagement/ClientSupport.vue";
import ExpertSupport from "../admin/homepagemanagement/ExpertSupport.vue";
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
}

/* optional scrollbar styling for main content */
main {
  scrollbar-width: thin;
  scrollbar-color: #0046ff #f5f1dc;
}

main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-thumb {
  background-color: #0046ff;
  border-radius: 4px;
}
</style>
