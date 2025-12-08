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
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <router-link
        v-for="link in links"
        :key="link.name"
        :to="link.path"
        class="block px-4 py-3 rounded-md font-medium transition-colors duration-200 no-underline"
        :class="
          isActive(link.path)
            ? 'bg-[#FF8040] text-[#001BB7]'
            : 'text-[#F5F1DC] hover:bg-[#FFA366] hover:text-[#001BB7]'
        "
      >
        {{ link.name }}
      </router-link>
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

// ⭐ Expert Navigation Links (Projects added)
const links = [
  { name: 'Dashboard', path: '/expert/dashboard' },
  { name: 'Projects', path: '/expert/projects' },
  { name: 'Available Jobs', path: '/expert/jobs' },
  { name: 'Assignments', path: '/expert/assignments' },
  { name: 'Profile', path: '/expert/profile' },
  { name: 'Support', path: '/expert/support' },
];

const isActive = (path) => route.path === path;

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
aside {
  z-index: 40;
}

/* Remove underlines from all links */
a {
  text-decoration: none;
}
</style>
