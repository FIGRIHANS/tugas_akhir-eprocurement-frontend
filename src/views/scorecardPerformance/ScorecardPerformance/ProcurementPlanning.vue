<template>
  <div class="card recent-orders large-card">
    <h4>Procurement Planning & Control</h4>

    <div class="product-tabs">
      <button
        v-for="product in productTabs"
        :key="product.name"
        :class="['tab', { active: activeTab === product.name }]"
        @click="activeTab = product.name"
      >
        <div class="tab-icon" :style="{ backgroundColor: product.color }">
          <component :is="product.icon" :size="16" color="white" />
        </div>
        {{ product.name }}
      </button>
    </div>

    <div class="orders-table">
      <div class="table-header">
        <span>ITEM</span>
        <span>QTY</span>
        <span>PRICE</span>
        <span>TOTAL PRICE</span>
      </div>

      <div
        v-for="order in recentOrders"
        :key="order.id"
        class="table-row"
      >
        <div class="item-info">
          <div class="item-icon" :style="{ backgroundColor: order.color }">
            <component :is="order.icon" :size="16" color="white" />
          </div>
          <div>
            <div class="item-name">{{ order.name }}</div>
            <div class="item-code">Item: {{ order.code }}</div>
          </div>
        </div>

        <span>x{{ order.qty }}</span>
        <span>$ {{ formatNumber(order.price) }}</span>
        <span>$ {{ formatNumber(order.total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type ProductTab, type RecentOrder } from '../types/ScorecardPerform'
import { Users, Building, MonitorSmartphone, CreditCard, Boxes } from 'lucide-vue-next'

// Props
defineProps<{
  recentOrders: RecentOrder[]
  formatNumber: (num: number) => string
}>()

// Reactive data
const activeTab = ref<string>('') // No default selected tab

const productTabs = ref<ProductTab[]>([
  { name: 'Human Cap. Management', icon: Users, color: '#3b82f6' },
  { name: 'Asset Management', icon: Building, color: '#8b5cf6' },
  { name: 'Information & Technology', icon: MonitorSmartphone, color: '#10b981' },
  { name: 'Finance', icon: CreditCard, color: '#f59e0b' },
  { name: 'Supply Chain Management', icon: Boxes, color: '#ef4444' }
])
</script>

<style lang="scss" scoped>
@import '../styles/ScorecardPerform.scss';
.product-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.product-tabs .tab {
  padding: 1px 4px;
  font-size: 0.52rem;
  border-radius: 4px;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s;
}
.product-tabs .tab.active {
  background: #e0e7ff;
  border-color: #3b82f6;
}
.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  width: 13px;
  height: 13px;
}
</style>
