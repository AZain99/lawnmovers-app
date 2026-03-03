import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Layouts & Views
import AdminLayout from '@/layouts/AdminLayout.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Users from '@/views/Users.vue';
import Jobs from '@/views/Jobs.vue';
import Payouts from '@/views/Payouts.vue';
import Disputes from '@/views/Disputes.vue';
import Settings from '@/views/Settings.vue';
import Payments from '@/views/Payments.vue'; 
import Support from '@/views/Support.vue';

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
      { path: 'payments',component: Payments },
      { path: 'support', component: Support },
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
  const isLocalMockMode = true; 

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