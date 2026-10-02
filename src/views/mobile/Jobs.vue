<template>
  <div class="mobile-jobs">
    <div class="filter-section">
      <select v-model="statusFilter" class="status-select">
        <option value="all">All Statuses</option>
        <option value="pending_approval">Pending Approval</option>
        <option value="assigned">Assigned</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <div v-if="filteredJobs.length === 0" class="empty-state">
      <p>No jobs found</p>
    </div>

    <div v-else class="jobs-list">
      <div v-for="job in filteredJobs" :key="job.id" class="job-card">
        <div class="job-header">
          <div class="job-id-badge">
            <span class="job-id">{{ job.id }}</span>
          </div>
          <span :class="['badge', `badge-${job.status}`]">{{ job.status }}</span>
        </div>
        <div class="job-body">
          <p><strong>Service:</strong> {{ job.serviceType }} ({{ job.propertySize }})</p>
          <p><strong>Customer:</strong> {{ job.customerName || 'N/A' }}</p>
          <p><strong>Provider:</strong> {{ job.providerName || 'Unassigned' }}</p>
          <p><strong>Price:</strong> ${{ job.price }} | <span class="payout">${{ job.providerPayout }}</span></p>
        </div>
        <div class="job-actions">
          <button class="btn btn-sm" @click="viewDetails(job)">Details</button>
          <button v-if="job.status === 'pending_approval'" class="btn btn-sm btn-primary" @click="updateJobStatus(job.id, 'approved')">Approve</button>
        </div>
      </div>
    </div>

    <div class="pagination-row" v-if="!isLoading">
      <button class="btn btn-sm" :disabled="pageNumber === 1" @click="prevPage">Prev</button>
      <span class="page-indicator">Page {{ pageNumber }}</span>
      <button class="btn btn-sm" :disabled="!hasMore" @click="nextPage">Next</button>
    </div>

    <div v-if="selectedJob" class="modal-backdrop" @click="selectedJob = null">
      <div class="modal detail-modal" @click.stop>
        <div class="modal-header">
          <h3>Job Details</h3>
          <button class="close-btn" @click="selectedJob = null">×</button>
        </div>
        <div class="detail-grid">
          <div class="detail-row"><strong>Job ID:</strong> {{ selectedJob.id }}</div>
          <div class="detail-row"><strong>Status:</strong> {{ selectedJob.status }}</div>
          <div class="detail-row"><strong>Service:</strong> {{ selectedJob.serviceType }}</div>
          <div class="detail-row"><strong>Size:</strong> {{ selectedJob.propertySize }}</div>
          <div class="detail-row"><strong>Customer:</strong> {{ selectedJob.customerName }}</div>
          <div class="detail-row"><strong>Email:</strong> {{ selectedJob.customerEmail }}</div>
          <div class="detail-row"><strong>Provider:</strong> {{ selectedJob.providerName || 'Unassigned' }}</div>
          <div class="detail-row"><strong>Provider Email:</strong> {{ selectedJob.providerEmail }}</div>
          <div class="detail-row"><strong>Price:</strong> ${{ selectedJob.price }}</div>
          <div class="detail-row"><strong>Payout:</strong> ${{ selectedJob.providerPayout }}</div>
          <div class="detail-row"><strong>Date:</strong> {{ selectedJob.date }}</div>
          <div class="detail-row"><strong>Address:</strong> {{ selectedJob.address }}</div>
          <div class="detail-row"><strong>Notes:</strong> {{ selectedJob.notes || 'No notes' }}</div>
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
import adminApi from '@/api/adminService';

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
  await adminApi.patch(`/jobs/${jobId}/status`, { status: newStatus, adminNotes: adminNote });
  await fetchJobs(true);
};

onMounted(() => fetchJobs(true));
</script>

<style scoped>
.mobile-jobs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filters-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.filter-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}

.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: #9ca3af;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #22c55e;
}

.job-top {
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

.job-content {
  font-size: 13px;
}

.job-content p {
  margin: 4px 0;
  color: #374151;
}

.job-content strong {
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
}

.service {
  color: #6b7280;
  font-size: 12px;
}

.price {
  font-weight: 600;
  color: #22c55e;
  margin-top: 8px;
}
</style>
