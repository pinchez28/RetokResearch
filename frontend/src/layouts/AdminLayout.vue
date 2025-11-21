<template>
  <div class="admin-layout flex min-h-screen bg-[#F5F1DC]">
    <!-- Sidebar -->
    <AdminSidebar
      class="hidden md:flex flex-col w-64 bg-[#001BB7] text-white"
    />

    <!-- Main area -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <AdminTopbar />

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6 main-content">
        <router-view />
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/pages/admin/AdminSidebar.vue';
import AdminTopbar from '@/pages/admin/AdminTopbar.vue';
import Footer from '@/components/footer/Footer.vue';
</script>

<style scoped>
/* Dynamic topbar height */
:root {
  --topbar-height: 4rem; /* Adjust this to match AdminTopbar height */
}

.main-content {
  padding-top: var(--topbar-height);
  scrollbar-width: thin;
  scrollbar-color: #0046ff #f5f1dc;
}

.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: #0046ff;
  border-radius: 4px;
}

/* Ensure sidebar and layout are full height */
.admin-layout {
  min-height: 100vh;
}
</style>
