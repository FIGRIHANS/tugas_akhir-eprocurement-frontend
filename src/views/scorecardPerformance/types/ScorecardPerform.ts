// types.ts
import type { Component } from 'vue'

// Type for Lucide Vue icon components
export type LucideIcon = Component

export interface Hero {
  id: number
  initial: string
  color: string
}

export interface ProductTab {
  name: string
  icon: LucideIcon // Vue component from lucide-vue-next
  color: string
}

export interface RecentOrder {
  id: string
  name: string
  code: string
  qty: number
  price: number
  total: number
  color: string
  icon: LucideIcon // Vue component from lucide-vue-next
}

export interface ProductOrder {
  id: string
  created: string
  customer: string
  total: number
  profit: number
  status: string
}

// Added from ScorecardPerformance.vue
export interface Tooltip {
  show: boolean
  x: number
  y: number
  date: string
  value: string
}

// Updated to match ScorecardPerformance.vue
export interface ChartDataPoint {
  x: number
  y: number
  label: string
  value: string
}

export interface DashboardStats {
  expectedEarnings: number
  averageDailySales: number
  salesThisMonth: number
  ordersThisMonth: number
  newCustomers: number
  discountedSales: number
}

export interface BreakdownItem {
  category: string
  amount: number
  color: string
  percentage?: number
}

export interface FilterOption {
  label: string
  value: string | number
}

export interface StatusConfig {
  label: string
  color: string
  backgroundColor: string
  icon: LucideIcon // Vue component from lucide-vue-next
}

export interface ProgressData {
  current: number
  target: number
  percentage: number
}

// Enum untuk status
export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

// Type untuk chart data
export type ChartData = ChartDataPoint[]

// Type untuk filter functions
export type FilterFunction<T> = (item: T, query: string) => boolean

// Interface untuk API responses
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Dashboard API interfaces
export interface DashboardApiData {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  productOrders: ProductOrder[]
  salesData: ChartData
  topCustomers: Hero[]
}

export interface OrdersApiParams {
  page?: number
  limit?: number
  status?: OrderStatus
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Event types
export interface DashboardEvents {
  'order-updated': ProductOrder
  'filter-changed': OrdersApiParams
  'tab-changed': string
  'refresh-data': void
}
