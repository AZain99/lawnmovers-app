<template>
  <div class="mobile-container">
    <div class="mobile-header">
      <div class="header-top">
        <img :src="logo" alt="Lawntamers Logo" class="header-logo" />
        <button class="menu-toggle" @click="showMenu = !showMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <nav class="mobile-nav" v-show="showMenu">
      <router-link to="/mobile/dashboard" class="nav-link" @click="showMenu = false">
        <span>Dashboard</span>
      </router-link>
      <router-link to="/mobile/jobs" class="nav-link" @click="showMenu = false">
        <span>Jobs</span>
      </router-link>
      <router-link to="/mobile/users" class="nav-link" @click="showMenu = false">
        <span>Users</span>
      </router-link>
      <router-link to="/mobile/payments" class="nav-link" @click="showMenu = false">
        <span>Payments</span>
      </router-link>
      <router-link to="/mobile/withdrawals" class="nav-link" @click="showMenu = false">
        <span>Withdrawals</span>
      </router-link>
      <button class="nav-link logout" @click="handleLogout">
        <span>Logout</span>
      </button>
    </nav>

    <main class="mobile-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import logo from '@/assets/logo.png';

const showMenu = ref(false);
const router = useRouter();

const handleLogout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
.mobile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f7f6;
  width: 100%;
}

.mobile-header {
  background: linear-gradient(135deg, #1f9d55, #18a86d);
  color: white;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.menu-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
}

.menu-toggle span {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: 0.3s;
}

.mobile-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 64px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow-y: auto;
}

.nav-link {
  padding: 16px 20px;
  border: none;
  background: none;
  color: #1f2937;
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  text-align: left;
  width: 100%;
}

.nav-link:hover {
  background: #f8f9fa;
}

.nav-link.router-link-active {
  background: #e8f5e9;
  color: #1f9d55;
  font-weight: 600;
}

.nav-link.logout {
  color: #dc2626;
  margin-top: auto;
  border-top: 2px solid #f0f0f0;
}

.mobile-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .mobile-container {
    display: none;
  }
}
</style>
