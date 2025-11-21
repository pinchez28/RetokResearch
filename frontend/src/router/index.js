import { createRouter, createWebHistory } from 'vue-router';

// Public pages
import HomePage from '@/pages/public/HomePage.vue';
import About from '@/pages/public/About.vue';
import Contact from '@/pages/public/Contact.vue';
import Login from '@/pages/public/Login.vue';
import Signup from '@/pages/public/Signup.vue';
import ForgotPassword from '@/pages/public/ForgotPassword.vue';

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const routes = [
  // Public routes
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'about', name: 'About', component: About },
      { path: 'contact', name: 'Contact', component: Contact },
      { path: 'login', name: 'Login', component: Login },
      { path: 'signup', name: 'Signup', component: Signup },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
      },
      {
        path: 'post-assignment',
        name: 'PostAssignment',
        beforeEnter: (to, from, next) => {
          next({ name: 'Login', query: { redirect: '/post-assignment' } });
        },
      },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/AdminDashboard.vue'),
      },

      // Homepage + support management
      {
        path: 'homepage',
        component: () =>
          import('@/pages/admin/homepagemanagement/HomepageManagement.vue'),
        children: [
          // Home sections
          {
            path: 'services',
            name: 'AdminHomeServices',
            component: () =>
              import('@/pages/admin/homepagemanagement/ServiceSection.vue'),
          },
          {
            path: 'experts',
            name: 'AdminHomeExperts',
            component: () =>
              import('@/pages/admin/homepagemanagement/TopRatedExperts.vue'),
          },
          {
            path: 'about',
            name: 'AdminHomeAbout',
            component: () =>
              import('@/pages/admin/homepagemanagement/AboutSection.vue'),
          },
          {
            path: 'contact',
            name: 'AdminHomeContact',
            component: () =>
              import(
                '@/pages/admin/homepagemanagement/PublicContactSection.vue'
              ),
          },

          // Support Sections
          {
            path: 'guest-support',
            name: 'AdminGuestSupport',
            component: () =>
              import('@/pages/admin/homepagemanagement/GuestSupport.vue'),
          },
          {
            path: 'client-support',
            name: 'AdminClientSupport',
            component: () =>
              import('@/pages/admin/homepagemanagement/ClientSupport.vue'),
          },
          {
            path: 'expert-support',
            name: 'AdminExpertSupport',
            component: () =>
              import('@/pages/admin/homepagemanagement/ExpertSupport.vue'),
          },
        ],
      },
    ],
  },

  // Fallback for non-existing pages
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
