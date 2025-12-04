<template>
  <div class="card product-orders">
    <div class="orders-header">
      <div>
        <h4>Procurement Transactions</h4>
        <p class="orders-subtitle">Avg. 57 order per day</p>
      </div>

      <div class="filters">
        <select class="filter-select">
          <option>Show All</option>
        </select>
        <select class="filter-select">
          <option>Show All</option>
        </select>
        <div class="search-container">
          <Search :size="16" class="search-icon" />
          <input type="text" placeholder="Search" class="search-input" />
        </div>
      </div>
    </div>

    <div class="orders-table">
      <div class="table-header">
        <span>ORDER ID</span>
        <span>CREATED</span>
        <span>VENDOR</span>
        <span>ORDER VALUE</span>
        <span>SAVINGS</span>
        <span>STATUS</span>
      </div>

      <div
        v-for="order in productOrders"
        :key="order.id"
        class="table-row"
      >
        <span class="order-id">{{ order.id }}</span>
        <span>{{ order.created }}</span>
        <span>{{ order.customer }}</span>
        <span>$ {{ formatNumber(order.total) }}</span>
        <span>$ {{ formatNumber(order.profit) }}</span>
        <span class="status" :class="order.status.toLowerCase()">
          <component
            :is="getStatusIcon(order.status)"
            :size="12"
            class="status-icon"
          />
          {{ order.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProductOrder } from '../types/ScorecardPerform'
import { Search, Clock, CheckCircle, Truck } from 'lucide-vue-next'

defineProps<{
  productOrders: ProductOrder[]
  formatNumber: (num: number) => string
}>()

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return Clock
    case 'confirmed':
      return CheckCircle
    case 'shipped':
      return Truck
    default:
      return Clock
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/ScorecardPerform.scss';
</style>
