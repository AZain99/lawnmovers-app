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
.admin-container { display: flex; }
.main-content { flex: 1; background: #f4f7f6; min-height: 100vh; transition: 0.3s; }
.page-content { padding: 30px; }
</style>