import { createRouter, createWebHistory } from 'vue-router';

/* ============================
   PUBLIC PAGES
============================ */
import HomePage from '@/pages/public/HomePage.vue';
import About from '@/pages/public/About.vue';
import Contact from '@/pages/public/Contact.vue';
import Login from '@/pages/public/Login.vue';
import ForgotPassword from '@/pages/public/ForgotPassword.vue';

/* ============================
   SIGNUP PAGES
============================ */
import ClientSignup from '@/pages/public/signup/ClientSignup.vue';
import ExpertSignup from '@/pages/public/signup/ExpertSignup.vue';
import SignupOverlay from '@/pages/public/signup/SignupOverlay.vue';

/* ============================
   LAYOUTS
============================ */
import PublicLayout from '@/layouts/PublicLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import ExpertLayout from '@/layouts/ExpertLayout.vue';
import ClientLayout from '@/layouts/ClientLayout.vue';

/* ============================
   EXPERT PAGES
============================ */
import ExpertDashboard from '@/pages/expert/Dashboard.vue';
import ExpertJobs from '@/pages/expert/jobs.vue';
import ExpertProjects from '@/pages/expert/Projects.vue';
import ExpertAssignments from '@/pages/expert/Assignments.vue';
import ExpertProfile from '@/pages/expert/Profile.vue';
import ExpertSupport from '@/pages/expert/Support.vue';

/* ============================
   CLIENT PAGES
============================ */
import Dashboard from '@/pages/client/Dashboard.vue';
import ClientProjects from '@/pages/client/Projects.vue';
import JobDetails from '@/pages/client/JobDetails.vue';
import Messages from '@/pages/client/Messages.vue';
import Payments from '@/pages/client/Payments.vue';
import PostJob from '@/pages/client/PostJob.vue';
import Profile from '@/pages/client/Profile.vue';
import Support from '@/pages/client/Support.vue';

/* ============================
   ROUTES
============================ */
const routes = [
  /* ============================
     PUBLIC ROUTES
  ============================ */
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'about', name: 'About', component: About },
      { path: 'contact', name: 'Contact', component: Contact },
      { path: 'login', name: 'Login', component: Login },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
      },

      // Signup routes
      { path: 'signup', name: 'SignupOverlay', component: SignupOverlay },
      { path: 'signup/client', name: 'ClientSignup', component: ClientSignup },
      { path: 'signup/expert', name: 'ExpertSignup', component: ExpertSignup },
    ],
  },

  /* ============================
     CLIENT ROUTES (Upwork-style)
  ============================ */
  {
    path: '/client',
    component: ClientLayout,
    children: [
      { path: '', redirect: '/client/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'projects', name: 'ClientProjects', component: ClientProjects },
      { path: 'projects/:id', name: 'JobDetails', component: JobDetails },
      { path: 'messages', name: 'Messages', component: Messages },
      { path: 'payments', name: 'Payments', component: Payments },
      { path: 'post-job', name: 'PostJob', component: PostJob },
      { path: 'profile', name: 'Profile', component: Profile },
      { path: 'support', name: 'Support', component: Support },
    ],
  },

  /* ============================
     EXPERT ROUTES
  ============================ */
  {
    path: '/expert',
    component: ExpertLayout,
    children: [
      { path: '', redirect: { name: 'ExpertDashboard' } },
      {
        path: 'dashboard',
        name: 'ExpertDashboard',
        component: ExpertDashboard,
      },
      { path: 'projects', name: 'ExpertProjects', component: ExpertProjects },
      { path: 'jobs', name: 'ExpertJobs', component: ExpertJobs },
      {
        path: 'assignments',
        name: 'ExpertAssignments',
        component: ExpertAssignments,
      },
      { path: 'profile', name: 'ExpertProfile', component: ExpertProfile },
      { path: 'support', name: 'ExpertSupport', component: ExpertSupport },
    ],
  },

  /* ============================
     ADMIN ROUTES
  ============================ */
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/AdminDashboard.vue'),
      },

      // Homepage Management
      {
        path: 'homepage',
        name: 'AdminHomepage',
        component: () =>
          import('@/pages/admin/homepagemanagement/HomepageManagement.vue'),
      },
      {
        path: 'homepage/services',
        name: 'AdminHomeServices',
        component: () =>
          import('@/pages/admin/homepagemanagement/ServiceSection.vue'),
      },
      {
        path: 'homepage/experts',
        name: 'AdminHomeExperts',
        component: () =>
          import('@/pages/admin/homepagemanagement/TopRatedExperts.vue'),
      },
      {
        path: 'homepage/about',
        name: 'AdminHomeAbout',
        component: () =>
          import('@/pages/admin/homepagemanagement/AboutSection.vue'),
      },
      {
        path: 'homepage/contact',
        name: 'AdminHomeContact',
        component: () =>
          import('@/pages/admin/homepagemanagement/PublicContactSection.vue'),
      },

      // Support Pages
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

  /* ============================
     FALLBACK
  ============================ */
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

/* ============================
   ROUTER INIT
============================ */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
