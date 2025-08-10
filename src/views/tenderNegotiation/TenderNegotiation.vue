<template>
  <div>
    <Breadcrumb title="Negotiation" :routes="routes" />
    <div class="border rounded-lg p-[24px]">
      <StepperStatusTender role="admin" activeName="Vendor Negotiation" />
    </div>
    <div class="border rounded-lg p-[24px] mt-[24px] font-medium">PT Walldorf Grosshandel Tbk</div>
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
        Smart Analysis <i class="ki-duotone ki-artificial-intelligence"></i
      ></UiButton>
    </div>

    <div v-if="showAnalytic" class="border rounded-lg p-[24px] mt-5">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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

const tenderApi = useTenderStore()
const router = useRouter()
const showAnalytic = ref<boolean>(false)

const routes = ref<routeTypes[]>([
  {
    name: 'Negotiation',
    to: '/tender/negotiation',
  },
])

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
</script>

<style lang="scss" scoped>
@use './styles/tenderNegotiation.scss';
</style>
