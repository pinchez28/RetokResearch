<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#1A1A1A]">Guest Support Center</h1>
      <p class="text-gray-500 mt-1">Manage guest service requests and communications.</p>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-4 border-b border-gray-200 mb-6">
      <router-link
        :to="{ name: 'AdminGuestRequests' }"
        class="px-5 py-3 font-extrabold border-b-2 uppercase transition"
        :class="tabClass('requests')"
      >
        Guest Requests
      </router-link>

      <router-link
        :to="{ name: 'AdminGuestMessages' }"
        class="px-5 py-3 font-extrabold uppercase border-b-2 transition"
        :class="tabClass('messages')"
      >
        Guest Messages
      </router-link>
    </div>

    <!-- Router Content -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "GuestSupport",
  data() {
    return {
      currentTab: "requests",
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        // Use the meta.tab if present
        if (to.meta && to.meta.tab) {
          this.currentTab = to.meta.tab;
        } else {
          this.currentTab = "requests"; // fallback default
        }
      },
    },
  },
  methods: {
    tabClass(tab) {
      const base = "border-b-2 font-semibold px-5 py-3 transition";
      return this.currentTab === tab
        ? `${base} border-black text-black`
        : `${base} border-transparent text-gray-500 hover:text-black`;
    },
  },
};
</script>
