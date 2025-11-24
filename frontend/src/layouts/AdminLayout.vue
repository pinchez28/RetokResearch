<template>
  <div class="admin-layout flex flex-col min-h-screen bg-[#F5F1DC]">
    <!-- Topbar always on top -->
    <AdminTopbar class="fixed top-0 left-0 right-0 z-50" />

    <div class="flex flex-1 overflow-hidden pt-16">
      <!-- Sidebar fixed height, never scrolls -->
      <AdminSidebar
        class="hidden md:flex flex-col w-64 bg-[#001BB7] text-white min-h-screen z-40"
      />

      <!-- Main content scrolls independently -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="content-wrapper pb-24">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Footer always at bottom -->
    <Footer class="flex-shrink-0" />
  </div>
</template>

<script setup>
import AdminSidebar from "@/pages/admin/AdminSidebar.vue";
import AdminTopbar from "@/pages/admin/AdminTopbar.vue";
import Footer from "@/components/footer/Footer.vue";
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

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

/* Footer padding for main content */
.content-wrapper {
  padding-bottom: 4rem; /* matches footer height */
}
</style>
