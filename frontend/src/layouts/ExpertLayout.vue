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

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import ExpertSidebar from '@/modules/expert/ExpertSidebar.vue';
import ExpertNavbar from '@/modules/expert/ExpertNavbar.vue';
import Footer from '@/components/shared/Footer.vue';
</script>

<style scoped>
/* Scrollbar for main content */
main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-thumb {
  background-color: #0046ff;
  border-radius: 4px;
}
main {
  scrollbar-width: thin;
  scrollbar-color: #0046ff #f5f1dc;
}
</style>
