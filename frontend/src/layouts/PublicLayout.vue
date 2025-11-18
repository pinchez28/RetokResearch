<template>
  <div
    class="min-h-screen bg-gradient-to-b from-primary via-primaryLight to-neutralSoft flex flex-col"
  >
    <!-- Navbar -->
    <Navbar :role="'public'" />

    <!-- Page content injected here -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/Navbar.vue';
import Footer from '@/components/footer/Footer.vue';
</script>
