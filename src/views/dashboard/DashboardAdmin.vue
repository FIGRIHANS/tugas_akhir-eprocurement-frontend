<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card">
      <div class="card-header px-4">
        <h3 class="font-semibold text-base">Outstanding Vendor Verification</h3>
      </div>
      <div class="card-body">
        <apexchart type="donut" :options="chartOptions" :series="series" />
      </div>
    </div>
    <div class="card">
      <div class="card-header px-4">
        <h3 class="font-semibold text-base">Vendor Registration</h3>
      </div>
      <div class="card-body">
        <div class="text-gray-600 text-sm">Total Vendor Registration</div>
        <div class="text-3xl font-semibold">{{ dashboardData.totalVendor || 0 }}</div>

        <ul class="mt-4 space-y-5">
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">Verified</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-success h-4">
                <div class="progress-bar" :style="getProgressStyle(dashboardData.totalVerified || 0)"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">{{ dashboardData.totalVerified || 0 }}</span>
            </div>
          </li>
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">On Progress Verification</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-warning h-4">
                <div class="progress-bar" :style="getProgressStyle(dashboardData.totalOnProgressVerification || 0)"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">{{ dashboardData.totalOnProgressVerification || 0 }}</span>
            </div>
          </li>
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">Rejected</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-danger h-4">
                <div class="progress-bar" :style="getProgressStyle(dashboardData.totalRejected || 0)"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">{{ dashboardData.totalRejected || 0 }}</span>
            </div>
          </li>
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">Blacklist</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-dark h-4">
                <div class="progress-bar bg-indigo-950" :style="getProgressStyle(dashboardData.totalBlacklistVendor || 0)"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">{{ dashboardData.totalBlacklistVendor || 0 }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="card h-full">
      <div class="card-header px-4">
        <h3 class="card-title">Vendor Category</h3>
      </div>
      <div class="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-medium text-gray-500"> Total Vendor </span>
          <div class="flex items-center gap-2.5">
            <span class="text-3xl font-semibold text-gray-900">{{ dashboardData.totalVendor || 0 }}</span>
          </div>
        </div>
        <div class="flex items-center gap-1 mb-1.5">
          <div class="bg-success h-2 rounded-sm relative group cursor-pointer" :style="getProgressStyle(dashboardData.totalVendorPKP || 0)">
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-success text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              PKP: {{ dashboardData.totalVendorPKP || 0 }} vendor{{ (dashboardData.totalVendorPKP || 0) > 1 ? 's' : '' }} ({{ getPercentage(dashboardData.totalVendorPKP || 0) }}%)
            </div>
          </div>
          <div class="bg-danger h-2 rounded-sm relative group cursor-pointer" :style="getProgressStyle(dashboardData.totalVendorNonPKP || 0)">
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-danger text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              Non-PKP: {{ dashboardData.totalVendorNonPKP || 0 }} vendor{{ (dashboardData.totalVendorNonPKP || 0) > 1 ? 's' : '' }} ({{ getPercentage(dashboardData.totalVendorNonPKP || 0) }}%)
            </div>
          </div>
          <div class="bg-info h-2 rounded-sm relative group cursor-pointer" :style="getProgressStyle(dashboardData.totalVendorPersonal || 0)">
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-info text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              Personal: {{ dashboardData.totalVendorPersonal || 0 }} vendor{{ (dashboardData.totalVendorPersonal || 0) > 1 ? 's' : '' }} ({{ getPercentage(dashboardData.totalVendorPersonal || 0) }}%)
            </div>
          </div>
          <div class="bg-warning h-2 rounded-sm relative group cursor-pointer" :style="getProgressStyle(dashboardData.totalVendorForeign || 0)">
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-warning text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              Foreign: {{ dashboardData.totalVendorForeign || 0 }} vendor{{ (dashboardData.totalVendorForeign || 0) > 1 ? 's' : '' }} ({{ getPercentage(dashboardData.totalVendorForeign || 0) }}%)
            </div>
          </div>
        </div>
        <div class="flex items-center flex-wrap gap-4 mb-1">
          <div class="flex items-center gap-1.5">
            <span class="badge badge-dot size-2 badge-success"> </span>
            <span class="text-sm text-gray-600 font-medium"> PKP </span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="badge badge-dot size-2 badge-danger"> </span>
            <span class="text-sm text-gray-600 font-medium"> Non-PKP </span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="badge badge-dot size-2 badge-info"> </span>
            <span class="text-sm font-medium text-gray-600"> Personal </span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="badge badge-dot size-2 badge-warning"> </span>
            <span class="text-sm font-medium text-gray-600"> Foreign </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useVendorDashboardStore } from '@/stores/vendor/dashboard'

const dashboardStore = useVendorDashboardStore()
const dashboardData = computed(() => dashboardStore.dashboardData)

const getProgressStyle = (value: number) => {
  const total = dashboardData.value?.totalVendor || 0
  if (!total || total <= 0) return { width: '0%' }
  const pct = Math.round((value / total) * 100)
  return { width: `${pct}%` }
}

const getPercentage = (value: number) => {
  const total = dashboardData.value?.totalVendor || 0
  if (!total || total <= 0) return 0
  return Math.round((value / total) * 100)
}

onMounted(() => {
  dashboardStore.fetchDashboard().catch(() => {})
})

const series = ref([44, 55, 41, 17, 15])

const chartOptions = {
  chart: {
    type: 'donut',
  },
  labels: ['10 days', '20 days', '30 days', '40 days', '50 days'],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}
</script>
