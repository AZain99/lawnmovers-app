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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '../api/adminService';
// import adminApi from '../api/mockService';

const transactions = ref([
  // Mock Data for design
  { id: 'TX_9901', jobId: 'JOB101', customerName: 'John Doe', amount: 50, commission: 7.5, paymentMethod: 'Stripe/Card', status: 'succeeded' },
  { id: 'TX_9902', jobId: 'JOB104', customerName: 'Sarah Smith', amount: 120, commission: 18, paymentMethod: 'Apple Pay', status: 'succeeded' }
]);

onMounted(async () => {
  const res = await adminApi.get('/payments/all');
  if (res.data.length > 0) transactions.value = res.data;
});
</script>

<style scoped>
.text-orange { color: #e67e22; font-weight: bold; }
.mini-card { background: #ecf0f1; padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; }
</style>