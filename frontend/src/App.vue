<template>
  <!-- Directly render the page content -->
  <router-view />
</template>

<script setup></script>

//
<script setup>
// import { computed } from 'vue';
// import { useRoute } from 'vue-router';

// // Import all layouts
// import PublicLayout from '@/layouts/PublicLayout.vue';
// import ClientLayout from '@/layouts/ClientLayout.vue';
// import ExpertLayout from '@/layouts/ExpertLayout.vue';
// import AdminLayout from '@/layouts/AdminLayout.vue';

// const route = useRoute();

// // Choose layout based on route meta field
// const layout = computed(() => {
//   const layoutType = route.meta?.layout || 'public';

//   switch (layoutType) {
//     case 'client':
//       return ClientLayout;
//     case 'expert':
//       return ExpertLayout;
//     case 'admin':
//       return AdminLayout;
//     default:
//       return PublicLayout;
//   }
// });
//
</script>
