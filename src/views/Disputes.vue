<template>
  <div class="disputes-view">
    <div class="header-row">
      <h2>⚖️ Job Disputes</h2>
      <select v-model="filterStatus" class="status-select">
        <option value="open">Open Disputes</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>

    <div class="card" v-for="dispute in filteredDisputes" :key="dispute.id">
      <div class="dispute-header">
        <span class="job-ref">Job Ref: #{{ dispute.jobId }}</span>
        <span :class="['badge', dispute.status === 'open' ? 'badge-danger' : 'badge-active']">
          {{ dispute.status }}
        </span>
      </div>
      
      <div class="dispute-body">
        <div class="info-block">
          <strong>Reason:</strong> {{ dispute.reason }}
        </div>
        <div class="info-block">
          <strong>Description:</strong> 
          <p>{{ dispute.description }}</p>
        </div>
        <div class="participants">
          <span><strong>Raised By:</strong> {{ dispute.raisedBy }}</span>
        </div>
      </div>

      <div class="dispute-actions" v-if="dispute.status === 'open'">
        <textarea v-model="resolutionNotes[dispute.id]" placeholder="Enter resolution notes..."></textarea>
        <div class="btn-group">
          <button class="btn btn-primary" @click="resolve(dispute.id)">Mark as Resolved</button>
          <button class="btn btn-outline" @click="contactUser(dispute.raisedBy)">Contact User</button>
        </div>
      </div>
      
      <div class="resolution-view" v-else>
        <strong>Resolution:</strong>
        <p>{{ dispute.resolution }}</p>
        <small>Resolved At: {{ new Date(dispute.resolvedAt).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import adminApi from '../api/adminService';
// import adminApi from '../api/mockService';

const disputes = ref([]);
const filterStatus = ref('open');
const resolutionNotes = ref({});

const fetchDisputes = async () => {
  const { data } = await adminApi.get('/disputes');
  disputes.value = data;
};

const filteredDisputes = computed(() => {
  return disputes.value.filter(d => d.status === filterStatus.value);
});

const resolve = async (id) => {
  const note = resolutionNotes.value[id];
  if (!note) return alert("Please enter resolution details");
  
  await adminApi.patch(`/disputes/${id}/resolve`, { resolution: note });
  alert("Dispute resolved successfully");
  fetchDisputes();
};

onMounted(fetchDisputes);
</script>

<style scoped>
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.dispute-header { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.job-ref { font-family: monospace; font-weight: bold; color: var(--dark-navy); }
.dispute-body { margin-bottom: 20px; line-height: 1.6; }
.info-block { margin-bottom: 10px; }
.dispute-actions textarea { width: 100%; height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; resize: none; }
.btn-group { display: flex; gap: 10px; }
.resolution-view { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-green); }
</style>