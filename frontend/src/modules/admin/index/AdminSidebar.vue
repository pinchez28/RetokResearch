<template>
  <aside
    class="flex flex-col w-64 bg-primary-900 text-neutral-white h-full shadow-float-md"
  >
    <!-- Logo / Brand -->
    <RouterLink
      to="/admin"
      @click="handleNavigate"
      class="flex items-center space-x-3 sm:space-x-4 px-4 py-4 hover:opacity-90 transition-opacity no-underline hover:no-underline focus:no-underline"
    >
      <!-- Logo -->
      <div class="flex-shrink-0">
        <div class="relative">
          <img
            src="@/assets/images/logo.webp"
            alt="Retok Logo"
            class="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full border-2 border-primary-700 shadow-float-md select-none"
            draggable="false"
          />
          <div
            class="absolute inset-0 rounded-full border border-primary-800 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Brand text -->
      <div class="flex flex-col">
        <span
          class="tracking-tight text-lg sm:text-xl md:text-xl lg:text-2xl font-extrabold text-neutral-gray-100"
        >
          Retok
        </span>

        <span class="text-xs sm:text-sm text-primary-200 font-medium"> Admin Panel </span>
      </div>
    </RouterLink>

    <!-- Navigation -->
    <nav class="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
      <!-- Dashboard -->
      <router-link
        to="/admin"
        @click="handleNavigate"
        class="block px-3 sm:px-4 py-2 sm:py-3 rounded-md font-medium transition-colors duration-200 relative text-sm sm:text-base no-underline hover:no-underline focus:no-underline"
        :class="
          isActive('/admin')
            ? 'bg-accent-500 text-primary-900'
            : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
        "
      >
        Dashboard
        <span
          v-if="unreadCount > 0"
          class="absolute top-2 right-4 bg-accent-500 text-neutral-white text-xs font-bold rounded-full px-2"
        >
          {{ unreadCount }}
        </span>
      </router-link>

      <!-- Jobs Section -->
      <div
        class="mt-6 mb-2 px-2 font-bold text-accent-500 text-sm sm:text-base lg:text-lg"
      >
        Jobs & Workflow
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in jobLinks"
          :key="link.name"
          :to="link.path"
          @click="handleNavigate"
          class="block px-3 sm:px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base no-underline hover:no-underline focus:no-underline"
          :class="
            isActive(link.path)
              ? 'bg-accent-500 text-primary-900'
              : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
          "
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Homepage Section -->
      <div
        class="mt-6 mb-2 px-2 font-bold text-accent-500 text-sm sm:text-base lg:text-lg"
      >
        Homepage
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in homepageLinks"
          :key="link.name"
          :to="link.path"
          @click="handleNavigate"
          class="block px-3 sm:px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base no-underline hover:no-underline focus:no-underline"
          :class="
            isActive(link.path)
              ? 'bg-accent-500 text-primary-900'
              : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
          "
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Clients Section -->
      <div
        class="mt-6 mb-2 px-2 font-bold text-accent-500 text-sm sm:text-base lg:text-lg"
      >
        Client Management
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in clientLinks"
          :key="link.name"
          :to="link.path"
          @click="handleNavigate"
          class="block px-3 sm:px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base no-underline hover:no-underline focus:no-underline"
          :class="
            isActive(link.path)
              ? 'bg-accent-500 text-primary-900'
              : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
          "
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Experts Section -->
      <div
        class="mt-6 mb-2 px-2 font-bold text-accent-500 text-sm sm:text-base lg:text-lg"
      >
        Expert Management
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in expertLinks"
          :key="link.name"
          :to="link.path"
          @click="handleNavigate"
          class="block px-3 sm:px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base no-underline hover:no-underline focus:no-underline"
          :class="
            isActive(link.path)
              ? 'bg-accent-500 text-primary-900'
              : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
          "
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Support Section -->
      <div
        class="mt-6 mb-2 px-2 font-bold text-accent-500 text-sm sm:text-base lg:text-lg"
      >
        Support
      </div>
      <div class="ml-2 space-y-1">
        <router-link
          v-for="link in supportLinks"
          :key="link.name"
          :to="link.path"
          @click="handleNavigate"
          class="block px-3 sm:px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base no-underline hover:no-underline focus:no-underline"
          :class="
            isActive(link.path)
              ? 'bg-accent-500 text-primary-900'
              : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
          "
        >
          {{ link.name }}
        </router-link>
      </div>
    </nav>

    <!-- Logout -->
    <div class="px-4 py-4 sm:py-6 border-t border-primary-700">
      <button
        @click="logout"
        class="w-full bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold py-2 sm:py-3 text-sm sm:text-base rounded-md transition-colors duration-200 shadow-inner-glow"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@/core/store/notificationStore.js";
import { useUIStore } from "@/core/store/uiStore";

const route = useRoute();
const router = useRouter();

const notificationStore = useNotificationStore();
const { unreadCount } = storeToRefs(notificationStore);

const { closeSidebar } = useUIStore();

const handleNavigate = () => {
  closeSidebar();
};

// Links
const homepageLinks = [
  { name: "Top Experts", path: "/admin/homepage/experts" },
  { name: "About Section", path: "/admin/homepage/about" },
];

const jobLinks = [
  { name: "Pending Jobs", path: "/admin/jobs/pending" },
  { name: "Active Jobs", path: "/admin/jobs/active" },
  { name: "Completed Jobs", path: "/admin/jobs/completed" },
  { name: "Disputes", path: "/admin/jobs/disputes" },
];

const clientLinks = [
  { name: "All Clients", path: "/admin/clients" },
  { name: "Client Activity Logs", path: "/admin/clients/logs" },
];

const expertLinks = [
  { name: "Pending Approvals", path: "/admin/experts/pending" },
  { name: "Approved Experts", path: "/admin/experts" },
  { name: "Expert Performance", path: "/admin/experts/performance" },
];

const supportLinks = [
  { name: "Guest Support", path: "/admin/guest-support" },
  { name: "Client Support", path: "/admin/client-support" },
  { name: "Expert Support", path: "/admin/expert-support" },
];

const isActive = (path) => route.path === path;

const logout = () => {
  closeSidebar();
  router.push("/login");
};
</script>

<style scoped>
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
</style>
