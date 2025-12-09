<template>
  <div class="admin-layout flex min-h-screen bg-[#F5F1DC]">
    <!-- Sidebar -->
    <AdminSidebar
      class="hidden md:flex flex-col w-64 bg-[#001BB7] text-[#F5F1DC] fixed top-0 bottom-0 z-40 shadow-lg"
    />

    <div class="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
      <!-- Topbar -->
      <AdminTopbar class="fixed top-0 left-0 right-0 z-50 md:left-64" />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pt-16 p-6">
        <div class="content-wrapper pb-24">
          <router-view />
        </div>
      </main>

      <!-- Footer -->
      <Footer class="flex-shrink-0" />
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/modules/admin/index/AdminSidebar.vue';
import AdminTopbar from '@/modules/admin/index/AdminTopbar.vue';
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

/* Footer padding */
.content-wrapper {
  padding-bottom: 4rem;
}
</style>
