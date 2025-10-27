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
          <div class="bg-success h-2 rounded-sm" :style="getProgressStyle(dashboardData.totalVendorPKP || 0)"></div>
          <div class="bg-danger h-2 rounded-sm" :style="getProgressStyle(dashboardData.totalVendorNonPKP || 0)"></div>
          <div class="bg-info h-2 rounded-sm" :style="getProgressStyle(dashboardData.totalVendorPersonal || 0)"></div>
          <div class="bg-warning h-2 rounded-sm" :style="getProgressStyle(dashboardData.totalVendorForeign || 0)"></div>
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
import { computed, onMounted } from 'vue'
import { useVendorDashboardStore } from '@/stores/vendor/dashboard'

const dashboardStore = useVendorDashboardStore()
const dashboardData = dashboardStore.dashboardData

const getProgressStyle = (value: number) => {
  const total = dashboardData?.totalVendor || 0
  if (!total || total <= 0) return { width: '0%' }
  const pct = Math.round((value / total) * 100)
  return { width: `${pct}%` }
}

onMounted(() => {
  dashboardStore.fetchDashboard().catch(() => {})
})

const series = computed(() => [
  dashboardData.totalUnverified10D || 0,
  dashboardData.totalUnverified20D || 0,
  dashboardData.totalUnverified30D || 0,
  dashboardData.totalUnverified40D || 0,
  dashboardData.totalUnverified50D || 0,
])

const totalUnverified = computed(() =>
  (dashboardData.totalUnverified10D || 0) +
  (dashboardData.totalUnverified20D || 0) +
  (dashboardData.totalUnverified30D || 0) +
  (dashboardData.totalUnverified40D || 0) +
  (dashboardData.totalUnverified50D || 0)
)

const getPercentage = (value: number) => {
  if (!totalUnverified.value) return 0
  return Number(((value / totalUnverified.value) * 100).toFixed(1))
}

const chartOptions = {
  chart: {
    type: 'donut',
  },
  labels: ['≤ 10 days', '11-20 days', '21-30 days', '31-40 days', '41-50 days'],
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val.toFixed(1) + '%'
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => {
        const percentage = getPercentage(value)
        return `${value} vendor${value > 1 ? 's' : ''} (${percentage}%)`
      }
    }
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Unverified',
            formatter: () => totalUnverified.value.toString()
          },
          value: {
            formatter: (value: number) => {
              const percentage = getPercentage(value)
              return percentage + '%'
            }
          }
        }
      }
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        }
      },
    },
  ],
}
</script>
