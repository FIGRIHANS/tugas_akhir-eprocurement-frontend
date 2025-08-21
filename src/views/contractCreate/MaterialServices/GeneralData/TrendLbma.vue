<template>
  <div class="modal" data-modal="true" id="trend_lbma_modal">
    <div class="modal-content max-w-[1200px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title">
          LBMA Rolling 30 Days Trend
        </h3>
        <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true">
          <i class="ki-filled ki-cross"></i>
        </button>
      </div>
      <div class="modal-body p-[24px]">
        <apexchart
          type="line"
          height="350"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useTenderStore } from '@/stores/views/tender/tender'

const tenderApi = useTenderStore()

const listGold = computed(() => tenderApi.listGold)

const series = ref([
  {
    data: listGold
  },
])
const chartOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: function (value, timestamp) {
        const date = new Date(timestamp)
        return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' })
      }
    }
  },
  yaxis: {
    opposite: true,
    labels: {
      formatter: (val: number) => `$${val.toFixed(2)}`
    }
  }
}

onMounted(() => {
  tenderApi.getGold()
})
</script>
