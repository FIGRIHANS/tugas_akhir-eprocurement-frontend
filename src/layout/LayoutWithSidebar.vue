<template>
  <LNavbar full />
  <LSidebar />

  <!-- Toggle button: outside the sidebar, fixed to the layout -->
  <button
    type="button"
    class="sidebar-toggle-btn"
    :style="{ insetInlineStart: sidebarStore.isCollapsed ? '0px' : '280px' }"
    :aria-label="sidebarStore.isCollapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'"
    :aria-pressed="sidebarStore.isCollapsed"
    @click="sidebarStore.toggleSidebar"
  >
    <i
      class="ki-filled"
      :class="sidebarStore.isCollapsed ? 'ki-right' : 'ki-left'"
    ></i>
  </button>

  <main
    class="py-4 px-6 transition-all duration-300 ease-in-out"
    :class="sidebarStore.isCollapsed ? 'ml-[32px]' : 'ml-[312px]'"
  >
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import LNavbar from '@/components/layout/navbar/LNavbar.vue'
import LSidebar from '@/components/layout/sidebar/LSidebar.vue'
import { useSidebarStore } from '@/stores/sidebar'

import { RouterView } from 'vue-router'

const sidebarStore = useSidebarStore()
</script>

<style>
.sidebar-toggle-btn {
  position: fixed;
  inset-block-start: 100px;
  inline-size: 32px;
  block-size: 52px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-inline-start: none;
  border-radius: 0 20px 20px 0;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: inset-inline-start 0.3s ease-in-out, background 0.15s;
  z-index: 200;
}

.sidebar-toggle-btn:hover {
  background: #f1f5f9;
}

.sidebar-toggle-btn i {
  color: #14B8A6;
  font-size: 13px;
}
</style>
