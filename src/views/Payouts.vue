<template>
  <div class="payouts-view">
    <h2>Withdrawal Requests</h2>
    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Provider ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in withdrawals" :key="req.id">
            <td>{{ req.providerId }}</td>
            <td><strong>${{ req.amount }}</strong></td>
            <td>{{ req.method }}</td>
            <td><span :class="['badge', `badge-${req.status}`]">{{ req.status }}</span></td>
            <td>{{ new Date(req.requestedAt).toLocaleDateString() }}</td>
            <td v-if="req.status === 'pending'">
              <button class="btn btn-primary" @click="process(req.id, 'approved')">Approve</button>
              <button class="btn btn-danger" @click="process(req.id, 'rejected')">Reject</button>
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
.pagination-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.page-indicator { color: #4a5568; font-size: 0.85rem; }
</style>