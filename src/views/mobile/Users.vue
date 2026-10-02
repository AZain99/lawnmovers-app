<template>
  <div class="mobile-users">
    <div class="header-action">
      <button class="btn btn-sm btn-primary" @click="openAddAdmin">+ Add Admin</button>
    </div>

    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Search users..."
      class="search-input"
    />

    <div class="filter-tabs">
      <button 
        :class="['tab-btn', { active: roleFilter === 'all' }]"
        @click="roleFilter = 'all'"
      >All</button>
      <button 
        :class="['tab-btn', { active: roleFilter === 'provider' }]"
        @click="roleFilter = 'provider'"
      >Providers</button>
      <button 
        :class="['tab-btn', { active: roleFilter === 'customer' }]"
        @click="roleFilter = 'customer'"
      >Customers</button>
    </div>

    <div v-if="filteredUsers.length === 0" class="empty-state">
      <p>No users found</p>
    </div>

    <div v-else class="users-list">
      <div v-for="user in filteredUsers" :key="user.uid" class="user-card">
        <div class="user-top">
          <span class="user-name">{{ user.name }}</span>
          <span :class="['badge', user.status === 'active' ? 'badge-active' : 'badge-danger']">{{ user.status }}</span>
        </div>
        <div class="user-body">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> <span :class="['role-tag', user.role]">{{ user.role }}</span></p>
        </div>
        <div class="user-actions">
          <button class="btn btn-sm" @click="viewDetails(user.uid)">View</button>
          <button 
            v-if="user.status === 'active'" 
            class="btn btn-sm btn-danger" 
            @click="suspendUser(user.uid)"
          >
            Suspend
          </button>
          <button 
            v-else 
            class="btn btn-sm btn-primary" 
            @click="reactivateUser(user.uid)"
          >
            Reactivate
          </button>
        </div>
      </div>
    </div>

    <div class="pagination-row" v-if="!isLoading">
      <button class="btn btn-sm" :disabled="pageNumber === 1" @click="prevPage">Prev</button>
      <span class="page-indicator">Page {{ pageNumber }}</span>
      <button class="btn btn-sm" :disabled="!hasMore" @click="nextPage">Next</button>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAddAdmin" class="modal-backdrop" @click="closeAddAdmin">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Add Admin</h3>
          <button class="close-btn" @click="closeAddAdmin">×</button>
        </div>
        <div class="modal-body">
          <input v-model="newAdmin.name" type="text" placeholder="Full name" class="form-input" />
          <input v-model="newAdmin.email" type="email" placeholder="Email" class="form-input" />
          <input v-model="newAdmin.password" type="password" placeholder="Password" class="form-input" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeAddAdmin">Cancel</button>
          <button class="btn btn-primary" @click="addInternalAdmin">Create</button>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="modal-backdrop" @click="selectedUser = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>User Details</h3>
          <button class="close-btn" @click="selectedUser = null">×</button>
        </div>
        <div class="detail-grid">
          <div class="detail-row"><strong>Name:</strong> {{ selectedUser.name }}</div>
          <div class="detail-row"><strong>Email:</strong> {{ selectedUser.email }}</div>
          <div class="detail-row"><strong>Role:</strong> {{ selectedUser.role }}</div>
          <div class="detail-row"><strong>Status:</strong> {{ selectedUser.status }}</div>
          <div class="detail-row"><strong>UID:</strong> <small>{{ selectedUser.uid }}</small></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="selectedUser = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import adminApi from '@/api/adminService';

const users = ref([]);
const roleFilter = ref('all');
const searchQuery = ref('');
const selectedUser = ref(null);
const showAddAdmin = ref(false);
const pageNumber = ref(1);
const pageSize = ref(20);
const hasMore = ref(false);
const lastVisible = ref(null);
const isLoading = ref(false);

const newAdmin = ref({
  name: '',
  email: '',
  password: ''
});

const fetchUsers = async (resetPage = false) => {
  if (resetPage) {
    pageNumber.value = 1;
    lastVisible.value = null;
  }

  isLoading.value = true;
  const { data, hasMore: more, lastVisible: nextLastVisible } = await adminApi.list('users', {
    pageSize: pageSize.value,
    orderField: 'createdAt',
    orderDirection: 'desc',
    lastVisible: lastVisible.value
  });

  if (resetPage || pageNumber.value === 1) {
    users.value = data;
  } else {
    users.value = [...users.value, ...data];
  }

  hasMore.value = more;
  lastVisible.value = nextLastVisible;
  isLoading.value = false;
};

const nextPage = async () => {
  if (!hasMore.value) return;
  pageNumber.value += 1;
  await fetchUsers();
};

const prevPage = async () => {
  if (pageNumber.value <= 1) return;
  pageNumber.value -= 1;
  if (pageNumber.value === 1) {
    await fetchUsers(true);
  } else {
    await fetchUsers();
  }
};

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesRole = roleFilter.value === 'all' || u.role === roleFilter.value;
    const matchesSearch = (u.email || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesRole && matchesSearch;
  });
});

const openAddAdmin = () => {
  showAddAdmin.value = true;
};

const closeAddAdmin = () => {
  showAddAdmin.value = false;
  newAdmin.value = { name: '', email: '', password: '' };
};

const addInternalAdmin = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, newAdmin.value.email, newAdmin.value.password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, 'admin', uid), {
      name: newAdmin.value.name,
      email: newAdmin.value.email,
      role: 'admin',
      createdAt: serverTimestamp()
    });
    await fetchUsers(true);
    closeAddAdmin();
    alert('Admin created successfully!');
  } catch (error) {
    alert('Error creating admin: ' + error.message);
  }
};

const viewDetails = (uid) => {
  selectedUser.value = users.value.find(u => u.uid === uid);
};

const suspendUser = async (uid) => {
  await updateDoc(doc(db, 'users', uid), { status: 'suspended' });
  await fetchUsers(true);
};

const reactivateUser = async (uid) => {
  await updateDoc(doc(db, 'users', uid), { status: 'active' });
  await fetchUsers(true);
};

onMounted(() => fetchUsers(true));
</script>

<style scoped>
.mobile-users {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.search-input::placeholder {
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: #9ca3af;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #3b82f6;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.user-role {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #e0e7ff;
  color: #4f46e5;
}

.role-provider {
  background: #fce7f3;
  color: #be185d;
}

.role-customer {
  background: #dbeafe;
  color: #0b5394;
}

.user-details {
  font-size: 12px;
  color: #6b7280;
}

.user-details p {
  margin: 4px 0;
}

.user-details strong {
  color: #1f2937;
}
</style>
