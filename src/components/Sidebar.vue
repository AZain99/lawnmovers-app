<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
      </div>
      <span v-if="!isCollapsed" class="brand-name">LawnAdmin</span>
    </div>

    <nav class="sidebar-nav">
      <div v-if="!isCollapsed" class="nav-section">Main Menu</div>
      
      <router-link to="/dashboard" class="nav-item" title="Dashboard">
        <span class="material-symbols-rounded icon">dashboard</span>
        <span v-if="!isCollapsed" class="label">Dashboard</span>
      </router-link>

      <div v-if="!isCollapsed" class="nav-section">Management</div>
      
      <router-link to="/users" class="nav-item" title="Users">
        <span class="material-symbols-rounded icon">group</span>
        <span v-if="!isCollapsed" class="label">User Accounts</span>
      </router-link>

      <router-link to="/jobs" class="nav-item" title="Jobs">
        <span class="material-symbols-rounded icon">agriculture</span>
        <span v-if="!isCollapsed" class="label">Job Requests</span>
      </router-link>

      <router-link to="/payments" class="nav-item" title="Transactions">
        <span class="material-symbols-rounded icon">payments</span>
        <span v-if="!isCollapsed" class="label">Transactions</span>
      </router-link>

      <div v-if="!isCollapsed" class="nav-section">Finance & Support</div>

      <router-link to="/withdrawals" class="nav-item" title="Payouts">
        <span class="material-symbols-rounded icon">account_balance_wallet</span>
        <span v-if="!isCollapsed" class="label">Payouts</span>
      </router-link>

      <router-link to="/disputes" class="nav-item" title="Disputes">
        <span class="material-symbols-rounded icon">gavel</span>
        <span v-if="!isCollapsed" class="label">Disputes</span>
      </router-link>

      <router-link to="/support" class="nav-item" title="Support">
        <span class="material-symbols-rounded icon">support_agent</span>
        <span v-if="!isCollapsed" class="label">Support Tickets</span>
      </router-link>

      <div class="nav-spacer"></div>

      <router-link to="/settings" class="nav-item" title="Settings">
        <span class="material-symbols-rounded icon">settings</span>
        <span v-if="!isCollapsed" class="label">System Settings</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
defineProps(['isCollapsed']);
</script>

<style scoped>
/* 1. Sidebar Base - Deep Navy */
.sidebar {
  width: 260px;
  background: #1a252f; /* Deep Midnight Navy */
  color: #ffffff;
  height: 100vh;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 1000;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

/* 2. Header & Logo (Shrunk and Centered) */
.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar.collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.logo-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-img {
  width: 22px; /* Professional shrunk size */
  height: 22px;
  object-fit: contain;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2ecc71; /* Emerald Green */
  white-space: nowrap;
  margin-left: 8px;
  letter-spacing: -0.5px;
}

/* 3. Navigation List Logic */
.sidebar-nav {
  padding: 15px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /* Horizontally centers all children */
}

.nav-section {
  width: 100%;
  padding: 20px 0 8px 25px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #bdc3c7;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  
  /* Expanded State Dimensions */
  width: 230px; 
  height: 46px;
  padding: 0 15px;
  border-radius: 8px; /* Squarish corners */
}

/* COLLAPSED STATE: Forced Square Centering */
.sidebar.collapsed .nav-item {
  width: 50px;  /* Perfect Square */
  height: 50px; /* Perfect Square */
  padding: 0;
  justify-content: center;
  margin-left: 0;
  margin-right: 0;
}

.nav-item .icon {
  font-size: 22px; /* Balanced icon size */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.label {
  margin-left: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.nav-spacer {
  flex: 1; /* Pushes settings to the bottom */
}

/* 4. Hover & Active States (Green Theme) */
.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

/* The Emerald Highlight */
.router-link-active {
  background: #2ecc71 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
}

/* Hide Labels in Collapsed Mode */
.sidebar.collapsed .label,
.sidebar.collapsed .nav-section,
.sidebar.collapsed .brand-name {
  display: none;
}
</style>