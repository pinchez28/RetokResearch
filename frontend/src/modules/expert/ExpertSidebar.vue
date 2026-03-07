<template>
  <aside
    class="fixed z-50 top-0 left-0 h-full w-64 bg-primary-900 text-neutral-cream shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo / Brand -->
    <RouterLink
      to="/expert/dashboard"
      class="flex items-center space-x-3 sm:space-x-4 px-4 py-6 hover:opacity-90 transition-opacity"
      @click="closeSidebarOnMobile"
    >
      <div class="flex-shrink-0">
        <img
          src="@/assets/images/logo.jpg"
          alt="Retok Logo"
          class="h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-white/20 shadow-lg select-none"
          draggable="false"
        />
      </div>

      <div class="flex flex-col">
        <span
          class="text-2xl font-bold tracking-tight bg-gradient-to-r from-neutral-white to-blue-100 bg-clip-text text-transparent"
        >
          Retok
        </span>
        <span class="text-sm text-primary-200 font-medium mt-[-2px]">
          Expert Portal
        </span>
      </div>
    </RouterLink>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <router-link
        v-for="link in links"
        :key="link.name"
        :to="link.path"
        class="block px-4 py-3 rounded-md font-medium transition-colors duration-200 no-underline"
        :class="
          isActive(link.path)
            ? 'bg-accent-500 text-primary-900'
            : 'text-neutral-white hover:bg-accent-400 hover:text-primary-900'
        "
        @click="closeSidebarOnMobile"
      >
        {{ link.name }}
      </router-link>
    </nav>

    <!-- Mobile profile (optional) -->
    <div
      class="px-4 py-4 border-t border-primary-600 md:hidden"
      v-if="expertName"
    >
      <div class="flex items-center space-x-3 mb-3">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-0.5"
        >
          <div
            class="w-full h-full rounded-full bg-neutral-white flex items-center justify-center"
          >
            <User class="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-semibold text-sm">{{ expertName }}</span>
          <span class="text-xs text-primary-200/70">Expert Account</span>
        </div>
      </div>
    </div>

    <!-- Footer / Logout -->
    <div class="px-4 py-6 border-t border-primary-600">
      <button
        @click="logout"
        class="w-full bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold py-2 rounded-md transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useUIStore } from '@/core/store/uiStore.js';
import { User } from 'lucide-vue-next';
import api from '@/core/api/http.js';

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const sidebarOpen = computed(() => uiStore.state.sidebarOpen);

// Expert links
const links = [
  { name: 'Dashboard', path: '/expert/dashboard' },
  { name: 'Available Jobs', path: '/expert/jobs' },
  { name: 'Assignments', path: '/expert/assignments' },
  { name: 'Projects', path: '/expert/projects' },
  { name: 'Profile', path: '/expert/profile' },
  { name: 'Support', path: '/expert/support' },
];

// Highlight active link
const isActive = (path) => route.path.startsWith(path);

// Close sidebar on mobile
const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) uiStore.closeSidebar(); // lg breakpoint
};

// Expert name
const expertName = ref('Expert');

// Fetch expert profile
const fetchExpertProfile = async () => {
  try {
    const { data } = await api.get('/expert/profile');
    expertName.value = data?.data?.name || 'Expert';
  } catch (err) {
    console.error(err);
  }
};

// Logout
const logout = () => {
  localStorage.clear();
  router.push('/login');
};

onMounted(() => {
  fetchExpertProfile();
});
</script>

<style scoped>
/* Smooth scrollbar for sidebar */
aside nav::-webkit-scrollbar {
  width: 8px;
}
aside nav::-webkit-scrollbar-thumb {
  background-color: #0046ff;
  border-radius: 4px;
}
aside nav {
  scrollbar-width: thin;
  scrollbar-color: #0046ff transparent;
}
/* Smooth scrollbar for sidebar */
aside nav::-webkit-scrollbar {
  width: 8px;
}
aside nav::-webkit-scrollbar-thumb {
  background-color: theme('colors.accent.500');
  border-radius: 4px;
}
aside nav {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.accent.500') transparent;
}
</style>
