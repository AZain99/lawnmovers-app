<template>
  <div class="mobile-payments">
    <h3>Transaction Ledger</h3>

    <div v-if="transactions.length === 0" class="empty-state">
      <p>No payments found</p>
    </div>

    <div v-else class="payments-list">
      <div v-for="tx in transactions" :key="tx.id" class="payment-card">
        <div class="payment-header">
          <span class="tx-id">{{ tx.id }}</span>
          <span :class="['badge', tx.status === 'succeeded' ? 'badge-active' : 'badge-danger']">{{ tx.status }}</span>
        </div>
        <div class="payment-body">
          <p><strong>Job Ref:</strong> #{{ tx.jobId }}</p>
          <p><strong>Customer:</strong> {{ tx.customerName }}</p>
          <p><strong>Amount:</strong> ${{ tx.amount }}</p>
          <p><strong>Fee:</strong> -${{ tx.commission }}</p>
          <p><strong>Method:</strong> {{ tx.paymentMethod }}</p>
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

const transactions = ref([]);
const pageNumber = ref(1);
const hasMore = ref(false);
const lastVisible = ref(null);
const isLoading = ref(false);
const pageSize = ref(20);

const fetchTransactions = async (resetPage = false) => {
  if (resetPage) {
    pageNumber.value = 1;
    lastVisible.value = null;
  }

  isLoading.value = true;
  const { data, hasMore: more, lastVisible: nextLastVisible } = await adminApi.list('payments', {
    pageSize: pageSize.value,
    orderField: 'createdAt',
    orderDirection: 'desc',
    lastVisible: lastVisible.value
  });

  if (resetPage || pageNumber.value === 1) {
    transactions.value = data;
  } else {
    transactions.value = [...transactions.value, ...data];
  }

  hasMore.value = more;
  lastVisible.value = nextLastVisible;
  isLoading.value = false;
};

const nextPage = async () => {
  if (!hasMore.value) return;
  pageNumber.value += 1;
  await fetchTransactions();
};

const prevPage = async () => {
  if (pageNumber.value <= 1) return;
  pageNumber.value -= 1;
  if (pageNumber.value === 1) {
    await fetchTransactions(true);
  } else {
    await fetchTransactions();
  }
};

onMounted(() => fetchTransactions(true));
</script>

<style scoped>
.mobile-payments {
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

.payments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #f59e0b;
}

.payment-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.payment-id {
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

.badge-succeeded {
  background: #d1fae5;
  color: #047857;
}

.badge-failed {
  background: #fee2e2;
  color: #dc2626;
}

.payment-content {
  font-size: 13px;
  color: #374151;
}

.payment-content p {
  margin: 4px 0;
}

.payment-content strong {
  color: #1f2937;
}

.date {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
}
</style>
