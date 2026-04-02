<template>
  <div class="jobs-view">
    <div class="header-section">
      <h2>🚜 Real-Time Job Tracking</h2>
      <div class="filter-bar">
        <select v-model="statusFilter" class="status-select">
          <option value="all">All Statuses</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Service & Size</th>
            <th>Customer</th>
            <th>Provider</th>
            <th>Pricing</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in filteredJobs" :key="job.id">
            <td><small>{{ job.id }}</small></td>
            <td>
              <strong>{{ job.serviceType }}</strong><br />
              <small>{{ job.propertySize }}</small>
            </td>
            <td>{{ job.customerName || 'N/A' }}</td>
            <td>{{ job.providerName || 'Unassigned' }}</td>
            <td>
              Total: ${{ job.price }}<br />
              <small class="text-green">Payout: ${{ job.providerPayout }}</small>
            </td>
            <td>
              <span :class="['badge', `badge-${job.status}`]">{{ job.status }}</span>
            </td>
            <td>
              <button class="btn btn-outline" @click="viewDetails(job)">Details</button>
              <button v-if="job.status === 'pending_approval'" 
                      class="btn btn-primary" 
                      @click="updateJobStatus(job.id, 'approved')">Approve</button>
            </td>
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

const jobs = ref([]);
const statusFilter = ref('all');

const fetchJobs = async () => {
  const { data } = await adminApi.get('/jobs/all');
  jobs.value = data;
};

const filteredJobs = computed(() => {
  if (statusFilter.value === 'all') return jobs.value;
  return jobs.value.filter(j => j.status === statusFilter.value);
});

const updateJobStatus = async (jobId, newStatus) => {
  const adminNote = prompt("Add an internal note (optional):");
  await adminApi.patch(`/jobs/${jobId}/status`, { 
    status: newStatus, 
    adminNotes: adminNote 
  });
  fetchJobs();
};

onMounted(fetchJobs);
</script>

<style scoped>
.text-green { color: #2ecc71; font-weight: bold; }
.badge-pending_approval { background: #fff3cd; color: #856404; }
.badge-assigned { background: #d1ecf1; color: #0c5460; }
.badge-in_progress { background: #cce5ff; color: #004085; }
.badge-completed { background: #d4edda; color: #155724; }
.badge-cancelled { background: #f8d7da; color: #721c24; }
</style>