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
import Navbar from "@/components/navbar/Navbar.vue";
import Footer from "@/components/footer/Footer.vue";
</script>
