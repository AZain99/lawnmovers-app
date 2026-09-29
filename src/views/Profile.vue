<template>
  <div class="profile-view">
    <div class="page-header">
      <h2>Profile</h2>
    </div>

    <div class="card profile-card">
      <div class="avatar-wrap">
        <img :src="avatar" alt="Admin avatar" />
      </div>

      <div class="profile-details">
        <div class="detail-row">
          <span class="label">Full Name</span>
          <strong>{{ admin.name || 'Super Admin' }}</strong>
        </div>
        <div class="detail-row">
          <span class="label">Email</span>
          <strong>{{ admin.email || authUser?.email || 'Not available' }}</strong>
        </div>
        <div class="detail-row">
          <span class="label">Role</span>
          <strong>{{ admin.role || 'Platform Manager' }}</strong>
        </div>
        <div class="detail-row">
          <span class="label">Status</span>
          <strong>{{ admin.status || 'Active' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const auth = getAuth();
const authUser = ref(null);
const admin = ref({
  name: 'Super Admin',
  email: '',
  role: 'Platform Manager',
  status: 'Active'
});

const avatar = 'https://ui-avatars.com/api/?name=Super+Admin&background=2ecc71&color=fff';

onMounted(async () => {
  authUser.value = auth.currentUser;

  if (!authUser.value) return;

  try {
    const adminDoc = await getDoc(doc(db, 'admin', authUser.value.uid));
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      admin.value = {
        ...admin.value,
        ...adminData,
        email: adminData.email || authUser.value.email || admin.value.email
      };
    } else {
      admin.value.email = authUser.value.email || admin.value.email;
    }
  } catch (error) {
    console.error('Profile fetch failed:', error);
  }
});
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0; }

.profile-card {
  max-width: 720px;
  display: flex;
  gap: 28px;
  align-items: center;
  padding: 28px;
}

.avatar-wrap {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #eafaf1;
  background: #f4f6f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  flex: 1;
  display: grid;
  gap: 18px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2f7;
}

.label {
  color: #7f8c8d;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

strong {
  color: #1f2937;
  font-size: 1.05rem;
}
</style>
