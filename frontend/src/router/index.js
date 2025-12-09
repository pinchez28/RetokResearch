import { createRouter, createWebHistory } from 'vue-router';

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

/* ============================
   CLIENT PAGES
============================ */
import Dashboard from '@/modules/client/Dashboard.vue';
import ClientProjects from '@/modules/client/Projects.vue';
import JobTracking from '@/modules/client/JobTracking.vue';
import JobDetails from '@/modules/client/JobDetails.vue';
import ClientJobApplications from '@/modules/client/ClientJobApplications.vue';
import Messages from '@/modules/client/Messages.vue';
import Payments from '@/modules/client/Payments.vue';
import PostJob from '@/modules/client/PostJob.vue';
import Profile from '@/modules/client/Profile.vue';
import Support from '@/modules/client/Support.vue';

/* ============================
   ADMIN PAGES - Homepage Management
============================ */
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

/* ============================
   ADMIN PAGES - Support
============================ */
const AdminGuestSupport = () =>
  import('@/modules/admin/homepage/GuestSupport.vue');
const AdminClientSupport = () =>
  import('@/modules/admin/homepage/ClientSupport.vue');
const AdminExpertSupport = () =>
  import('@/modules/admin/homepage/ExpertSupport.vue');

/* ============================
   ADMIN PAGES - Jobs
============================ */
const ActiveJobs = () => import('@/modules/admin/jobs/ActiveJobs.vue');
const ActiveJobDetails = () =>
  import('@/modules/admin/jobs/ActiveJobDetails.vue');
const CompletedJobs = () => import('@/modules/admin/jobs/CompletedJobs.vue');
const JobDisputes = () => import('@/modules/admin/jobs/JobDisputes.vue');
const PendingJobs = () => import('@/modules/admin/jobs/PendingJobs.vue');

/* ============================
   ADMIN PAGES - Clients
============================ */
const ClientList = () => import('@/modules/admin/clients/ClientList.vue');
const ClientDetails = () => import('@/modules/admin/clients/ClientDetails.vue');
const ClientActivityLogs = () =>
  import('@/modules/admin/clients/ClientActivityLogs.vue');

/* ============================
   ADMIN PAGES - Experts
============================ */
const ExpertApproval = () =>
  import('@/modules/admin/experts/ExpertApproval.vue');
const ExpertList = () => import('@/modules/admin/experts/ExpertList.vue');
const ExpertDetails = () => import('@/modules/admin/experts/ExpertDetails.vue');

/* ============================
   ADMIN PAGES - Dashboard
============================ */
const AdminDashboard = () => import('@/modules/admin/index/AdminDashboard.vue');

/* ============================
   ROUTES
============================ */
const routes = [
  /* PUBLIC ROUTES */
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

      { path: 'signup', name: 'SignupOverlay', component: SignupOverlay },
      { path: 'signup/client', name: 'ClientSignup', component: ClientSignup },
      { path: 'signup/expert', name: 'ExpertSignup', component: ExpertSignup },
    ],
  },

  /* CLIENT ROUTES */
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
      { path: 'job-tracking', name: 'JobTracking', component: JobTracking },

      // Applications Page
      {
        path: 'jobs/:jobId/applications',
        name: 'ClientJobApplications',
        component: ClientJobApplications,
      },
    ],
  },

  /* EXPERT ROUTES */
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
        path: 'projects/:jobId',
        name: 'ExpertJobDetails',
        component: ExpertJobDetails,
      },

      {
        path: 'assignments',
        name: 'ExpertAssignments',
        component: ExpertAssignments,
      },
      { path: 'profile', name: 'ExpertProfile', component: ExpertProfile },
      { path: 'support', name: 'ExpertSupport', component: ExpertSupport },
    ],
  },

  /* ADMIN ROUTES */
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },

      // Homepage
      { path: 'homepage', name: 'AdminHomepage', component: AdminHomepage },
      {
        path: 'homepage/services',
        name: 'AdminHomeServices',
        component: AdminHomeServices,
      },
      {
        path: 'homepage/experts',
        name: 'AdminHomeExperts',
        component: AdminHomeExperts,
      },
      {
        path: 'homepage/about',
        name: 'AdminHomeAbout',
        component: AdminHomeAbout,
      },
      {
        path: 'homepage/contact',
        name: 'AdminHomeContact',
        component: AdminHomeContact,
      },

      // Jobs
      { path: 'jobs/active', name: 'ActiveJobs', component: ActiveJobs },
      {
        path: 'jobs/active/:id',
        name: 'ActiveJobDetails',
        component: ActiveJobDetails,
      },
      {
        path: 'experts/pending',
        name: 'PendingExperts',
        component: ExpertApproval,
      },
      {
        path: 'jobs/completed',
        name: 'CompletedJobs',
        component: CompletedJobs,
      },
      { path: 'jobs/pending', name: 'PendingJobs', component: PendingJobs },
      { path: 'jobs/disputes', name: 'JobDisputes', component: JobDisputes },

      // Clients
      { path: 'clients', name: 'ClientList', component: ClientList },
      {
        path: 'clients/profiles',
        name: 'ClientDetails',
        component: ClientDetails,
      },
      {
        path: 'clients/logs',
        name: 'ClientActivityLogs',
        component: ClientActivityLogs,
      },

      // Experts
      { path: 'experts', name: 'ExpertList', component: ExpertList },
      {
        path: 'experts/performance',
        name: 'ExpertDetails',
        component: ExpertDetails,
      },

      // Support
      {
        path: 'guest-support',
        name: 'AdminGuestSupport',
        component: AdminGuestSupport,
      },
      {
        path: 'client-support',
        name: 'AdminClientSupport',
        component: AdminClientSupport,
      },
      {
        path: 'expert-support',
        name: 'AdminExpertSupport',
        component: AdminExpertSupport,
      },
    ],
  },

  /* FALLBACK */
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

