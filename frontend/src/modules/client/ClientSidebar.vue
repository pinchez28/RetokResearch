<template>
  <aside
    class="fixed z-50 top-0 left-0 h-screen w-64 bg-primary-900 text-neutral-white shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <RouterLink
      to="/client/dashboard"
      class="flex items-center space-x-3 sm:space-x-4 px-4 py-4 hover:opacity-90 transition-opacity no-underline"
      @click="closeSidebarOnMobile"
    >
      <img
        src="@/assets/images/logo.webp"
        alt="Retok Logo"
        class="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full border-2 border-primary-700 shadow-float-md"
      />

      <div class="flex flex-col">
        <span
          class="tracking-tight text-lg sm:text-xl md:text-xl lg:text-2xl font-extrabold text-neutral-white"
        >
          Retok
        </span>

        <span class="text-xs sm:text-sm text-primary-200 font-medium">
          Client Portal
        </span>
      </div>
    </RouterLink>

    <!-- Scrollable Navigation -->
    <div class="flex-1 overflow-y-auto px-4 py-4">
      <nav class="space-y-2">
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
    </div>

    <!-- Footer -->
    <div class="px-4 py-6 border-t border-primary-600 space-y-3">
      <div class="flex items-center space-x-3 lg:hidden">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 p-0.5"
        >
          <div
            class="w-full h-full rounded-full bg-neutral-white flex items-center justify-center"
          >
            <User class="w-5 h-5 text-primary-600" />
          </div>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold">{{ clientName }}</span>
          <span class="text-xs text-primary-200/70">Client Account</span>
        </div>
      </div>

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
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUIStore } from "@/core/store/uiStore.js";
import { User } from "lucide-vue-next";
import api from "@/core/api/http.js";

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();

const sidebarOpen = computed(() => uiStore.state.sidebarOpen);

const links = [
  { name: "Dashboard", path: "/client/dashboard" },
  { name: "Post Job", path: "/client/post-job" },
  { name: "Job Tracking", path: "/client/job-tracking" },
  { name: "Projects", path: "/client/projects" },
  { name: "Profile", path: "/client/profile" },
  { name: "Support", path: "/client/support" },
];

const isActive = (path) => route.path === path;

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) uiStore.closeSidebar();
};

const logout = () => {
  localStorage.clear();
  router.push("/login");
};

const clientName = ref("Client");

const fetchClientProfile = async () => {
  try {
    const { data } = await api.get("/client/profile");
    clientName.value = data?.data?.name || "Client";
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchClientProfile);
</script>

<style scoped>
/* Smooth sidebar scrolling */
.flex-1::-webkit-scrollbar {
  width: 6px;
}

.flex-1::-webkit-scrollbar-thumb {
  background: #0046ff;
  border-radius: 6px;
}

.flex-1 {
  scrollbar-width: thin;
  scrollbar-color: #0046ff transparent;
}
</style>
