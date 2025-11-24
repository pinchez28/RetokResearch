<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 shadow-md h-24"
    style="background-color: #001bb7"
  >
    <div class="flex items-center justify-between w-full px-4 h-full">
      <!-- Logo -->
      <div class="logo flex-shrink-0 h-full flex items-center space-x-2">
        <img
          src="@/assets/images/logo.jpg"
          alt="Logo"
          class="h-full w-auto rounded-full cursor-grab"
          draggable="false"
        />
        <span class="text-white font-extrabold text-lg md:text-xl lg:text-2xl">
          Retok
        </span>
      </div>

      <!-- Desktop Links & Auth Buttons -->
      <template v-if="!isAuthPage">
        <ul
          class="hidden lg:flex flex-1 justify-center space-x-8 font-medium list-none items-center"
        >
          <!-- Homepage section links -->
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'hero' }"
              href="#"
              @click.prevent="scrollToSection('hero')"
              >Home</a
            >
          </li>
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'howitworks' }"
              href="#"
              @click.prevent="scrollToSection('howitworks')"
              >How it Works</a
            >
          </li>
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'services' }"
              href="#"
              @click.prevent="scrollToSection('services')"
              >Services</a
            >
          </li>
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'why-us' }"
              href="#"
              @click.prevent="scrollToSection('why-us')"
              >Why Us</a
            >
          </li>
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'testimonials' }"
              href="#"
              @click.prevent="scrollToSection('testimonials')"
              >Testimonials</a
            >
          </li>

          <!-- Public pages -->
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'about' }"
              href="#about"
              @click.prevent="scrollToSection('about')"
              >About</a
            >
          </li>
          <li>
            <a
              class="nav-link"
              :class="{ active: activeSection === 'contact' }"
              href="#contact"
              @click.prevent="scrollToSection('contact')"
              >Contact Us</a
            >
          </li>
        </ul>

        <!-- Auth Buttons -->
        <div
          class="hidden lg:flex items-center space-x-4 text-lg md:text-xl lg:text-2xl font-extrabold"
        >
          <router-link class="nav-link text-white" to="/login"
            >Login</router-link
          >
          <router-link
            class="px-4 py-2 rounded-md font-semibold transition"
            :style="{ backgroundColor: ctaBg, color: ctaColor }"
            @mouseover="hoverCTA"
            @mouseleave="leaveCTA"
            to="/signup"
          >
            Signup
          </router-link>
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
        <ul class="flex flex-col space-y-6 font-semibold text-xl list-none">
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'hero' }"
              @click.prevent="scrollToSection('hero')"
              >Home</a
            >
          </li>
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'howitworks' }"
              @click.prevent="scrollToSection('howitworks')"
              >How it Works</a
            >
          </li>
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'services' }"
              @click.prevent="scrollToSection('services')"
              >Services</a
            >
          </li>
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'why-us' }"
              @click.prevent="scrollToSection('why-us')"
              >Why Us</a
            >
          </li>
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'testimonials' }"
              @click.prevent="scrollToSection('testimonials')"
              >Testimonials</a
            >
          </li>
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'contact' }"
              @click.prevent="scrollToSection('contact')"
              >Contact Us</a
            >
          </li>
          <li>
            <a
              class="mobile-link"
              :class="{ active: activeSection === 'about' }"
              @click.prevent="scrollToSection('about')"
              >About</a
            >
          </li>

          <li>
            <router-link class="mobile-link" @click="closeMenu" to="/login"
              >Login</router-link
            >
          </li>

          <li>
            <router-link
              class="mobile-btn block text-center py-2 rounded-md font-semibold"
              @click="closeMenu"
              to="/signup"
              style="background-color: #ff8040; color: #f5f1dc"
            >
              Signup
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();
const closeMenu = () => (menuOpen.value = false);

const ctaBg = '#ee6983';
const ctaColor = '#333';
const hoverCTA = (e) => (e.target.style.backgroundColor = '#FF9966');
const leaveCTA = (e) => (e.target.style.backgroundColor = '#FF8040');

const isAuthPage = computed(() =>
  ['Login', 'Signup', 'ForgotPassword'].includes(route.name)
);

// ACTIVE SECTION LOGIC
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

const handleScroll = () => {
  let scrollPosition = window.scrollY + 150;

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

// Smooth scroll
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
</script>

<style scoped>
.nav-link,
.mobile-link {
  color: #f5f1dc;
  font-size: 1.2rem;
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
  text-decoration: none;
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
