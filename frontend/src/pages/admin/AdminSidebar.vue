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

    ```
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

      <!-- Jobs & Workflow Section -->
      <div class="mt-6 mb-2 px-2 text-sm font-semibold text-[#FFA366]">
        Jobs & Workflow
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in jobLinks"
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

      <!-- Homepage Management Section -->
      <div class="mt-6 mb-2 px-2 text-sm font-semibold text-[#FFA366]">
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

      <!-- Client Management Section -->
      <div class="mt-6 mb-2 px-2 text-sm font-semibold text-[#FFA366]">
        Client Management
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in clientLinks"
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

      <!-- Expert Management Section -->
      <div class="mt-6 mb-2 px-2 text-sm font-semibold text-[#FFA366]">
        Expert Management
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in expertLinks"
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
    ```
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const homepageLinks = [
  { name: 'Homepage', path: '/admin/homepage' },
  { name: 'Services', path: '/admin/homepage/services' },
  { name: 'Top Experts', path: '/admin/homepage/experts' },
  { name: 'About Section', path: '/admin/homepage/about' },
  { name: 'Contact Section', path: '/admin/homepage/contact' },
];

const jobLinks = [
  { name: 'Pending Jobs', path: '/admin/jobs/pending' },
  { name: 'Active Jobs', path: '/admin/jobs/active' },
  { name: 'Completed Jobs', path: '/admin/jobs/completed' },
  { name: 'Disputes', path: '/admin/jobs/disputes' },
];

const clientLinks = [
  { name: 'All Clients', path: '/admin/clients' },
  { name: 'Client Profiles', path: '/admin/clients/profiles' },
  { name: 'Client Activity Logs', path: '/admin/clients/logs' },
];

const expertLinks = [
  { name: 'Pending Approvals', path: '/admin/experts/pending' },
  { name: 'Approved Experts', path: '/admin/experts' },
  { name: 'Expert Performance', path: '/admin/experts/performance' },
];

const supportLinks = [
  { name: 'Guest Support', path: '/admin/guest-support' },
  { name: 'Client Support', path: '/admin/client-support' },
  { name: 'Expert Support', path: '/admin/expert-support' },
];

// Use startsWith so nested routes highlight parent
const isActive = (path) => route.path.startsWith(path);

const logout = () => router.push('/login');
</script>

<style scoped>
aside {
  z-index: 40;
}
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
a {
  text-decoration: none;
}
</style>
