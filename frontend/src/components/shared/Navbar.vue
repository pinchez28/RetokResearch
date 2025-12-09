<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// State
const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();
const closeMenu = () => (menuOpen.value = false);

// CTA button styles
const ctaBg = '#ee6983';
const ctaColor = '#333';
const hoverCTA = (e) => (e.target.style.backgroundColor = '#FF9966');
const leaveCTA = (e) => (e.target.style.backgroundColor = '#FF8040');

// Detect auth pages
const isAuthPage = computed(() =>
  ['/signup', '/login'].some((p) => route.path.startsWith(p))
);

// Sections for scrolling
const activeSection = ref('');
const sectionIds = [
  'hero',
  'about',
  'howitworks',
  'approved-jobs',
  'services',
  'why-us',
  'testimonials',
  'contact',
];
const sectionLabels = {
  hero: 'Home',
  howitworks: 'How it Works',
  services: 'Services',
  'why-us': 'Why Us',
  testimonials: 'Testimonials',
  about: 'About',
  'approved-jobs': 'Available Jobs',
  contact: 'Contact Us',
};

// Handle scroll and update active section
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

// Scroll listener
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// Scroll to section
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

// Open signup overlay
const openSignup = () => window.openSignupOverlay?.();
</script>

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

      <!-- Desktop Links -->
      <template v-if="!isAuthPage">
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

        <!-- Hamburger Menu (all screens < lg) -->
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

    <transition name="overlay-scale">
      <div
        v-if="menuOpen && !isAuthPage"
        class="fixed inset-0 z-40 bg-[#001bb7] bg-opacity-95 flex items-center justify-center p-6 overflow-y-auto"
      >
        <div class="overlay-content text-center">
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
              <router-link class="mobile-link" @click="closeMenu" to="/login"
                >Login</router-link
              >
            </li>
            <li>
              <button
                class="mobile-btn block py-2 px-6 rounded-md font-semibold mx-auto"
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
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* Smooth center-scale overlay animation */
.overlay-scale-enter-active,
.overlay-scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.overlay-scale-enter-from,
.overlay-scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

.overlay-scale-enter-to,
.overlay-scale-leave-from {
  transform: scale(1);
  opacity: 1;
}

/* Nav link styles */
.nav-link,
.mobile-link {
  color: #f5f1dc;
  font-weight: bolder;
  transition: color 0.25s, background-color 0.25s;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 4px;
}

.nav-link.active,
.mobile-link.active {
  background-color: #ff8040;
  color: #020d4d !important;
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.55);
}

.nav-link:hover:not(.active),
.mobile-link:hover:not(.active) {
  color: #00e0ff;
}

/* Mobile button */
.mobile-btn {
  display: block;
  width: fit-content;
  text-align: center;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  margin: 0 auto;
}

/* Logo styling */
.logo img {
  cursor: grab;
  user-select: none;
}

.overlay-scale-enter-active,
.overlay-scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.overlay-scale-enter-from,
.overlay-scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

.overlay-scale-enter-to,
.overlay-scale-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>

