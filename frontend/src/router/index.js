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
import ClientLayout from '@/layouts/ClientLayout.vue';
import ExpertLayout from '@/layouts/ExpertLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const routes = [
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

      // PostAssignment is only for logged-in users
      {
        path: 'post-assignment',
        name: 'PostAssignment',
        beforeEnter: (to, from, next) => {
          // You don't have client auth yet, so redirect all attempts to login/signup
          next({
            name: 'Login',
            query: { redirect: '/post-assignment' },
          });
        },
      },
    ],
  },
  {
    path: '/client',
    component: ClientLayout,
    children: [
      {
        path: '',
        name: 'ClientDashboard',
        component: () => import('@/pages/client/Dashboard.vue'),
      },
      {
        path: 'profile',
        name: 'ClientProfile',
        component: () => import('@/pages/client/Profile.vue'),
      },
      {
        path: 'projects',
        name: 'ClientProjects',
        component: () => import('@/pages/client/Projects.vue'),
      },
      {
        path: 'payments',
        name: 'ClientPayments',
        component: () => import('@/pages/client/Payments.vue'),
      },
      {
        path: 'support',
        name: 'ClientSupport',
        component: () => import('@/pages/client/Suport.vue'),
      },
    ],
  },
  {
    path: '/expert',
    component: ExpertLayout,
    children: [
      {
        path: '',
        name: 'ExpertDashboard',
        component: () => import('@/pages/expert/Dashboard.vue'),
      },
      {
        path: 'profile',
        name: 'ExpertProfile',
        component: () => import('@/pages/expert/Profile.vue'),
      },
      {
        path: 'assignments',
        name: 'ExpertAssignments',
        component: () => import('@/pages/expert/Assignments.vue'),
      },
      {
        path: 'support',
        name: 'ExpertSupport',
        component: () => import('@/pages/expert/Support.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/Dashboard.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/pages/admin/Users.vue'),
      },
      {
        path: 'assignments',
        name: 'AdminAssignments',
        component: () => import('@/pages/admin/Assignments.vue'),
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/pages/admin/Settings.vue'),
      },
      {
        path: 'support',
        name: 'AdminSupport',
        component: () => import('@/pages/admin/Support.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return false;
      }
    }
    return { top: 0 };
  },
});

export default router;
