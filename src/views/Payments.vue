<template>
  <div class="payments-view">
    <div class="header-row">
      <h2>💳 Transaction Ledger</h2>
      <div class="stats-mini">
        <div class="mini-card">Total Volume: <strong>$12,450</strong></div>
      </div>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Job Ref</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Platform Fee</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactions" :key="tx.id">
            <td><small>{{ tx.id }}</small></td>
            <td>#{{ tx.jobId }}</td>
            <td>{{ tx.customerName }}</td>
            <td><strong>${{ tx.amount }}</strong></td>
            <td class="text-orange">-${{ tx.commission }}</td>
            <td>{{ tx.paymentMethod }}</td>
            <td>
              <span :class="['badge', tx.status === 'succeeded' ? 'badge-active' : 'badge-danger']">
                {{ tx.status }}
              </span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '../api/adminService';

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
.text-orange { color: #e67e22; font-weight: bold; }
.mini-card { background: #ecf0f1; padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; }
.pagination-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.page-indicator { color: #4a5568; font-size: 0.85rem; }
</style>