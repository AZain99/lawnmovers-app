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

    <div class="pagination-row" v-if="!isLoading">
      <button class="btn btn-outline btn-sm" :disabled="pageNumber === 1" @click="prevPage">Previous</button>
      <span class="page-indicator">Page {{ pageNumber }}</span>
      <button class="btn btn-primary btn-sm" :disabled="!hasMore" @click="nextPage">Next</button>
    </div>

    <div v-if="selectedJob" class="modal-backdrop">
      <div class="modal detail-modal">
        <h3>Job Details</h3>
        <div class="detail-grid">
          <div class="detail-row"><strong>Job ID:</strong> {{ selectedJob.id }}</div>
          <div class="detail-row"><strong>Status:</strong> {{ selectedJob.status }}</div>
          <div class="detail-row"><strong>Service:</strong> {{ selectedJob.serviceType }}</div>
          <div class="detail-row"><strong>Property Size:</strong> {{ selectedJob.propertySize }}</div>
          <div class="detail-row"><strong>Customer:</strong> {{ selectedJob.customerName || 'N/A' }}</div>
          <div class="detail-row"><strong>Customer Email:</strong> {{ selectedJob.customerEmail || 'N/A' }}</div>
          <div class="detail-row"><strong>Provider:</strong> {{ selectedJob.providerName || 'Unassigned' }}</div>
          <div class="detail-row"><strong>Provider Email:</strong> {{ selectedJob.providerEmail || 'N/A' }}</div>
          <div class="detail-row"><strong>Price:</strong> ${{ selectedJob.price }}</div>
          <div class="detail-row"><strong>Provider Payout:</strong> ${{ selectedJob.providerPayout }}</div>
          <div class="detail-row"><strong>Scheduled Date:</strong> {{ selectedJob.date || 'N/A' }}</div>
          <div class="detail-row"><strong>Address:</strong> {{ selectedJob.address || 'N/A' }}</div>
          <div class="detail-row"><strong>Notes:</strong> {{ selectedJob.notes || 'No notes' }}</div>
          <div class="detail-row"><strong>Created At:</strong> {{ selectedJob.createdAt || 'N/A' }}</div>
          <div class="detail-row"><strong>Admin Notes:</strong> {{ selectedJob.adminNotes || 'No admin notes' }}</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="selectedJob = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import adminApi from '../api/adminService';

const jobs = ref([]);
const statusFilter = ref('all');
const selectedJob = ref(null);
const pageNumber = ref(1);
const pageSize = ref(20);
const hasMore = ref(false);
const lastVisible = ref(null);
const isLoading = ref(false);

const fetchJobs = async (resetPage = false) => {
  if (resetPage) {
    pageNumber.value = 1;
    lastVisible.value = null;
  }

  isLoading.value = true;
  const { data, hasMore: more, lastVisible: nextLastVisible } = await adminApi.list('jobs', {
    pageSize: pageSize.value,
    orderField: 'createdAt',
    orderDirection: 'desc',
    lastVisible: lastVisible.value
  });

  if (resetPage || pageNumber.value === 1) {
    jobs.value = data;
  } else {
    jobs.value = [...jobs.value, ...data];
  }

  hasMore.value = more;
  lastVisible.value = nextLastVisible;
  isLoading.value = false;
};

const nextPage = async () => {
  if (!hasMore.value) return;
  pageNumber.value += 1;
  await fetchJobs();
};

const prevPage = async () => {
  if (pageNumber.value <= 1) return;
  pageNumber.value -= 1;
  if (pageNumber.value === 1) {
    await fetchJobs(true);
  } else {
    await fetchJobs();
  }
};

const filteredJobs = computed(() => {
  const list = [...jobs.value];
  if (statusFilter.value === 'all') return list;
  return list.filter(j => j.status === statusFilter.value);
});

const viewDetails = (job) => {
  selectedJob.value = { ...job };
};

const updateJobStatus = async (jobId, newStatus) => {
  const adminNote = prompt('Add an internal note (optional):');
  await adminApi.patch(`/jobs/${jobId}/status`, { 
    status: newStatus, 
    adminNotes: adminNote 
  });
  await fetchJobs(true);
};

onMounted(() => fetchJobs(true));
</script>

<style scoped>
.text-green { color: #2ecc71; font-weight: bold; }
.badge-pending_approval { background: #fff3cd; color: #856404; }
.badge-assigned { background: #d1ecf1; color: #0c5460; }
.badge-in_progress { background: #cce5ff; color: #004085; }
.badge-completed { background: #d4edda; color: #155724; }
.badge-cancelled { background: #f8d7da; color: #721c24; }
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
  width: 520px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 14px;
}
.detail-row {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  word-break: break-word;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>