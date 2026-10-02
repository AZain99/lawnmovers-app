<template>
  <div class="mobile-dashboard">
    <div class="stats-container">
      <div class="stat-card">
        <h4>Total Revenue</h4>
        <p class="stat-value">${{ stats.totalRevenue }}</p>
      </div>
      <div class="stat-card">
        <h4>Active Jobs</h4>
        <p class="stat-value">{{ stats.activeJobs }}</p>
      </div>
      <div class="stat-card">
        <h4>Pending Payouts</h4>
        <p class="stat-value">{{ stats.pendingWithdrawals }}</p>
      </div>
      <div class="stat-card">
        <h4>Open Disputes</h4>
        <p class="stat-value danger">{{ stats.openDisputes }}</p>
      </div>
    </div>

    <div class="recent-section">
      <h3>Recent Jobs</h3>
      <div v-if="recentJobs.length === 0" class="empty-state">
        <p>No recent jobs</p>
      </div>
      <div v-else class="jobs-list">
        <div v-for="job in recentJobs" :key="job.id" class="job-item">
          <div class="job-header">
            <span class="job-id">#{{ job.id.slice(-5) }}</span>
            <span :class="['badge', `badge-${job.status}`]">{{ job.status }}</span>
          </div>
          <div class="job-details">
            <p><strong>Customer:</strong> {{ job.customerName }}</p>
            <p><strong>Service:</strong> {{ job.serviceType }}</p>
            <p><strong>Price:</strong> ${{ job.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '@/api/adminService';

const stats = ref({
  totalRevenue: 0,
  activeJobs: 0,
  pendingWithdrawals: 0,
  openDisputes: 0
});
const recentJobs = ref([]);

onMounted(async () => {
  try {
    const res = await adminApi.get('/admin/stats');
    stats.value = res.data.overview;
    recentJobs.value = res.data.recentJobs;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
});
</script>

<style scoped>
.mobile-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-top: 3px solid #22c55e;
}

.stat-card h4 {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.stat-value.danger {
  color: #dc2626;
}

.recent-section {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.recent-section h3 {
  font-size: 16px;
  margin: 0 0 16px;
  color: #1f2937;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: #9ca3af;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #f9fafb;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.job-id {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
}

.badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #e0e7ff;
  color: #4f46e5;
}

.badge-active {
  background: #d1fae5;
  color: #047857;
}

.badge-completed {
  background: #d1fae5;
  color: #047857;
}

.badge-pending {
  background: #fef3c7;
  color: #b45309;
}

.job-details {
  font-size: 13px;
  color: #374151;
}

.job-details p {
  margin: 4px 0;
}

.job-details strong {
  color: #1f2937;
}
</style>
