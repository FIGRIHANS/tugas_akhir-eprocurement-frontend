<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card">
      <div class="card-header px-4">
        <h3 class="font-semibold text-base">Outstanding Vendor Verification</h3>
        <UIbutton variant="primary" :outline="true" size="sm">Detail</UIbutton>
      </div>
      <div class="card-body">
        <apexchart type="donut" :options="chartOptions" :series="series" />
      </div>
    </div>
    <div class="card">
      <div class="card-header px-4">
        <h3 class="font-semibold text-base">Vendor Registration</h3>
        <UIbutton variant="primary" :outline="true" size="sm">Detail</UIbutton>
      </div>
      <div class="card-body">
        <div class="text-gray-600 text-sm">Total Vendor Registration</div>
        <div class="text-3xl font-semibold">1425</div>

        <ul class="mt-4 space-y-5">
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">Verified</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-success h-4">
                <div class="progress-bar w-1/2"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">50</span>
            </div>
          </li>
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">On Progress Verification</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-warning h-4">
                <div class="progress-bar w-1/2"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">50</span>
            </div>
          </li>
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">Not Active</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-danger h-4">
                <div class="progress-bar w-1/2"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">50</span>
            </div>
          </li>
          <li class="space-y-1">
            <div class="text-gray-500 text-sm font-medium">Blacklist</div>
            <div class="flex items-center gap-3">
              <div class="progress progress-dark h-4">
                <div class="progress-bar bg-indigo-950 w-1/2"></div>
              </div>
              <span class="text-sm font-medium text-gray-500">50</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="card h-full">
      <div class="card-header px-4">
        <h3 class="card-title">Vendor Category</h3>
        <UIbutton variant="primary" :outline="true" size="sm">Detail</UIbutton>
      </div>
      <div class="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-medium text-gray-500"> Total Vendor </span>
          <div class="flex items-center gap-2.5">
            <span class="text-3xl font-semibold text-gray-900"> 125 </span>
            <span class="badge badge-outline badge-success badge-sm"> +2.7% </span>
          </div>
        </div>
        <div class="flex items-center gap-1 mb-1.5">
          <div class="bg-success h-2 w-full max-w-[60%] rounded-sm"></div>
          <div class="bg-brand h-2 w-full max-w-[25%] rounded-sm"></div>
          <div class="bg-info h-2 w-full max-w-[15%] rounded-sm"></div>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import UIbutton from '@/components/ui/atoms/button/UiButton.vue'

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
