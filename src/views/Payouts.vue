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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import adminApi from '../api/adminService';
import adminApi from '../api/mockService';

const withdrawals = ref([]);

const fetchWithdrawals = async () => {
  const { data } = await adminApi.get('/withdrawals/admin/all');
  withdrawals.value = data;
};

const process = async (id, status) => {
  const adminNote = prompt("Enter a note for this decision:");
  await adminApi.patch(`/withdrawals/${id}/status`, { status, adminNote });
  fetchWithdrawals();
};

onMounted(fetchWithdrawals);
</script>