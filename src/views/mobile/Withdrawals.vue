<template>
  <div class="mobile-withdrawals">
    <h3>Withdrawal Requests</h3>

    <div v-if="withdrawals.length === 0" class="empty-state">
      <p>No withdrawals</p>
    </div>

    <div v-else class="withdrawals-list">
      <div v-for="req in withdrawals" :key="req.id" class="withdrawal-card">
        <div class="withdrawal-header">
          <span class="req-id">{{ req.providerId }}</span>
          <span :class="['badge', `badge-${req.status}`]">{{ req.status }}</span>
        </div>
        <div class="withdrawal-body">
          <p><strong>Amount:</strong> ${{ req.amount }}</p>
          <p><strong>Method:</strong> {{ req.method }}</p>
          <p><strong>Date:</strong> {{ new Date(req.requestedAt).toLocaleDateString() }}</p>
        </div>
        <div v-if="req.status === 'pending'" class="withdrawal-actions">
          <button class="btn btn-sm btn-primary" @click="process(req.id, 'approved')">Approve</button>
          <button class="btn btn-sm btn-danger" @click="process(req.id, 'rejected')">Reject</button>
        </div>
      </div>
    </div>

    <div class="pagination-row" v-if="!isLoading">
      <button class="btn btn-sm" :disabled="pageNumber === 1" @click="prevPage">Prev</button>
      <span class="page-indicator">Page {{ pageNumber }}</span>
      <button class="btn btn-sm" :disabled="!hasMore" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '@/api/adminService';

const withdrawals = ref([]);
const pageNumber = ref(1);
const hasMore = ref(false);
const lastVisible = ref(null);
const isLoading = ref(false);
const pageSize = ref(20);

const fetchWithdrawals = async (resetPage = false) => {
  if (resetPage) {
    pageNumber.value = 1;
    lastVisible.value = null;
  }

  isLoading.value = true;
  const { data, hasMore: more, lastVisible: nextLastVisible } = await adminApi.list('withdrawals', {
    pageSize: pageSize.value,
    orderField: 'requestedAt',
    orderDirection: 'desc',
    lastVisible: lastVisible.value
  });

  if (resetPage || pageNumber.value === 1) {
    withdrawals.value = data;
  } else {
    withdrawals.value = [...withdrawals.value, ...data];
  }

  hasMore.value = more;
  lastVisible.value = nextLastVisible;
  isLoading.value = false;
};

const nextPage = async () => {
  if (!hasMore.value) return;
  pageNumber.value += 1;
  await fetchWithdrawals();
};

const prevPage = async () => {
  if (pageNumber.value <= 1) return;
  pageNumber.value -= 1;
  if (pageNumber.value === 1) {
    await fetchWithdrawals(true);
  } else {
    await fetchWithdrawals();
  }
};

const process = async (id, status) => {
  const adminNote = prompt('Enter a note for this decision:');
  await adminApi.patch(`/withdrawals/${id}/status`, { status, adminNote });
  await fetchWithdrawals(true);
};

onMounted(() => fetchWithdrawals(true));
</script>

<style scoped>
.mobile-withdrawals {
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

.withdrawals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.withdrawal-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #8b5cf6;
}

.withdrawal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.withdrawal-id {
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

.badge-completed {
  background: #d1fae5;
  color: #047857;
}

.badge-pending {
  background: #fef3c7;
  color: #b45309;
}

.badge-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.withdrawal-content {
  font-size: 13px;
  color: #374151;
}

.withdrawal-content p {
  margin: 4px 0;
}

.withdrawal-content strong {
  color: #1f2937;
}

.date {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
}
</style>
