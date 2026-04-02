<template>
  <div class="settings-view">
    <h2>Platform Configuration</h2>
    <div class="card" style="max-width: 600px;">
      <form @submit.prevent="saveSettings">
        <div class="form-group">
          <label>Commission Percentage (%)</label>
          <input type="number" v-model="settings.commissionPercentage" class="form-input" />
        </div>
        <div class="form-group">
          <label>Tax Percentage (%)</label>
          <input type="number" v-model="settings.taxPercentage" class="form-input" />
        </div>
        <div class="form-group">
          <label>Service Pricing (Base Rules)</label>
          <div v-for="(price, type) in settings.pricingRules" :key="type" class="pricing-row">
            <span>{{ type }}:</span>
            <input type="number" v-model="settings.pricingRules[type]" />
          </div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Save All Settings</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '../api/adminService';
// import adminApi from '../api/mockService';

const settings = ref({
  commissionPercentage: 0,
  taxPercentage: 0,
  pricingRules: {}
});

onMounted(async () => {
  const { data } = await adminApi.get('/settings');
  settings.value = data;
});

const saveSettings = async () => {
  await adminApi.post('/settings/update', settings.value);
  alert("Platform rules updated successfully!");
};
</script>

<style scoped>
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
.form-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
.pricing-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
</style>