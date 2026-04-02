<template>
  <div class="users-view">
    <div class="view-header">
      <div class="header-content">
        <h2>User Management</h2>
        <p>Manage customers, service providers, and administrative roles.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary">
          <i>+</i> Add Internal Admin
        </button>
      </div>
    </div>

    <div class="card filter-card">
      <div class="filter-group">
        <div class="search-wrapper">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by name, email, or ID..." 
            class="form-input"
          />
        </div>
        <div class="toggle-group">
          <button 
            @click="roleFilter = 'all'" 
            :class="['toggle-btn', { active: roleFilter === 'all' }]"
          >All</button>
          <button 
            @click="roleFilter = 'provider'" 
            :class="['toggle-btn', { active: roleFilter === 'provider' }]"
          >Providers</button>
          <button 
            @click="roleFilter = 'customer'" 
            :class="['toggle-btn', { active: roleFilter === 'customer' }]"
          >Customers</button>
        </div>
      </div>
    </div>

    <div class="card table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email Address</th>
            <th>Account Role</th>
            <th>Account Status</th>
            <th class="text-right">Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.uid">
            <td class="font-bold">{{ user.name }}</td>
            <td class="text-grey">{{ user.email }}</td>
            <td>
              <span :class="['role-tag', user.role]">
                {{ user.role.toUpperCase() }}
              </span>
            </td>
            <td>
              <span :class="['badge', user.status === 'active' ? 'badge-active' : 'badge-danger']">
                {{ user.status }}
              </span>
            </td>
            <td class="text-right">
              <div class="action-btns">
                <button class="btn btn-outline btn-sm" @click="viewDetails(user.uid)">
                  View
                </button>
                <button 
                  v-if="user.status === 'active'" 
                  class="btn btn-danger btn-sm" 
                  @click="updateStatus(user.uid, 'suspended')"
                >
                  Suspend
                </button>
                <button 
                  v-else 
                  class="btn btn-primary btn-sm" 
                  @click="updateStatus(user.uid, 'active')"
                >
                  Reactivate
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="empty-row">No users found matching your criteria.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import adminApi from '../api/adminService';
// import adminApi from '../api/mockService';

const users = ref([]);
const roleFilter = ref('all');
const searchQuery = ref('');

const fetchUsers = async () => {
  const { data } = await adminApi.get('/users/all');
  users.value = data;
};

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesRole = roleFilter.value === 'all' || u.role === roleFilter.value;
    const matchesSearch = //u.role.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesRole && matchesSearch;
  });
});

const updateStatus = async (uid, status) => {
  if (confirm(`Are you sure you want to set this user to ${status}?`)) {
    await adminApi.patch(`/users/${uid}/status`, { status });
    fetchUsers(); // Refresh list
  }
};

const viewDetails = (uid) => {
  console.log("Navigating to user details for:", uid);
};

onMounted(fetchUsers);
</script>

<style scoped>
.view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-content h2 { margin-bottom: 4px; color: var(--dark-navy); }
.header-content p { color: var(--text-grey); font-size: 0.9rem; }

/* Filter Styling */
.filter-card { padding: 15px 20px; margin-bottom: 20px; }
.filter-group { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.search-wrapper { flex: 1; }
.form-input { width: 100%; max-width: 400px; padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; }

/* Toggle Button Group */
.toggle-group { display: flex; background: #f1f3f5; padding: 4px; border-radius: 10px; }
.toggle-btn { 
  border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; 
  font-weight: 600; font-size: 0.85rem; color: #7f8c8d; transition: 0.2s; background: transparent;
}
.toggle-btn.active { background: white; color: var(--primary-green); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

/* Table Enhancements */
.table-card { padding: 0; overflow: hidden; }
.data-table { border-collapse: separate; border-spacing: 0; }
.data-table th { background: #fafafa; padding: 15px 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
.data-table td { padding: 16px 20px; vertical-align: middle; }
.font-bold { font-weight: 600; color: var(--dark-navy); }
.text-grey { color: #7f8c8d; font-size: 0.9rem; }
.text-right { text-align: right; }
.action-btns { display: flex; gap: 8px; justify-content: flex-end; }

/* Role Tags */
.role-tag { font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; }
.role-tag.provider { background: #e3f2fd; color: #1976d2; }
.role-tag.customer { background: #f3e5f5; color: #7b1fa2; }
.role-tag.admin { background: #fff3e0; color: #f57c00; }

.btn-sm { padding: 6px 12px; font-size: 0.75rem; }
.empty-row { text-align: center; padding: 40px !important; color: #95a5a6; font-style: italic; }
</style>