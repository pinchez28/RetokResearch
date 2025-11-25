<template>
  <header class="bg-[#001BB7] text-white shadow-md sticky top-0 z-50">
    <div class="max-w-full px-6 py-3 flex items-center justify-between">
      <!-- LOGO / TITLE -->
      <RouterLink
        to="/expert/dashboard"
        class="text-xl font-semibold tracking-wide"
      >
        Expert Panel
      </RouterLink>

      <!-- RIGHT SIDE ACTIONS -->
      <div class="flex items-center space-x-6">
        <!-- NOTIFICATIONS -->
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <Bell class="w-6 h-6 text-white" />

          <span
            v-if="notifications > 0"
            class="absolute -top-1 -right-1 bg-[#FF8040] text-white text-xs font-bold rounded-full px-1.5 py-0.5"
          >
            {{ notifications }}
          </span>

          <!-- DROPDOWN -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg p-3"
          >
            <p v-if="notifications === 0" class="text-sm text-gray-500">
              No new notifications
            </p>

            <ul v-else class="space-y-2">
              <li
                v-for="(note, index) in notificationList"
                :key="index"
                class="text-sm border-b pb-2 last:border-none"
              >
                {{ note }}
              </li>
            </ul>
          </div>
        </div>

        <!-- USER MENU -->
        <div class="relative">
          <div
            class="flex items-center space-x-2 cursor-pointer"
            @click="toggleUserMenu"
          >
            <img
              src="https://ui-avatars.com/api/?name=Expert&background=0046FF&color=fff"
              class="w-8 h-8 rounded-full border-2 border-white"
            />
            <span class="font-medium hidden md:inline">Expert</span>
          </div>

          <!-- USER DROPDOWN -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40 py-2"
          >
            <RouterLink
              to="/expert/profile"
              class="block px-4 py-2 hover:bg-[#F5F1DC]"
            >
              Profile
            </RouterLink>

            <RouterLink
              to="/expert/support"
              class="block px-4 py-2 hover:bg-[#F5F1DC]"
            >
              Support
            </RouterLink>

            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-[#F5F1DC] text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Bell } from 'lucide-vue-next';

export default {
  components: { Bell },
  setup() {
    const router = useRouter();

    const showNotifications = ref(false);
    const showUserMenu = ref(false);

    // Example placeholder notifications
    const notifications = ref(2);
    const notificationList = ref([
      'A new job was assigned to you',
      'You received a new message',
    ]);

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      showUserMenu.value = false;
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showNotifications.value = false;
    };

    const logout = () => {
      router.push('/login');
    };

    return {
      notifications,
      notificationList,
      showNotifications,
      showUserMenu,
      toggleNotifications,
      toggleUserMenu,
      logout,
    };
  },
};
</script>

<style scoped></style>
