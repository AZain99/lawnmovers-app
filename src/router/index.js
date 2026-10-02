import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

// Desktop Layouts & Views
const AdminLayout = () => import('@/layouts/AdminLayout.vue');
const Login = () => import('@/views/Login.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Users = () => import('@/views/Users.vue');
const Jobs = () => import('@/views/Jobs.vue');
const Payouts = () => import('@/views/Payouts.vue');
const Disputes = () => import('@/views/Disputes.vue');
const Settings = () => import('@/views/Settings.vue');
const Payments = () => import('@/views/Payments.vue');
const Support = () => import('@/views/Support.vue');
const Profile = () => import('@/views/Profile.vue');

// Mobile Layouts & Views
const MobileLayout = () => import('@/layouts/MobileLayout.vue');
const MobileDashboard = () => import('@/views/mobile/Dashboard.vue');
const MobileUsers = () => import('@/views/mobile/Users.vue');
const MobileJobs = () => import('@/views/mobile/Jobs.vue');
const MobilePayments = () => import('@/views/mobile/Payments.vue');
const MobileWithdrawals = () => import('@/views/mobile/Withdrawals.vue');

const routes = [
  { path: '/login', name: 'Login', component: Login },
  
  // Desktop Routes
  {
    path: '/',
    component: AdminLayout,
    redirect: '/login',
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'jobs', component: Jobs },
      { path: 'withdrawals', component: Payouts },
      { path: 'disputes', component: Disputes },
      { path: 'settings', component: Settings },
      { path: 'payments', component: Payments },
      { path: 'support', component: Support },
      { path: 'profile', component: Profile }
    ]
  },

  // Mobile Routes
  {
    path: '/mobile',
    component: MobileLayout,
    redirect: '/mobile/dashboard',
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: MobileDashboard },
      { path: 'users', component: MobileUsers },
      { path: 'jobs', component: MobileJobs },
      { path: 'payments', component: MobilePayments },
      { path: 'withdrawals', component: MobileWithdrawals }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) {
    next('/login');
    return;
  }

  if (to.path === '/login' && user) {
    const deviceType = localStorage.getItem('deviceType') || 'desktop';
    if (deviceType === 'mobile' || deviceType === 'tablet') {
      next('/mobile/dashboard');
    } else {
      next('/dashboard');
    }
    return;
  }

  next();
});

export default router;