<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();

const closeMenu = () => (menuOpen.value = false);

/* LOCK BODY SCROLL */
watch(menuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

/* Detect auth pages */
const isAuthPage = computed(() =>
  ['/signup', '/login'].some((p) => route.path.startsWith(p)),
);

/* Sections */
const activeSection = ref('');

const sectionIds = [
  'hero',
  'about',
  'howitworks',
  'approved-jobs',
  'guest-project-request',
  'why-us',
  'testimonials',
  'contact',
];

const sectionLabels = {
  hero: 'Home',
  about: 'About',
  howitworks: 'How it Works',
  'approved-jobs': 'Jobs',
  'guest-project-request': 'Submit Research Request',
  'why-us': 'Why Us',
  testimonials: 'Testimonials',
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
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  closeMenu();
};

const openSignup = () => window.openSignupOverlay?.();
</script>

<template>
  <!-- ================= NAVBAR ================= -->
  <nav class="fixed top-0 left-0 w-full z-50">
    <div
      class="w-[95%] mx-auto mt-6 bg-primary-900/80 backdrop-blur-md border border-primary-700 rounded-2xl shadow-xl px-6 py-4"
    >
      <!-- ================= DESKTOP NAV ================= -->
      <div
        class="hidden lg:grid grid-cols-[auto_1fr] grid-rows-2 items-center w-full gap-x-8"
      >
        <!-- Logo (spans 2 rows) -->
        <div class="row-span-2 flex items-center space-x-3 shrink-0">
          <img src="@/assets/images/logo.jpg" class="h-14 w-14 rounded-full" />
          <span class="text-accent-500 font-extrabold text-2xl"> Retok </span>
        </div>

        <!-- Top Row: Nav Links -->
        <div
          v-if="!isAuthPage"
          class="flex justify-center items-center space-x-6"
        >
          <a
            v-for="id in sectionIds"
            :key="id"
            @click.prevent="scrollToSection(id)"
            class="nav-link no-underline"
            :class="{ active: activeSection === id }"
          >
            {{ sectionLabels[id] }}
          </a>
        </div>

        <!-- Second Row: Login / Signup -->
        <div
          v-if="!isAuthPage"
          class="flex justify-center items-center space-x-4"
        >
          <router-link
            to="/login"
            class="px-6 py-2 rounded-lg font-semibold border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-primary-900 transition no-underline"
          >
            Login
          </router-link>

          <button
            @click="openSignup()"
            class="px-6 py-2 rounded-lg font-semibold bg-accent-500 text-primary-900 hover:bg-accent-400 transition"
          >
            Signup
          </button>
        </div>
      </div>
      <!-- ================= MOBILE NAV ================= -->
      <div class="flex items-center justify-between lg:hidden">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <img src="@/assets/images/logo.jpg" class="h-10 w-10 rounded-full" />
          <span class="text-accent-500 font-bold text-lg">Retok</span>
        </div>

        <!-- Hamburger (hidden on auth pages) -->
        <button
          v-if="!isAuthPage"
          @click="menuOpen = true"
          class="text-accent-400 text-3xl"
        >
          ☰
        </button>
      </div>
    </div>
  </nav>

  <!-- ================= FULLSCREEN MOBILE OVERLAY ================= -->
  <transition name="fade">
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-[9999] bg-primary-900 flex items-center justify-center lg:hidden"
    >
      <!-- Close Button -->
      <button
        @click="closeMenu"
        class="absolute top-6 right-6 text-3xl text-accent-400"
      >
        ✕
      </button>

      <!-- Mobile Links -->
      <div class="flex flex-col items-center space-y-8 text-center">
        <a
          v-for="id in sectionIds"
          :key="id"
          @click.prevent="scrollToSection(id)"
          class="mobile-link text-xl no-underline"
          :class="{ active: activeSection === id }"
        >
          {{ sectionLabels[id] }}
        </a>

        <router-link to="/login" @click="closeMenu" class="mobile-link text-xl">
          Login
        </router-link>

        <button
          @click="
            () => {
              openSignup();
              closeMenu();
            }
          "
          class="px-8 py-3 rounded-xl font-semibold bg-accent-500 text-primary-900"
        >
          Signup
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Links */
.nav-link,
.mobile-link {
  @apply text-primary-200 px-4 py-2 rounded-xl
         font-semibold transition-all duration-300 cursor-pointer;
}

.nav-link:hover,
.mobile-link:hover {
  @apply text-accent-400;
}

.nav-link.active,
.mobile-link.active {
  @apply bg-accent-500 text-primary-900;
}
</style>
