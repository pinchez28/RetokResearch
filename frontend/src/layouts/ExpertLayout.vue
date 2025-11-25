<template>
  <div class="flex">
    <!-- Sidebar -->
    <ExpertSidebar />

    <div class="flex flex-col flex-1 ml-60">
      <!-- Topbar -->
      <ExpertNavbar />

      <!-- Main Content -->
      <main class="mt-16 p-6 bg-[#F5F1DC] min-h-screen overflow-y-auto">
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import ExpertSidebar from '@/pages/expert/ExpertSidebar.vue';
import ExpertNavbar from '@/pages/expert/ExpertNavbar.vue';
import Footer from '@/components/footer/Footer.vue';
</script>
