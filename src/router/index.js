import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Layouts & Views
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

const routes = [
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  // If you are in 'Local Development' mode, just click next
  const isLocalMockMode = false; 

  if (isLocalMockMode) {
    next(); // Skip login check
  } else {
    const auth = getAuth();

    // Wait for Firebase to initialize auth state
    const removeListener = onAuthStateChanged(auth, (user) => {
      removeListener(); // Stop listening once we have the state
      
      if (to.meta.requiresAuth && !user) {
        next('/login');
      } else if (to.path === '/login' && user) {
        next('/dashboard');
      } else {
        next();
      }
    });
  }
});

export default router;