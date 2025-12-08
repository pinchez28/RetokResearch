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
/* EXPERT PAGES */
import ExpertDashboard from '@/pages/expert/Dashboard.vue';
import ExpertJobs from '@/pages/expert/jobs.vue';
import ExpertProjects from '@/pages/expert/Projects.vue';
import ExpertAssignments from '@/pages/expert/Assignments.vue';
import ExpertProfile from '@/pages/expert/Profile.vue';
import ExpertSupport from '@/pages/expert/Support.vue';
import ExpertJobDetails from '@/pages/expert/ExpertJobDetails.vue'; // ✅ ADD THIS

/* ============================
   CLIENT PAGES
============================ */
import Dashboard from '@/pages/client/Dashboard.vue';
import ClientProjects from '@/pages/client/Projects.vue';
import JobTracking from '../pages/client/JobTracking.vue';
import JobDetails from '@/pages/client/JobDetails.vue';
import ClientJobApplications from '../pages/client/ClientJobApplications.vue';
import Messages from '@/pages/client/Messages.vue';
import Payments from '@/pages/client/Payments.vue';
import PostJob from '@/pages/client/PostJob.vue';
import Profile from '@/pages/client/Profile.vue';
import Support from '@/pages/client/Support.vue';

/* ============================
   ADMIN PAGES - Homepage Management
============================ */
const AdminHomepage = () =>
  import('@/pages/admin/homepagemanagement/HomepageManagement.vue');
const AdminHomeServices = () =>
  import('@/pages/admin/homepagemanagement/ServiceSection.vue');
const AdminHomeExperts = () =>
  import('@/pages/admin/homepagemanagement/TopRatedExperts.vue');
const AdminHomeAbout = () =>
  import('@/pages/admin/homepagemanagement/AboutSection.vue');
const AdminHomeContact = () =>
  import('@/pages/admin/homepagemanagement/PublicContactSection.vue');

/* ============================
   ADMIN PAGES - Support
============================ */
const AdminGuestSupport = () =>
  import('@/pages/admin/homepagemanagement/GuestSupport.vue');
const AdminClientSupport = () =>
  import('@/pages/admin/homepagemanagement/ClientSupport.vue');
const AdminExpertSupport = () =>
  import('@/pages/admin/homepagemanagement/ExpertSupport.vue');

/* ============================
   ADMIN PAGES - Jobs
============================ */
const ActiveJobs = () => import('@/pages/admin/activeJobs/ActiveJobs.vue');
const ActiveJobDetails = () =>
  import('@/pages/admin/activeJobs/ActiveJobDetails.vue');
const CompletedJobs = () =>
  import('@/pages/admin/activeJobs/CompletedJobs.vue');
const JobDisputes = () => import('@/pages/admin/activeJobs/JobDisputes.vue');

/* ============================
   ADMIN PAGES - Clients
============================ */
const ClientList = () => import('@/pages/admin/clients/ClientList.vue');
const ClientDetails = () => import('@/pages/admin/clients/ClientDetails.vue');
const ClientActivityLogs = () =>
  import('@/pages/admin/clients/ClientActivityLogs.vue');

/* ============================
   ADMIN PAGES - Experts
============================ */
const ExpertApproval = () => import('@/pages/admin/experts/ExpertApproval.vue');
const ExpertList = () => import('@/pages/admin/experts/ExpertList.vue');
const ExpertDetails = () => import('@/pages/admin/experts/ExpertDetails.vue');

/* ============================
   ADMIN PAGES - Dashboard
============================ */
const AdminDashboard = () => import('@/pages/admin/AdminDashboard.vue');

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

      // ✅ Dedicated Applications Page
      {
        path: 'jobs/:jobId/applications',
        name: 'ClientJobApplications',
        component: ClientJobApplications, // make sure imported
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
        path: 'jobs/:jobId', // <-- must match `route.params.jobId`
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

      // Homepage Management
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

      // Jobs & Workflow
      { path: 'jobs/active', name: 'ActiveJobs', component: ActiveJobs },
      {
        path: 'jobs/active/:id',
        name: 'ActiveJobDetails',
        component: ActiveJobDetails,
      },
      {
        path: 'jobs/completed',
        name: 'CompletedJobs',
        component: CompletedJobs,
      },
      {
        path: 'jobs/pending',
        name: 'PendingJobs',
        component: () => import('@/pages/admin/activeJobs/PendingJobs.vue'),
      },
      { path: 'jobs/disputes', name: 'JobDisputes', component: JobDisputes },

      // Client Management
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

      // Expert Management
      {
        path: 'experts/pending',
        name: 'ExpertApproval',
        component: ExpertApproval,
      },
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
