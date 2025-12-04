<template>
  <div class="dashboard">
    <!-- Breadcrumb -->
    <BreadcrumbView
      :routes="[
        { name: 'Supply Chain Analytic', to: '#' },
        { name: 'Scorecard Performance', to: '#' },
      ]"
      title="Scorecard Performance"
    />

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Spend Analysis vs Contracted Item -->
      <div class="card small-card">
        <div class="card-header">
          <h3 class="text-left">$ {{ formatNumber(69700) }}</h3>
          <span class="percentage positive">+2.2%</span>
        </div>
        <p class="card-subtitle">Spend Analysis vs Contracted Item</p>
        <div class="earnings-breakdown">
          <div class="breakdown-left">
            <div class="circular-progress">
              <DualSegmentProgress :size="65" />
            </div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-item">
              <div class="breakdown-indicator short-term-contract"></div>
              <div class="breakdown-text">
                <span>Short Term Contract</span>
                <span class="amount">$ {{ formatNumber(38335) }}</span>
              </div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-indicator gaming"></div>
              <div class="breakdown-text">
                <span>Long Term Contract</span>
                <span class="amount">$ {{ formatNumber(17425) }}</span>
              </div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-indicator others"></div>
              <div class="breakdown-text">
                <span>Not Contracted</span>
                <span class="amount">$ {{ formatNumber(13940) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spend Analysis by Department -->
      <div class="card small-card">
        <div class="card-header">
          <h3 class="text-left">$ {{ formatNumber(2420) }}</h3>
          <span class="percentage positive">+2.6%</span>
        </div>
        <p class="card-subtitle">Spend Analysis by Department</p>
        <div class="chart-container">
          <div class="bar-chart">
            <div
              v-for="(value, index) in dailySalesData"
              :key="index"
              class="bar"
              :style="{ blockSize: value + '%' }"
            >
              <span class="bar-label">{{ departmentLabels[index] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery On Time -->
      <div class="card small-card">
        <div class="card-header">
          <h3 class="text-left">{{ formatNumber(1836) }}</h3>
          <span class="percentage negative">-0.47%</span>
        </div>
        <p class="card-subtitle">Delivery On Time</p>
        <div class="progress-container">
          <div class="progress-info">
            <span>{{ formatNumber(1048) }} to Goal</span>
            <span class="progress-percent">62%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="inline-size: 62%"></div>
          </div>
        </div>
      </div>

      <!-- New Customers -->
      <div class="card small-card">
        <div class="card-header">
          <h3 class="text-left">{{ formatNumber(6300) }}</h3>
        </div>
        <p class="card-subtitle">New Customers This Month</p>
        <div class="heroes-section">
          <p class="heroes-title">Today's Heroes</p>
          <div class="heroes-avatars">
            <div
              v-for="hero in todaysHeroes"
              :key="hero.id"
              class="hero-avatar"
              :style="{ backgroundColor: hero.color }"
            >
              {{ hero.initial }}
            </div>
            <div class="hero-avatar more">+12</div>
          </div>
        </div>
      </div>

      <!-- Tender Negotiation Saving -->
      <TenderNegotiation :format-number="formatNumber" />

      <!-- Discounted Product Sales -->
      <DiscountedProductSales :format-number="formatNumber" />

      <!-- Recent Orders -->
      <RecentOrders :recent-orders="recentOrders" :format-number="formatNumber" />

      <!-- Invoice Manager -->
      <div class="card invoice-card">
        <div class="invoice-header">
          <h4 class="invoice-title">Have you tried</h4>
          <h3 class="invoice-subtitle">new <strong>Invoice Manager</strong>?</h3>
        </div>
        <div class="invoice-illustration">
          <div class="py-8 text-center illustration-bg">
            <InvoiceManagerPict
              class="w-200px"
              style="inline-size: 200px; block-size: auto; display: block; margin: 0 auto"
            />
          </div>
        </div>
        <div class="invoice-actions">
          <button class="btn-primary">Try Now</button>
          <button class="btn-secondary">Learn More</button>
        </div>
      </div>

      <!-- Product Orders -->
      <ProductOrders :product-orders="productOrders" :format-number="formatNumber" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import DualSegmentProgress from '../../components/scorecard/DualSegmentProgress.vue'
import InvoiceManagerPict from './ScorecardPerformance/InvoiceManagerPict.vue'
import TenderNegotiation from './ScorecardPerformance/TenderNegotiation.vue'
import DiscountedProductSales from './ScorecardPerformance/ContractSavings.vue'
import RecentOrders from './ScorecardPerformance/ProcurementPlanning.vue'
import ProductOrders from './ScorecardPerformance/ProcurementTransactions.vue'
import type { Hero, RecentOrder, ProductOrder } from './types/ScorecardPerform'
import { PackagePlus, Briefcase, MonitorSmartphone } from 'lucide-vue-next'

// Sample data
const dailySalesData = ref<number[]>([60, 80, 75, 70, 85, 90, 75])
const departmentLabels = ref<string[]>(['HCM', 'MM', 'IT', 'FI', 'SCM', 'GS', 'AM', 'OPR'])

// Sample heroes for today's heroes section
const todaysHeroes = ref<Hero[]>([
  { id: 1, initial: 'A', color: '#fbbf24' },
  { id: 2, initial: 'B', color: '#f87171' },
  { id: 3, initial: 'C', color: '#60a5fa' },
  { id: 4, initial: 'D', color: '#34d399' },
  { id: 5, initial: 'E', color: '#a78bfa' },
  { id: 6, initial: 'F', color: '#f472b6' },
  { id: 7, initial: 'G', color: '#6b7280' },
])

// RECENT ORDERS DATA
const recentOrders = ref<RecentOrder[]>([
  {
    id: '1',
    name: 'Steel Coil A-102',
    code: '#YOG-2347',
    qty: 1,
    price: 72000,
    total: 72000,
    color: '#3b82f6',
    icon: PackagePlus,
  },
  {
    id: '2',
    name: 'Office Chairs Batch',
    code: '#YOG-2347',
    qty: 1,
    price: 45000,
    total: 45000,
    color: '#8b5cf6',
    icon: Briefcase,
  },
  {
    id: '3',
    name: 'Server Rack Units',
    code: '#YOG-2347',
    qty: 2,
    price: 84000,
    total: 168000,
    color: '#10b981',
    icon: MonitorSmartphone,
  },
])

// PRODUCT ORDERS DATA
const productOrders = ref<ProductOrder[]>([
  {
    id: 'U56BVRGB',
    created: '7 min ago',
    customer: 'Albert Flores',
    total: 630000,
    profit: 88700,
    status: 'Pending',
  },
  {
    id: 'Y78HU03S',
    created: '52 min ago',
    customer: 'Jenny Wilson',
    total: 25000,
    profit: 4200,
    status: 'Confirmed',
  },
  {
    id: 'SR9NS5Q7',
    created: '1 hour ago',
    customer: 'Robert Fox',
    total: 1630000,
    profit: 203900,
    status: 'Pending',
  },
  {
    id: 'PX9HM2L1',
    created: '3 hour ago',
    customer: 'Cody Fisher',
    total: 119000,
    profit: 12000,
    status: 'Shipped',
  },
  {
    id: 'XG0J15MA',
    created: '2 day ago',
    customer: 'Arlene McCoy',
    total: 660000,
    profit: 58260,
    status: 'Shipped',
  },
])

// Methods
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}
</script>

<style lang="scss" scoped>
@import './styles/ScorecardPerform.scss';
</style>
