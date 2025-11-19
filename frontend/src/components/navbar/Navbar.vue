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
            <a class="nav-link" href="#" @click.prevent="scrollToSection('hero')">Home</a>
          </li>
          <li>
            <a class="nav-link" href="#" @click.prevent="scrollToSection('howitworks')"
              >How it Works</a
            >
          </li>
          <li>
            <a class="nav-link" href="#" @click.prevent="scrollToSection('services')"
              >Services</a
            >
          </li>
          <li>
            <a class="nav-link" href="#" @click.prevent="scrollToSection('why-us')"
              >Why Us</a
            >
          </li>
          <li>
            <a class="nav-link" href="#" @click.prevent="scrollToSection('testimonials')"
              >Testimonials</a
            >
          </li>

          <!-- Public pages -->
          <a class="nav-link" href="#about" @click.prevent="scrollToSection('about')"
            >About</a
          >
          <li>
            <a
              class="nav-link"
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
          <router-link class="nav-link text-white" to="/login">Login</router-link>
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
          <!-- Homepage section links -->
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('hero');
                closeMenu();
              "
              >Home</a
            >
          </li>
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('howitworks');
                closeMenu();
              "
              >How it Works</a
            >
          </li>
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('services');
                closeMenu();
              "
              >Services</a
            >
          </li>
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('why-us');
                closeMenu();
              "
              >Why Us</a
            >
          </li>
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('testimonials');
                closeMenu();
              "
              >Testimonials</a
            >
          </li>

          <!-- Public pages -->
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('contact');
                closeMenu();
              "
              >Contact Us</a
            >
          </li>
          <li>
            <a
              class="mobile-link block"
              @click.prevent="
                scrollToSection('about');
                closeMenu();
              "
              >About</a
            >
          </li>
          <li>
            <router-link class="mobile-link block" @click="closeMenu" to="/login"
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
import { ref, computed, nextTick } from "vue"; // ✅ make sure computed is imported
import { useRoute, useRouter } from "vue-router";

const menuOpen = ref(false);
const route = useRoute();
const router = useRouter();

const closeMenu = () => (menuOpen.value = false);

const ctaBg = "#ee6983";
const ctaColor = "#333";
const hoverCTA = (e) => (e.target.style.backgroundColor = "#FF9966");
const leaveCTA = (e) => (e.target.style.backgroundColor = "#FF8040");

// Auth page detection
const isAuthPage = computed(() =>
  ["Login", "Signup", "ForgotPassword"].includes(route.name)
);

// Smooth scroll to homepage sections
const scrollToSection = async (id) => {
  if (route.path !== "/") {
    // Navigate to homepage first
    await router.push({ path: "/", query: { scrollTo: id } });
    return;
  }
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
};
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
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
