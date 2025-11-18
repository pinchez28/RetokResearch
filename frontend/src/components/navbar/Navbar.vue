<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 shadow-md h-24"
    style="background-color: #001bb7"
  >
    <div class="flex items-center justify-between w-full px-4 h-full">
      <!-- Logo (all screens) -->
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

      <!-- Show links and auth buttons only if not on auth pages -->
      <template v-if="!isAuthPage">
        <!-- Center links (desktop only lg+) -->
        <ul
          class="hidden lg:flex flex-1 justify-center space-x-8 font-medium list-none items-center"
        >
          <li><router-link class="nav-link" to="/">Home</router-link></li>
          <li>
            <router-link class="nav-link" to="/#howitworks"
              >How it Works</router-link
            >
          </li>

          <li>
            <router-link class="nav-link" to="/#services">Services</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/#whyus">Why Us</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/#testimonials"
              >Testimonials</router-link
            >
          </li>
          <li>
            <router-link class="nav-link" to="/contact">Contact Us</router-link>
          </li>
          <li><router-link class="nav-link" to="/about">About</router-link></li>
        </ul>

        <!-- Right-side Login/Signup (desktop only lg+) -->
        <div
          class="hidden lg:flex items-center space-x-4 text-lg md:text-xl lg:text-2xl font-extrabold"
        >
          <router-link class="nav-link text-white" to="/login"
            >Login</router-link
          >
          <router-link
            class="px-4 py-2 rounded-md font-semibold transition"
            style="background-color: #ee6983; color: #333"
            @mouseover="hoverCTA"
            @mouseleave="leaveCTA"
            to="/signup"
          >
            Signup
          </router-link>
        </div>

        <!-- Mobile & md hamburger (visible < lg) -->
        <button
          @click="menuOpen = !menuOpen"
          class="block lg:hidden focus:outline-none z-50"
        >
          <span v-if="!menuOpen">
            <!-- hamburger icon -->
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
            <!-- close icon -->
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

    <!-- Mobile menu (visible < lg) -->
    <transition name="slide">
      <div
        v-if="menuOpen && !isAuthPage"
        class="fixed inset-0 z-40 flex flex-col bg-[#001bb7] text-[#f5f1dc] p-6 pt-24 lg:hidden overflow-y-auto"
      >
        <ul class="flex flex-col space-y-6 font-semibold text-xl list-none">
          <li>
            <router-link class="mobile-link block" @click="closeMenu" to="/"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-link block"
              @click="closeMenu"
              to="/#howitworks"
              >How it Works</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-link block"
              @click="closeMenu"
              to="/#whyus"
              >Why Us</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-link block"
              @click="closeMenu"
              to="/#services"
              >Services</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-link block"
              @click="closeMenu"
              to="/contact"
              >Contact Us</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-link block"
              @click="closeMenu"
              to="/about"
              >About</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-link block"
              @click="closeMenu"
              to="/login"
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const menuOpen = ref(false);
const route = useRoute();

const closeMenu = () => {
  menuOpen.value = false;
};

const hoverCTA = (event) => {
  event.target.style.backgroundColor = '#FF9966';
};

const leaveCTA = (event) => {
  event.target.style.backgroundColor = '#FF8040';
};

// Computed: check if current page is an auth page
const isAuthPage = computed(() => {
  return ['Login', 'Signup', 'ForgotPassword'].includes(route.name);
});
</script>

<style scoped>
.nav-link,
.mobile-link {
  color: #f5f1dc;
  transition: color 0.2s;
  text-decoration: none;
}
.nav-link:hover,
.mobile-link:hover {
  color: #0046ff;
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

/* Remove default list styles */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Mobile menu transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Cursor grab effect on logo */
.logo img {
  cursor: grab;
  user-select: none;
}
</style>
