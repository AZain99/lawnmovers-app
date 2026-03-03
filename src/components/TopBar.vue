<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="toggle-btn" @click="$emit('toggle-sidebar')">
        <span class="material-symbols-rounded">menu_open</span>
      </button>
      
      <div class="search-box">
        <span class="material-symbols-rounded search-icon">search</span>
        <input 
          type="text" 
          placeholder="Search jobs, providers, or users..." 
          v-model="searchQuery"
        />
      </div>
    </div>

    <div class="topbar-right">
      <div class="notification-wrapper" @click="showNotifications = !showNotifications">
        <span class="material-symbols-rounded icon-btn">notifications</span>
        <span class="notification-badge">3</span>
        
        <div v-if="showNotifications" class="dropdown-panel notification-dropdown">
          <div class="dropdown-header">Recent Alerts</div>
          <div class="dropdown-item">New job request #9921</div>
          <div class="dropdown-item">Withdrawal request from ProLawn</div>
          <div class="dropdown-item">New dispute raised by Alice</div>
        </div>
      </div>

      <div class="profile-container" v-click-outside="closeDropdown">
        <div class="admin-profile" @click="showProfileDropdown = !showProfileDropdown">
          <div class="admin-info">
            <span class="admin-name">Super Admin</span>
            <span class="admin-role">Platform Manager</span>
          </div>
          <div class="avatar-wrapper">
            <img src="https://ui-avatars.com/api/?name=Admin&background=2ecc71&color=fff" alt="Admin Avatar" />
          </div>
          <span class="material-symbols-rounded expand-icon">expand_more</span>
        </div>

        <div v-if="showProfileDropdown" class="dropdown-panel profile-dropdown">
          <a href="#" class="dropdown-link">
            <span class="material-symbols-rounded">person</span> Profile
          </a>
          <a href="#" class="dropdown-link">
            <span class="material-symbols-rounded">settings</span> Account
          </a>
          <hr />
          <a href="#" @click.prevent="handleLogout" class="dropdown-link logout">
            <span class="material-symbols-rounded">logout</span> Logout
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const showProfileDropdown = ref(false);
const showNotifications = ref(false);

const closeDropdown = () => {
  showProfileDropdown.value = false;
  showNotifications.value = false;
};

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error("Logout failed", error);
  }
};
</script>

<style scoped>
.topbar {
  height: 65px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Left Section */
.topbar-left { display: flex; align-items: center; gap: 20px; }

.toggle-btn {
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.toggle-btn:hover { background: #f7fafc; }

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 20px;
  color: #a0aec0;
}

.search-box input {
  background: #f7fafc;
  border: 1px solid #edf2f7;
  padding: 10px 15px 10px 40px;
  border-radius: 10px;
  width: 320px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  background: white;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
}

/* Right Section */
.topbar-right { display: flex; align-items: center; gap: 15px; }

.notification-wrapper {
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #4a5568;
}

.notification-wrapper:hover { background: #f7fafc; color: #2ecc71; }

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #e74c3c;
  color: white;
  font-size: 10px;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* Profile Section */
.profile-container { position: relative; }

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  transition: background 0.2s;
}

.admin-profile:hover { background: #f7fafc; }

.admin-info { text-align: right; }
.admin-name { display: block; font-weight: 700; font-size: 0.85rem; color: #2c3e50; }
.admin-role { font-size: 0.75rem; color: #a0aec0; font-weight: 500; }

.avatar-wrapper img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #f7fafc;
}

.expand-icon { font-size: 18px; color: #a0aec0; }

/* Dropdown Shared Styles */
.dropdown-panel {
  position: absolute;
  top: 55px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border: 1px solid #edf2f7;
  overflow: hidden;
  min-width: 200px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header { padding: 12px 15px; font-weight: 700; font-size: 0.8rem; color: #a0aec0; background: #f7fafc; }
.dropdown-item { padding: 12px 15px; font-size: 0.85rem; border-bottom: 1px solid #f7fafc; cursor: pointer; }
.dropdown-item:hover { background: #f0fff4; }

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  text-decoration: none;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.dropdown-link:hover { background: #f7fafc; color: #2ecc71; }
.dropdown-link .material-symbols-rounded { font-size: 20px; }
.logout { color: #e74c3c !important; }
.logout:hover { background: #fff5f5 !important; }

hr { border: 0; border-top: 1px solid #edf2f7; margin: 5px 0; }
</style>