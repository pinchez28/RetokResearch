<template>
  <div>
    <!-- Hamburger button -->
    <button
      @click="sidebarOpen = true"
      class="p-2 m-2 bg-[#001BB7] text-[#F5F1DC] rounded lg:hidden fixed top-4 left-4 z-50"
    >
      <Menu class="w-6 h-6" />
    </button>

    <!-- Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black/40 md:hidden"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 z-50 h-screen w-2/3 max-w-xs bg-[#001BB7] text-white overflow-y-auto p-4 transform transition-transform md:relative md:w-64 md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="flex justify-between items-center font-bold border-b border-[#0046FF] py-4"
      >
        Admin Menu
        <button class="md:hidden" @click="sidebarOpen = false">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav class="mt-4 space-y-4">
        <div v-for="section in sections" :key="section.name">
          <div class="mb-2 font-semibold text-[#F5F1DC]">
            {{ section.label }}
          </div>
          <ul>
            <li
              v-for="item in section.items"
              :key="item.name"
              @click="navigate(item)"
              class="cursor-pointer px-3 py-2 rounded hover:bg-[#0046FF]"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Menu } from 'lucide-vue-next';

const sidebarOpen = ref(false);
const router = useRouter();

// Navigate using either path or named route
const navigate = (item) => {
  if (item.routeName) {
    router.push({ name: item.routeName });
  } else {
    router.push(item.path);
  }
  sidebarOpen.value = false;
};

const sections = [
  {
    name: 'homepage',
    label: 'Homepage Management',
    items: [
      {
        name: 'AdminHomeServices',
        label: 'Services',
        path: '/admin/homepage/services',
        routeName: 'AdminHomeServices',
      },
      {
        name: 'AdminHomeExperts',
        label: 'Top Rated Experts',
        path: '/admin/homepage/experts',
        routeName: 'AdminHomeExperts',
      },
      {
        name: 'AdminHomeAbout',
        label: 'About',
        path: '/admin/homepage/about',
        routeName: 'AdminHomeAbout',
      },
      {
        name: 'AdminHomeContact',
        label: 'Contact',
        path: '/admin/homepage/contact',
        routeName: 'AdminHomeContact',
      },
    ],
  },

  {
    name: 'support',
    label: 'Support Management',
    items: [
      {
        name: 'AdminGuestSupport',
        label: 'Guest Support',
        path: '/admin/guest-support',
        routeName: 'AdminGuestSupport',
      },
      {
        name: 'AdminClientSupport',
        label: 'Client Support',
        path: '/admin/client-support',
        routeName: 'AdminClientSupport',
      },
      {
        name: 'AdminExpertSupport',
        label: 'Expert Support',
        path: '/admin/expert-support',
        routeName: 'AdminExpertSupport',
      },
    ],
  },
];
</script>
