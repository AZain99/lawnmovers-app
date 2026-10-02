<template>
  <div class="admin-container">
    <Sidebar :isCollapsed="isCollapsed" />
    <div class="main-content">
      <TopBar @toggle-sidebar="isCollapsed = !isCollapsed" />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import TopBar from '@/components/TopBar.vue';

const isCollapsed = ref(false);
</script>

<style>
.admin-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  background: #f4f7f6;
  min-height: 100vh;
  transition: 0.3s;
  overflow-x: hidden;
  overflow-y: auto;
}

.page-content {
  padding: 30px;
}

@media (max-width: 920px) {
  .admin-container {
    flex-direction: row;
  }

  .main-content {
    width: calc(100% - 72px);
    margin-left: 72px;
    min-height: 100vh;
  }

  .page-content {
    padding: 18px 14px 24px;
    padding-top: 18px;
  }
}
</style>