// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/core/store/auth';

/* ============================
   PUBLIC PAGES
============================ */
import HomePage from '@/modules/public/HomePage.vue';
import About from '@/modules/public/About.vue';
import Contact from '@/modules/public/Contact.vue';
import Login from '@/modules/public/Login.vue';
import ForgotPassword from '@/modules/public/ForgotPassword.vue';

/* ============================
   SIGNUP PAGES
============================ */
import ClientSignup from '@/modules/public/signup/ClientSignup.vue';
import ExpertSignup from '@/modules/public/signup/ExpertSignup.vue';
import SignupOverlay from '@/modules/public/signup/SignupOverlay.vue';

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
import ExpertDashboard from '@/modules/expert/Dashboard.vue';
import ExpertJobs from '@/modules/expert/jobs.vue';
import ExpertProjects from '@/modules/expert/Projects.vue';
import ExpertAssignments from '@/modules/expert/Assignments.vue';
import ExpertProfile from '@/modules/expert/Profile.vue';
import ExpertSupport from '@/modules/expert/Support.vue';
import ExpertJobDetails from '@/modules/expert/ExpertJobDetails.vue';
import ProposalDetails from '@/modules/expert/ProposalDetails.vue';
import AssignmentDetails from '@/modules/expert/AssignmentDetails.vue';

/* ============================
   CLIENT PAGES
============================ */
import Dashboard from '@/modules/client/Dashboard.vue';
import ClientProjects from '@/modules/client/Projects.vue';
import ProjectDetails from '@/modules/client/ProjectDetails.vue';
import JobTracking from '@/modules/client/JobTracking.vue';
import JobDetails from '@/modules/client/JobDetails.vue';
import ClientJobApplications from '@/modules/client/ClientJobApplications.vue';
import ClientProposalView from '@/modules/client/ClientProposalView.vue';
import Messages from '@/modules/client/Messages.vue';
import Payments from '@/modules/client/Payments.vue';
import PostJob from '@/modules/client/PostJob.vue';
import Profile from '@/modules/client/Profile.vue';
import Support from '@/modules/client/Support.vue';

/* ============================
   ADMIN (lazy-loaded)
============================ */
const AdminDashboard = () => import('@/modules/admin/index/AdminDashboard.vue');

const AdminHomepage = () =>
  import('@/modules/admin/homepage/HomepageManagement.vue');

const AdminHomeServices = () =>
  import('@/modules/admin/homepage/ServiceSection.vue');

const AdminHomeExperts = () =>
  import('@/modules/admin/homepage/TopRatedExperts.vue');

const AdminHomeAbout = () =>
  import('@/modules/admin/homepage/AboutSection.vue');

const AdminHomeContact = () =>
  import('@/modules/admin/homepage/PublicContactSection.vue');

const ExpertApproval = () =>
  import('@/modules/admin/experts/ExpertApproval.vue');

const ExpertList = () => import('@/modules/admin/experts/ExpertList.vue');

const ExpertDetails = () => import('@/modules/admin/experts/ExpertDetails.vue');

const ExpertPerformance = () =>
  import('@/modules/admin/experts/ExpertPerformance.vue');

const AdminExpertCvViewer = () =>
  import('@/modules/admin/experts/AdminExpertsCvViewer.vue');

/* ✅ FIXED HERE */
const AdminGuestSupport = () =>
  import('@/modules/admin/homepage/guestSupport/GuestSupport.vue');

const AdminClientSupport = () =>
  import('@/modules/admin/clients/ClientSupport.vue');

const AdminExpertSupport = () =>
  import('@/modules/admin/experts/ExpertSupport.vue');

const ActiveJobs = () => import('@/modules/admin/jobs/ActiveJobs.vue');

const ActiveJobDetails = () =>
  import('@/modules/admin/jobs/ActiveJobDetails.vue');

const CompletedJobs = () => import('@/modules/admin/jobs/CompletedJobs.vue');

const JobDisputes = () => import('@/modules/admin/jobs/JobDisputes.vue');

const PendingJobs = () => import('@/modules/admin/jobs/PendingJobs.vue');

const ClientList = () => import('@/modules/admin/clients/ClientList.vue');

const ClientDetails = () => import('@/modules/admin/clients/ClientDetails.vue');

const ClientActivityLogs = () =>
  import('@/modules/admin/clients/ClientActivityLogs.vue');
/* ============================
   ROUTES
============================ */
const routes = [
  /* PUBLIC */
  {
    path: '/',
    component: PublicLayout,
    meta: { isPublic: true },
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'about', name: 'About', component: About },
      { path: 'contact', name: 'Contact', component: Contact },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { guestOnly: true },
      },
      {
        path: 'signup',
        name: 'SignupOverlay',
        component: SignupOverlay,
        meta: { guestOnly: true },
      },
      {
        path: 'signup/client',
        name: 'ClientSignup',
        component: ClientSignup,
        meta: { guestOnly: true },
      },
      {
        path: 'signup/expert',
        name: 'ExpertSignup',
        component: ExpertSignup,
        meta: { guestOnly: true },
      },
    ],
  },

  /* CLIENT */
  {
    path: '/client',
    component: ClientLayout,
    meta: { requiresAuth: true, role: 'Client' },
    children: [
      { path: '', redirect: '/client/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'projects', name: 'ClientProjects', component: ClientProjects },
      {
        path: 'projects/:projectId',
        name: 'ProjectDetails',
        component: ProjectDetails,
        props: true,
      },
      { path: 'messages', name: 'Messages', component: Messages },
      {
        path: 'payments/:projectId',
        name: 'Payments',
        component: Payments,
        props: true,
      },
      { path: 'post-job', name: 'PostJob', component: PostJob },
      { path: 'profile', name: 'Profile', component: Profile },
      { path: 'support', name: 'Support', component: Support },
      { path: 'job-tracking', name: 'JobTracking', component: JobTracking },
      {
        path: 'jobs/:jobId/applications',
        name: 'ClientJobApplications',
        component: ClientJobApplications,
        props: true,
      },
      {
        path: 'jobs/:jobId',
        name: 'ClientJobDetails',
        component: JobDetails,
        props: true,
      },

      {
        path: 'job/:jobId/proposal/:expertId',
        name: 'ClientProposalView',
        component: ClientProposalView,
        props: true,
      },
      {
        path: 'job/:jobId/expert/:expertId/cv',
        name: 'ClientCvViewer',
        component: () => import('@/modules/client/ClientCvViewer.vue'),
        props: true,
      },
    ],
  },

  /* EXPERT */
  {
    path: '/expert',
    component: ExpertLayout,
    meta: { requiresAuth: true, role: 'Expert' },
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
        path: 'jobs/:jobId',
        name: 'ExpertJobDetails',
        component: ExpertJobDetails,
        props: true,
      },
      {
        path: 'assignments',
        name: 'ExpertAssignments',
        component: ExpertAssignments,
      },
      {
        path: 'assignments/:assignmentId',
        name: 'AssignmentDetails',
        component: AssignmentDetails,
        props: true,
      },
      { path: 'profile', name: 'ExpertProfile', component: ExpertProfile },
      { path: 'support', name: 'ExpertSupport', component: ExpertSupport },
      {
        path: 'proposals/:id',
        name: 'ProposalDetails',
        component: ProposalDetails,
        props: true,
      },
    ],
  },

  /* ============================
   ADMIN
============================ */
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'Admin' },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      {
        path: 'experts/:id/cv',
        name: 'AdminExpertCv',
        component: AdminExpertCvViewer,
        meta: { role: 'Admin' },
      },
      {
        path: 'experts',
        name: 'ExpertList',
        component: ExpertList,
        meta: { role: 'Admin' },
      },
      {
        path: 'experts/pending',
        name: 'PendingExperts',
        component: ExpertApproval,
        meta: { role: 'Admin' },
      },
      {
        path: 'experts/:id',
        name: 'AdminExpertDetails',
        component: ExpertDetails,
        props: true,
        meta: { role: 'Admin' },
      },
      {
        path: 'experts/performance',
        name: 'AdminExpertPerformance',
        component: ExpertPerformance,
        meta: { role: 'Admin' },
      },
      {
        path: 'homepage',
        name: 'AdminHomepage',
        component: AdminHomepage,
        meta: { role: 'Admin' },
      },
      {
        path: 'homepage/services',
        name: 'AdminHomeServices',
        component: AdminHomeServices,
        meta: { role: 'Admin' },
      },
      {
        path: 'homepage/experts',
        name: 'AdminHomeExperts',
        component: AdminHomeExperts,
        meta: { role: 'Admin' },
      },
      {
        path: 'homepage/about',
        name: 'AdminHomeAbout',
        component: AdminHomeAbout,
        meta: { role: 'Admin' },
      },
      {
        path: 'homepage/contact',
        name: 'AdminHomeContact',
        component: AdminHomeContact,
        meta: { role: 'Admin' },
      },
      {
        path: 'jobs/active',
        name: 'ActiveJobs',
        component: ActiveJobs,
        meta: { role: 'Admin' },
      },
      {
        path: 'jobs/active/:jobId/assign',
        name: 'AssignExpert',
        component: () => import('@/modules/admin/jobs/AssignExpert.vue'),
        props: true,
        meta: { role: 'Admin' },
      },
      {
        path: 'jobs/active/:jobId',
        name: 'ActiveJobDetails',
        component: ActiveJobDetails,
        props: true,
        meta: { role: 'Admin' },
      },
      {
        path: 'jobs/completed',
        name: 'CompletedJobs',
        component: CompletedJobs,
        meta: { role: 'Admin' },
      },
      {
        path: 'jobs/pending',
        name: 'PendingJobs',
        component: PendingJobs,
        meta: { role: 'Admin' },
      },
      {
        path: 'jobs/disputes',
        name: 'JobDisputes',
        component: JobDisputes,
        meta: { role: 'Admin' },
      },
      {
        path: 'clients',
        name: 'ClientList',
        component: ClientList,
        meta: { role: 'Admin' },
      },
      {
        path: 'clients/profiles/:id',
        name: 'ClientDetails',
        component: ClientDetails,
        props: true,
        meta: { role: 'Admin' },
      },
      {
        path: 'clients/logs',
        name: 'ClientActivityLogs',
        component: ClientActivityLogs,
        meta: { role: 'Admin' },
      },

      // GUEST SUPPORT WITH CHILD ROUTES
      {
        path: 'guest-support',
        component: AdminGuestSupport,
        meta: { role: 'Admin' },
        children: [
          {
            path: 'requests',
            name: 'AdminGuestRequests',
            component: () =>
              import('@/modules/admin/homepage/guestSupport/GuestRequests.vue'),
            meta: { tab: 'requests' }, // ✅ add this
          },
          {
            path: 'requests/:id',
            name: 'AdminGuestRequestDetails',
            component: () =>
              import('@/modules/admin/homepage/guestSupport/GuestRequest.vue'),
            props: true,
            meta: { tab: 'requests' }, // ✅ add this
          },
          {
            path: 'messages',
            name: 'AdminGuestMessages',
            component: () =>
              import('@/modules/admin/homepage/guestSupport/GuestMessages.vue'),
            meta: { tab: 'messages' }, // ✅ add this
          },
          {
            path: 'messages/:id',
            name: 'AdminGuestMessageDetails',
            component: () =>
              import('@/modules/admin/homepage/guestSupport/GuestMessage.vue'),
            props: true,
            meta: { tab: 'messages' }, // ✅ add this
          },
          {
            path: '',
            redirect: { name: 'AdminGuestRequests' },
          },
        ],
      },

      {
        path: 'client-support',
        name: 'AdminClientSupport',
        component: AdminClientSupport,
        meta: { role: 'Admin' },
      },
      {
        path: 'expert-support',
        name: 'AdminExpertSupport',
        component: AdminExpertSupport,
        meta: { role: 'Admin' },
      },
    ],
  },

  /* FALLBACK */
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

/* ============================
   ROUTER
============================ */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

/* ============================
   GLOBAL GUARD
============================ */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Public pages
  if (to.meta.isPublic) return next();

  // Guest-only pages
  if (to.meta.guestOnly) {
    if (authStore.isInitialized && authStore.isAuthenticated) {
      if (authStore.isAdmin) return next({ name: 'AdminDashboard' });
      if (authStore.isExpert) return next({ name: 'ExpertDashboard' });
      if (authStore.isClient) return next({ name: 'Dashboard' });
      return next({ name: 'Home' });
    }
    return next();
  }

  // Protected pages
  if (to.meta.requiresAuth) {
    try {
      if (!authStore.isInitialized && !authStore.isLoading) {
        await authStore.initialize();
      }

      if (!authStore.isAuthenticated) {
        return next({
          name: 'Login',
          query: { redirect: to.fullPath !== '/' ? to.fullPath : undefined },
        });
      }

      if (to.meta.role && authStore.userRole !== to.meta.role) {
        if (authStore.isAdmin) return next({ name: 'AdminDashboard' });
        if (authStore.isExpert) return next({ name: 'ExpertDashboard' });
        if (authStore.isClient) return next({ name: 'Dashboard' });
        return next({ name: 'Home' });
      }

      return next();
    } catch (err) {
      console.error('Router guard error:', err);
      await authStore.logout();
      return next({ name: 'Login' });
    }
  }

  return next();
});

/* ============================
   ROUTER ERROR HANDLER
============================ */
router.onError((err) => {
  console.error('Router error:', err);
});

export default router;
