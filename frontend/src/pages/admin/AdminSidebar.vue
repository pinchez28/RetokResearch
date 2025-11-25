<template>
  <aside
    class="hidden md:flex flex-col w-64 bg-[#001BB7] text-[#F5F1DC] fixed top-0 bottom-0 z-40 shadow-lg"
  >
    <!-- LOGO / TITLE -->
    <div
      class="h-16 flex items-center justify-center text-2xl font-bold border-b border-[#0046FF]"
    >
      Academin
    </div>

    <!-- NAVIGATION LINKS -->
    <nav class="flex-1 px-4 py-6 overflow-y-auto">
      <!-- Dashboard -->
      <router-link
        :to="'/admin'"
        class="block px-4 py-3 rounded-md font-medium transition-colors duration-200 no-underline"
        :class="
          isActive('/admin')
            ? 'bg-[#FF8040] text-[#001BB7]'
            : 'text-[#F5F1DC] hover:bg-[#FFA366] hover:text-[#001BB7]'
        "
      >
        Dashboard
      </router-link>

      <!-- Homepage Management Section -->
      <div class="mt-4 mb-2 px-2 text-sm font-semibold text-[#FFA366]">
        Homepage Management
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in homepageLinks"
          :key="link.name"
          :to="link.path"
          class="block px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm no-underline"
          :class="
            isActive(link.path)
              ? 'bg-[#FF8040] text-[#001BB7]'
              : 'text-[#F5F1DC] hover:bg-[#0046FF] hover:text-[#F5F1DC]'
          "
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Support Section -->
      <div class="mt-6 mb-2 px-2 text-sm font-semibold text-[#FFA366]">
        Support
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in supportLinks"
          :key="link.name"
          :to="link.path"
          class="block px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm no-underline"
          :class="
            isActive(link.path)
              ? 'bg-[#FF8040] text-[#001BB7]'
              : 'text-[#F5F1DC] hover:bg-[#0046FF] hover:text-[#F5F1DC]'
          "
        >
          {{ link.name }}
        </router-link>
      </div>
    </nav>

    <!-- LOGOUT BUTTON -->
    <div class="px-4 py-6 border-t border-[#0046FF]">
      <button
        @click="logout"
        class="w-full bg-[#FF8040] hover:bg-[#FFA366] text-[#001BB7] font-bold py-2 rounded-md transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

// Homepage management links
const homepageLinks = [
  { name: 'Homepage', path: '/admin/homepage' },
  { name: 'Services', path: '/admin/homepage/services' },
  { name: 'Top Experts', path: '/admin/homepage/experts' },
  { name: 'About Section', path: '/admin/homepage/about' },
  { name: 'Contact Section', path: '/admin/homepage/contact' },
];

// Support links
const supportLinks = [
  { name: 'Guest Support', path: '/admin/guest-support' },
  { name: 'Client Support', path: '/admin/client-support' },
  { name: 'Expert Support', path: '/admin/expert-support' },
];

// Only active if route path exactly matches
const isActive = (path) => route.path === path;

const logout = () => router.push('/login');
</script>

<style scoped>
aside {
  z-index: 40;
}

/* Scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 6px;
}
nav::-webkit-scrollbar-thumb {
  background-color: #0046ff;
  border-radius: 3px;
}
nav {
  scrollbar-width: thin;
  scrollbar-color: #0046ff #001bb7;
}

/* Remove underlines globally from router-links in sidebar */
a {
  text-decoration: none;
}
</style>
