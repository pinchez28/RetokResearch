<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 shadow-md h-24"
    style="background-color: #001bb7"
  >
    <div
      class="flex items-center justify-between w-full px-4 sm:px-6 lg:px-12 h-full"
    >
      <!-- Logo -->
      <div class="logo flex-shrink-0 h-full flex items-center space-x-2">
        <img
          src="@/assets/images/logo.jpg"
          alt="Logo"
          class="h-full w-auto rounded-full cursor-grab"
          draggable="false"
        />
        <span class="text-white font-extrabold text-lg sm:text-xl lg:text-2xl">
          Retok
        </span>
      </div>

      <!-- Non-auth pages -->
      <template v-if="!isAuthPage">
        <!-- Desktop Links -->
        <ul
          class="hidden lg:flex flex-1 justify-center space-x-6 xl:space-x-8 font-medium list-none items-center"
        >
          <li v-for="id in sectionIds" :key="id">
            <a
              class="nav-link"
              :class="{ active: activeSection === id }"
              href="#"
              @click.prevent="scrollToSection(id)"
            >
              {{ sectionLabels[id] }}
            </a>
          </li>
        </ul>

        <!-- Auth Buttons Desktop -->
        <div
          class="hidden lg:flex items-center space-x-3 sm:space-x-4 text-lg sm:text-xl lg:text-2xl font-extrabold"
        >
          <router-link class="nav-link text-white" to="/login"
            >Login</router-link
          >
          <button
            class="px-4 py-2 rounded-md font-semibold transition"
            :style="{ backgroundColor: ctaBg, color: ctaColor }"
            @mouseover="hoverCTA"
            @mouseleave="leaveCTA"
            @click="openSignup"
          >
            Signup
          </button>
        </div>

        <!-- Mobile Hamburger -->
        <button
          @click="menuOpen = !menuOpen"
          class="block lg:hidden focus:outline-none z-50"
        >
          <span v-if="!menuOpen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </span>
          <span v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
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
          </span>
        </button>
      </template>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div
        v-if="menuOpen && !isAuthPage"
        class="fixed inset-0 z-40 flex flex-col bg-[#001bb7] text-[#f5f1dc] p-6 pt-24 lg:hidden overflow-y-auto"
      >
        <ul
          class="flex flex-col space-y-6 font-semibold text-lg sm:text-xl list-none"
        >
          <li v-for="id in sectionIds" :key="id">
            <a
              class="mobile-link"
              :class="{ active: activeSection === id }"
              @click.prevent="scrollToSection(id)"
            >
              {{ sectionLabels[id] }}
            </a>
          </li>

          <li>
            <router-link class="mobile-link" @click="closeMenu" to="/login">
              Login
            </router-link>
          </li>
          <li>
            <button
              class="mobile-btn block text-center py-2 rounded-md font-semibold"
              style="background-color: #ff8040; color: #f5f1dc"
              @click="
                () => {
                  openSignup();
                  closeMenu();
                }
              "
            >
              Signup
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();
const closeMenu = () => (menuOpen.value = false);

const ctaBg = '#ee6983';
const ctaColor = '#333';
const hoverCTA = (e) => (e.target.style.backgroundColor = '#FF9966');
const leaveCTA = (e) => (e.target.style.backgroundColor = '#FF8040');

// Mark auth pages based on path
const isAuthPage = computed(() =>
  ['/signup', '/login'].some((p) => route.path.startsWith(p))
);

// Active Section
const activeSection = ref('');
const sectionIds = [
  'hero',
  'howitworks',
  'services',
  'why-us',
  'testimonials',
  'about',
  'contact',
];
const sectionLabels = {
  hero: 'Home',
  howitworks: 'How it Works',
  services: 'Services',
  'why-us': 'Why Us',
  testimonials: 'Testimonials',
  about: 'About',
  contact: 'Contact Us',
};

const handleScroll = () => {
  const scrollPosition = window.scrollY + 150;
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.offsetTop;
    const height = el.offsetHeight;
    if (scrollPosition >= top && scrollPosition < top + height) {
      activeSection.value = id;
      break;
    }
  }
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const scrollToSection = async (id) => {
  activeSection.value = id;
  if (route.path !== '/') {
    await router.push({ path: '/', query: { scrollTo: id } });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMenu();
};

// Global signup overlay trigger
const openSignup = () => window.openSignupOverlay?.();
</script>

<style scoped>
.nav-link,
.mobile-link {
  color: #f5f1dc;
  font-weight: 700;
  transition: color 0.25s;
  text-decoration: none;
}
.nav-link.active,
.mobile-link.active {
  color: #00e0ff;
}
.nav-link:hover,
.mobile-link:hover {
  color: #00b2ff;
}
.mobile-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.logo img {
  cursor: grab;
  user-select: none;
}
</style>
