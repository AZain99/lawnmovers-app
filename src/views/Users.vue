<template>
  <div class="users-view">
    <div class="view-header">
      <div class="header-content">
        <h2>User Management</h2>
        <p>Manage customers, service providers, and administrative roles.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openAddAdmin">
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
                  @click="suspendUser(user.uid)"
                >
                  Suspend
                </button>
                <button 
                  v-else 
                  class="btn btn-primary btn-sm" 
                  @click="reactivateUser(user.uid)"
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

    <div class="pagination-row" v-if="!isLoading">
      <button class="btn btn-outline btn-sm" :disabled="pageNumber === 1" @click="prevPage">Previous</button>
      <span class="page-indicator">Page {{ pageNumber }}</span>
      <button class="btn btn-primary btn-sm" :disabled="!hasMore" @click="nextPage">Next</button>
    </div>

    <!-- Add Internal Admin Modal -->
    <div v-if="showAddAdmin" class="modal-backdrop">
      <div class="modal">
        <h3>Add Internal Admin</h3>
        <div class="modal-body">
          <label>Name</label>
          <input v-model="newAdmin.name" type="text" placeholder="Full name" />
          <label>Email</label>
          <input v-model="newAdmin.email" type="email" placeholder="email@example.com" />
          <label>Password</label>
          <input v-model="newAdmin.password" type="password" placeholder="Password" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeAddAdmin">Cancel</button>
          <button class="btn btn-primary" @click="addInternalAdmin">Create</button>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="modal-backdrop">
      <div class="modal detail-modal">
        <h3>User Details</h3>
        <div class="detail-row"><strong>Name:</strong> {{ selectedUser.name }}</div>
        <div class="detail-row"><strong>Email:</strong> {{ selectedUser.email }}</div>
        <div class="detail-row"><strong>Role:</strong> {{ selectedUser.role }}</div>
        <div class="detail-row"><strong>Status:</strong> {{ selectedUser.status }}</div>
        <div class="detail-row"><strong>UID:</strong> {{ selectedUser.uid }}</div>
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
import adminApi from '../api/adminService';

const users = ref([]);
const roleFilter = ref('all');
const searchQuery = ref('');
const selectedUser = ref(null);
const pageNumber = ref(1);
const pageSize = ref(20);
const hasMore = ref(false);
const lastVisible = ref(null);
const isLoading = ref(false);

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

const viewDetails = (uid) => {
  const user = users.value.find(u => (u.uid || u.id) === uid);
  if (user) {
    selectedUser.value = { ...user };
  }
};

const updateUserStatus = async (uid, status) => {
  await adminApi.patch(`/users/${uid}/status`, { status });
  await fetchUsers(true);
};

const getRelatedRecords = async (uid) => {
  const collectionNames = ['jobs', 'payments', 'withdrawals'];
  const tasks = [];

  for (const name of collectionNames) {
    const queries = [
      query(collection(db, name), where('userId', '==', uid)),
      query(collection(db, name), where('uid', '==', uid)),
      query(collection(db, name), where('customerId', '==', uid)),
      query(collection(db, name), where('providerId', '==', uid))
    ];

    for (const q of queries) {
      tasks.push(getDocs(q));
    }
  }

  const snapshots = await Promise.all(tasks);
  const docsToUpdate = [];

  for (const snap of snapshots) {
    snap.forEach(docSnap => {
      docsToUpdate.push({ ref: doc(db, docSnap.ref.parent.path, docSnap.id), data: { status: 'cancelled', suspended: true, suspendedAt: new Date().toISOString() } });
    });
  }

  return docsToUpdate;
};

const suspendUser = async (uid) => {
  if (!confirm('Suspend this user and cancel their related jobs, payments, and withdrawals?')) return;

  try {
    await updateUserStatus(uid, 'suspended');
    const updates = await getRelatedRecords(uid);

    await Promise.all(
      updates.map(item => updateDoc(item.ref, item.data))
    );

    alert('User suspended successfully. Related records were canceled.');
    await fetchUsers(true);
  } catch (error) {
    console.error('Suspend failed:', error);
    alert('Suspend failed: ' + (error.message || error));
  }
};

const reactivateUser = async (uid) => {
  try {
    await updateUserStatus(uid, 'active');
    alert('User reactivated successfully.');
    await fetchUsers(true);
  } catch (error) {
    console.error('Reactivate failed:', error);
    alert('Reactivate failed: ' + (error.message || error));
  }
};

// Add Internal Admin modal state and handlers
const showAddAdmin = ref(false);
const newAdmin = ref({ name: '', email: '', password: '' });

const openAddAdmin = () => {
  newAdmin.value = { name: '', email: '', password: '' };
  showAddAdmin.value = true;
};

const closeAddAdmin = () => {
  showAddAdmin.value = false;
};

const addInternalAdmin = async () => {
  if (!newAdmin.value.name || !newAdmin.value.email || !newAdmin.value.password) {
    alert('Please provide name, email and password.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newAdmin.value.email.trim(),
      newAdmin.value.password
    );

    await setDoc(doc(db, 'admin', userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: newAdmin.value.name.trim(),
      email: newAdmin.value.email.trim().toLowerCase(),
      role: 'admin',
      status: 'active',
      createdAt: serverTimestamp()
    });

    alert('Admin created successfully.');
    closeAddAdmin();
    await fetchUsers(true);
  } catch (error) {
    console.error('Failed to add admin:', error);
    alert(error.message || 'Failed to add admin');
  }
};

onMounted(() => fetchUsers(true));
</script>

<style scoped>
.view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-content h2 { margin-bottom: 4px; color: var(--dark-navy); }
.header-content p { color: var(--text-grey); font-size: 0.9rem; }

.filter-card { padding: 15px 20px; margin-bottom: 20px; }
.filter-group { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.search-wrapper { flex: 1; }
.form-input { width: 100%; max-width: 400px; padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; }

.toggle-group { display: flex; background: #f1f3f5; padding: 4px; border-radius: 10px; }
.toggle-btn { 
  border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; 
  font-weight: 600; font-size: 0.85rem; color: #7f8c8d; transition: 0.2s; background: transparent;
}
.toggle-btn.active { background: white; color: var(--primary-green); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

.table-card { padding: 0; overflow: hidden; }
.data-table { border-collapse: separate; border-spacing: 0; }
.data-table th { background: #fafafa; padding: 15px 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
.data-table td { padding: 16px 20px; vertical-align: middle; }
.font-bold { font-weight: 600; color: var(--dark-navy); }
.text-grey { color: #7f8c8d; font-size: 0.9rem; }
.text-right { text-align: right; }
.action-btns { display: flex; gap: 8px; justify-content: flex-end; }

.role-tag { font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; }
.role-tag.provider { background: #e3f2fd; color: #1976d2; }
.role-tag.customer { background: #f3e5f5; color: #7b1fa2; }
.role-tag.admin { background: #fff3e0; color: #f57c00; }

.btn-sm { padding: 6px 12px; font-size: 0.75rem; }
.empty-row { text-align: center; padding: 40px !important; color: #95a5a6; font-style: italic; }
.pagination-row {
  display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 16px;
}
.page-indicator { color: #4a5568; font-size: 0.85rem; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,10,10,0.45);
  z-index: 9999;
}
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 360px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.modal h3 { margin: 0 0 12px; }
.modal-body { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
.modal-body input { padding:8px 10px; border:1px solid #ddd; border-radius:6px; width:100%; }
.modal-actions { display:flex; gap:8px; justify-content:flex-end; }
.detail-row { margin: 8px 0; }
.detail-modal { width: 420px; }
</style>