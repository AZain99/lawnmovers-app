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

    <div class="pagination-row" v-if="!isLoading">
      <button class="btn btn-outline btn-sm" :disabled="pageNumber === 1" @click="prevPage">Previous</button>
      <span class="page-indicator">Page {{ pageNumber }}</span>
      <button class="btn btn-primary btn-sm" :disabled="!hasMore" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { where } from 'firebase/firestore';
import adminApi from '../api/adminService';

const disputes = ref([]);
const filterStatus = ref('open');
const resolutionNotes = ref({});
const pageNumber = ref(1);
const pageSize = ref(20);
const hasMore = ref(false);
const lastVisible = ref(null);
const isLoading = ref(false);

const fetchDisputes = async (resetPage = false) => {
  if (resetPage) {
    pageNumber.value = 1;
    lastVisible.value = null;
  }

  isLoading.value = true;
  const { data, hasMore: more, lastVisible: nextLastVisible } = await adminApi.list('disputes', {
    pageSize: pageSize.value,
    orderField: 'createdAt',
    orderDirection: 'desc',
    lastVisible: lastVisible.value,
    filters: [where('status', '==', filterStatus.value)]
  });

  disputes.value = data;
  hasMore.value = more;
  lastVisible.value = nextLastVisible;
  isLoading.value = false;
};

const nextPage = async () => {
  if (!hasMore.value) return;
  pageNumber.value += 1;
  await fetchDisputes();
};

const prevPage = async () => {
  if (pageNumber.value <= 1) return;
  pageNumber.value -= 1;
  if (pageNumber.value === 1) {
    await fetchDisputes(true);
  } else {
    await fetchDisputes();
  }
};

const filteredDisputes = computed(() => {
  return disputes.value.filter(d => d.status === filterStatus.value);
});

const resolve = async (id) => {
  const note = resolutionNotes.value[id];
  if (!note) return alert('Please enter resolution details');

  await adminApi.patch(`/disputes/${id}/resolve`, { resolution: note });
  alert('Dispute resolved successfully');
  await fetchDisputes(true);
};

const contactUser = (raisedBy) => {
  alert(`Contact user: ${raisedBy}`);
};

watch(filterStatus, () => {
  fetchDisputes(true);
});

onMounted(() => fetchDisputes(true));
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
.pagination-row {
  display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 16px;
}
.page-indicator { color: #4a5568; font-size: 0.85rem; }
</style>