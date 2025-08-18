<template>
  <div>
    <Breadcrumb title="Negotiation" :routes="routes" />
    <div class="border rounded-lg p-[24px]">
      <StepperStatusTender role="admin" activeName="Vendor Negotiation" />
    </div>
    <div class="border rounded-lg p-[24px] mt-[24px] font-medium">{{ getVendorName() }}</div>
    <div class="flex align-items-center gap-[24px] mt-[24px]">
      <GeneralData class="flex-1" />
      <TenderOrganization class="flex-1" />
      <DocumentAttachment class="flex-1" />
    </div>
    <div class="mt-[24px]">
      <TableNegotiation />
    </div>

    <div class="flex justify-end mt-[24px]">
      <UiButton @click="showAnalytic = true">
        Smart AI Analysis <i class="ki-duotone ki-artificial-intelligence"></i
      ></UiButton>
    </div>

    <div v-if="showAnalytic" class="border rounded-lg p-[24px] mt-5">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th>Data Analysis</th>
            <th>Terms Type</th>
            <th>Terms</th>
            <th>Kondisi/Rate</th>
            <th>UoM</th>
            <th>Remarks</th>
            <th>AI Analysis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6">
              <UiButton @click="isModalAnalytic = true"
                ><i class="ki-duotone ki-graph-up"></i
              ></UiButton>
            </td>
          </tr>
          <tr>
            <td>Commercial</td>
            <td>TOP</td>
            <td>90</td>
            <td>Days</td>
            <td></td>
            <td>Company Standard</td>
          </tr>
          <tr>
            <td>Commercial</td>
            <td>Contract Renewal Flat Rate</td>
            <td>3</td>
            <td>Years</td>
            <td>Fixed, tidak ada kenaikan dalam 3 tahun</td>
            <td>
              Highly demand dan secara trend penggunaan material 2 tahun terakhir terjadi kenaikan
              10% per Year sehingga lebih strategis jika apply Fixed Rate minimum 3 Years tanpa
              kenaikan
            </td>
          </tr>
          <tr>
            <td>Technical</td>
            <td>Delivery Time</td>
            <td>10</td>
            <td>Days</td>
            <td>Masuk ke dalam SLA</td>
            <td>
              Dalam 1 tahun trend OTIF dari Supplier di material yang sama average di 20 hari,
              recommend to apply penalty atas delay delivery 5%
            </td>
          </tr>
          <tr>
            <td>Technical</td>
            <td>Defect Rate</td>
            <td>5%</td>
            <td>%</td>
            <td>Masuk ke dalam SLA</td>
            <td>
              Dalam 1 tahun trend defect rate dari Supplier di material yang sama average di 10%,
              rekomendasi untuk Quality SLA atau masuk ke commercial Nego
            </td>
          </tr>
          <tr>
            <td>Commercial</td>
            <td>Item Analysis</td>
            <td>10</td>
            <td>EA</td>
            <td>Upgrade contract</td>
            <td>
              Ditemukan 5 item yang sudah ada contract sebelumnya dengan nilai yang jauh lebih
              rendah 20%, recommend untuk apply new contract > 20%
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <button class="btn btn-outline btn-primary" @click="backPage">
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary" @click="submitNego">
        Confirm and Send
        <i class="ki-filled ki-arrow-right"></i>
      </button>
    </div>
    <SuccessNegotiation @afterClose="backPage" />

    <UiModal
      v-if="isModalAnalytic"
      v-model="isModalAnalytic"
      title="Demand Analysis"
      size="xl"
      @update:model-value="handleCancel"
    >
      <div class="p-5">
        <table class="table text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th>Material</th>
              <th>Material Desc</th>
              <th>Demand Planning</th>
              <th>Yearly Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AURM4</td>
              <td>Aurum Product 4</td>
              <td class="demand-up">
                <span class="badge badge-success badge-outline fs-base">
                  <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"
                    ><span class="path1"></span><span class="path2"></span
                  ></i>
                  12%
                </span>
              </td>
              <td>
                <div id="chart">
                  <apexchart
                    type="line"
                    height="25"
                    width="100"
                    :options="chartOptionsUp"
                    :series="graph1"
                  ></apexchart>
                </div>
              </td>
            </tr>
            <tr>
              <td>AURM5</td>
              <td>Aurum Product 5</td>
              <td class="demand-up">
                <span class="badge badge-success badge-outline fs-base">
                  <i class="ki-duotone ki-arrow-up fs-5 text-success ms-n1"></i>
                  10%
                </span>
              </td>
              <td>
                <div id="chart">
                  <apexchart
                    type="line"
                    height="25"
                    width="100"
                    :options="chartOptionsUp"
                    :series="graph2"
                  ></apexchart>
                </div>
              </td>
            </tr>
            <tr>
              <td>AURM6</td>
              <td>Aurum Product 6</td>
              <td class="demand-down">
                <span class="badge badge-danger badge-outline fs-base">
                  <i class="ki-duotone ki-arrow-down fs-5 text-danger ms-n1"></i>
                  2%
                </span>
              </td>

              <td>
                <div id="chart">
                  <apexchart
                    type="line"
                    height="25"
                    width="100"
                    :options="chartOptionsDown"
                    :series="graph3"
                  ></apexchart>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GeneralData from './tenderNegotiation/GeneralData.vue'
import TenderOrganization from './tenderNegotiation/TenderOrganization.vue'
import DocumentAttachment from './tenderNegotiation/DocumentAttachment.vue'
import TableNegotiation from './tenderNegotiation/TableNegotiation.vue'
import SuccessNegotiation from './tenderNegotiation/SuccessNegotiation.vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import { KTModal } from '@/metronic/core'
import { useTenderStore } from '@/stores/views/tender/tender'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiModal from '@/components/modal/UiModal.vue'
import { useTenderEvoStore } from '@/stores/tender-evo/tenderNegotiation'

const tenderEvo = useTenderEvoStore()
const tenderApi = useTenderStore()
const router = useRouter()
const route = useRoute()
const showAnalytic = ref<boolean>(false)
const isModalAnalytic = ref<boolean>(false)

const routes = ref<routeTypes[]>([
  {
    name: 'Negotiation',
    to: '/tender/negotiation',
  },
])

const getVendorName = () => {
  const vendor = tenderEvo.dummyVendor.find((data) => data.id === route.query.id)

  return vendor.vendorName
}

const backPage = () => {
  router.push({
    name: 'tenderReportNegotiation',
    query: {
      id: tenderApi.negoId,
    },
  })
}

const submitNego = () => {
  const idModal = document.querySelector('#success_negotiation_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const graph1 = ref([
  {
    data: [0, 4, 6, 2, 5, 3, 1, 3, 9, 5, 10, 11, 25], // Ganti dengan data Anda
  },
])

const graph2 = ref([
  {
    data: [0, 4, 6, 2, 5, 3, 1, 3, 9, 14, 12, 34], // Ganti dengan data Anda
  },
])

const graph3 = ref([
  {
    data: [56, 34, 78, 23, 12, 43, 12, , 9, 7, 7, 5], // Ganti dengan data Anda
  },
])

// Opsi konfigurasi chart
const chartOptionsUp = ref({
  chart: {
    type: 'line',
    width: 100,
    height: 25,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'smooth',
    colors: ['#2ccc61'],
    width: 1,
  },
  tooltip: {
    enabled: false,
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: (seriesName: string) => '',
      },
    },
    marker: {
      show: false,
    },
  },
})

const chartOptionsDown = ref({
  chart: {
    type: 'line',
    width: 100,
    height: 25,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'smooth',
    colors: ['#d62926'],
    width: 1,
  },
  tooltip: {
    enabled: false,
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: (seriesName: string) => '',
      },
    },
    marker: {
      show: false,
    },
  },
})
</script>

<style lang="scss" scoped>
@use './styles/tenderNegotiation.scss';
</style>
