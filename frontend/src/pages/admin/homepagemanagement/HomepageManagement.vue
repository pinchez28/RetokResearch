<template>
  <div class="p-6 pt-20 space-y-6">
    <!-- HEADER / BREADCRUMB -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
    >
      <div>
        <h1 class="text-3xl font-bold text-[#001BB7]">Homepage Management</h1>
        <p class="text-gray-600 mt-1">
          Manage all sections of your homepage efficiently.
        </p>
      </div>
      <!-- Optional quick action button -->
      <button
        class="mt-2 md:mt-0 bg-[#FF8040] hover:bg-[#FFA366] text-[#001BB7] font-semibold px-4 py-2 rounded-lg transition"
      >
        Add New Section
      </button>
    </div>

    <!-- SUBMENU / CARDS NAVIGATION (optional) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <router-link
        to="/admin/homepage/services"
        class="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center hover:shadow-lg transition text-center"
      >
        <span class="font-semibold text-[#001BB7]">Services Section</span>
      </router-link>

      <router-link
        to="/admin/homepage/experts"
        class="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center hover:shadow-lg transition text-center"
      >
        <span class="font-semibold text-[#001BB7]">Top Experts</span>
      </router-link>

      <router-link
        to="/admin/homepage/about"
        class="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center hover:shadow-lg transition text-center"
      >
        <span class="font-semibold text-[#001BB7]">About Section</span>
      </router-link>

      <router-link
        to="/admin/homepage/contact"
        class="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center hover:shadow-lg transition text-center"
      >
        <span class="font-semibold text-[#001BB7]">Contact Section</span>
      </router-link>
    </div>

    <!-- RENDER CHILD COMPONENTS -->
    <div class="mt-6 bg-white rounded-2xl shadow p-6">
      <router-view />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
/* Optional hover effect for submenu cards */
.router-link-active {
  border-top: 4px solid #ff8040;
}
</style>
