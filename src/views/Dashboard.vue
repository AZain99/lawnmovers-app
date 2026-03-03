<template>
  <div class="dashboard-view">
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="stat-value">${{ stats.totalRevenue }}</p>
        <span class="stat-label">Platform Commission</span>
      </div>
      <div class="stat-card">
        <h3>Active Jobs</h3>
        <p class="stat-value">{{ stats.activeJobs }}</p>
        <span class="stat-label">Currently in progress</span>
      </div>
      <div class="stat-card">
        <h3>Pending Payouts</h3>
        <p class="stat-value">{{ stats.pendingWithdrawals }}</p>
        <span class="stat-label">Awaiting approval</span>
      </div>
      <div class="stat-card">
        <h3>Open Disputes</h3>
        <p class="stat-value text-danger">{{ stats.openDisputes }}</p>
        <span class="stat-label">Requires attention</span>
      </div>
    </div>

    <div class="card recent-activity">
      <h3>Recent Job Activities</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in recentJobs" :key="job.id">
            <td>#{{ job.id.slice(-5) }}</td>
            <td>{{ job.customerName }}</td>
            <td>{{ job.serviceType }}</td>
            <td><span :class="['badge', `badge-${job.status}`]">{{ job.status }}</span></td>
            <td>${{ job.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import adminApi from '../api/adminService';
import adminApi from '../api/mockService';

const stats = ref({ totalRevenue: 0, activeJobs: 0, pendingWithdrawals: 0, openDisputes: 0 });
const recentJobs = ref([]);

onMounted(async () => {
  // Aggregated stats from your NestJS analytics endpoint
  const res = await adminApi.get('/admin/stats'); 
  stats.value = res.data.overview;
  recentJobs.value = res.data.recentJobs;
});
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 4px solid var(--primary-green); }
.stat-value { font-size: 2rem; font-weight: bold; margin: 10px 0; }
.stat-label { color: var(--text-grey); font-size: 0.9rem; }
.text-danger { color: var(--danger); }
</style>