<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar :role="'public'" />

    <!-- Page content -->
    <main class="flex-1 flex flex-col">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/shared/Navbar.vue';
import Footer from '@/components/shared/Footer.vue';
</script>

<style scoped>
/* Optional: add page-level styles here */
</style>
