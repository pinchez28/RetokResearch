<template>
  <div class="flex min-h-screen bg-[#F5F1DC]">
    <!-- Sidebar -->
    <ClientSidebar class="hidden md:flex fixed top-0 left-0 h-full z-40" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col ml-0 md:ml-64">
      <!-- Topbar -->
      <ClientNavbar class="fixed top-0 left-0 right-0 z-50" />

      <!-- Scrollable content -->
      <main class="flex-1 overflow-y-auto p-6 pt-16 md:pt-20">
        <router-view />
      </main>

      <!-- Footer fixed at bottom -->
      <Footer class="flex-shrink-0" />
    </div>
  </div>
</template>

<script setup>
import ClientSidebar from '@/pages/client/ClientSidebar.vue';
import ClientNavbar from '@/pages/client/ClientNavbar.vue';
import Footer from '@/components/footer/Footer.vue';
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
