<template>
  <div>
    <BreadcrumbView title="Vendor Tender Submission" :routes="routes" />

    <div class="grid grid-cols-3 gap-x-4 gap-y-6">
      <div class="card col-span-3 p-6">
        <StepperStatusGlobal :list-step="listStep" :active-step="0" />
      </div>

      <GeneralDataCard />
      <TenderOrganizationCard />
      <DocAttachmentCard />

      <div class="card col-span-3 p-6 flex-col gap-6">
        <div class="flex flex-row items-center justify-between">
          <UiInputSearch placeholder="Search" v-model="search" />

          <div class="flex flex-row items-center gap-4">
            <UiButton outline>
              <UiIcon name="document" variant="duotone" /> Upload Prices
            </UiButton>
            <UiButton @click="updatePrice">
              <UiIcon name="dollar" variant="duotone" /> Update Prices
            </UiButton>
          </div>
        </div>

        <div class="card-table scrollable-x-auto">
          <table class="table align-middle">
            <thead>
              <tr>
                <th
                  v-for="head in tableHeads"
                  :key="head"
                  :class="head === '' ? '' : 'min-w-[150px]'"
                >
                  {{ head }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="data of dataResponse" :key="data.tenderRequestNumber">
                <td>
                  <input v-model="data.isSelected" class="checkbox" type="checkbox" />
                </td>
                <td>{{ data.tenderRequestNumber }}</td>
                <td>{{ data.type }}</td>
                <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
                <td>{{ data.plant }}</td>
                <td>{{ data.materialGroup }}</td>
                <td>{{ data.itemNo }}</td>
                <td>
                  {{ useFormatIdr(data.tenderPrice) }}
                </td>
                <td>{{ data.material }}</td>
                <td>{{ data.materialDescription }}</td>
                <td>{{ data.quantity }}</td>
                <td>{{ data.buttonPrice }}</td>
                <td>{{ data.uom }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card col-span-3 p-6 gap-6">
        <span class="font-bold">Do you want to join the tender?</span>
        <RadioCustom
          v-model="verification.join"
          name="join"
          :options="radioOptions"
          inline
          size="lg"
          class="w-1/12"
        />
        <UiCheckbox
          v-model="verification.tnc"
          label="Read and agree to the tender terms and conditions - e Procurement"
        />
      </div>

      <UiButton variant="primary" class="col-start-3 justify-self-end w-fit" @click="submit"
        >Submit <UiIcon name="arrow-right" variant="duotone"
      /></UiButton>
    </div>
  </div>

  <Teleport to="body">
    <div
      ref="modal"
      class="modal"
      data-modal="true"
      data-modal-backdrop-static="true"
      id="modal-vendor-tender-submit"
    >
      <div class="modal-content modal-center-y max-w-4xl">
        <div class="modal-body flex flex-col gap-4">
          <div class="scrollable-x-auto">
            <table v-if="priceUpdateTemp.length > 0" class="table align-middle">
              <thead>
                <tr>
                  <th
                    v-for="head in tableHeads.filter((item) => item !== '')"
                    :key="head"
                    class="min-w-[150px]"
                  >
                    {{ head }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(data, index) of dataResponse.filter((item) => item.isSelected)"
                  :key="data.tenderRequestNumber"
                >
                  <td>{{ data.tenderRequestNumber }}</td>
                  <td>{{ data.type }}</td>
                  <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
                  <td>{{ data.plant }}</td>
                  <td>{{ data.materialGroup }}</td>
                  <td>{{ data.itemNo }}</td>
                  <td>
                    <UiInput
                      v-model="priceUpdateTemp[index].price"
                      :placeholder="String(data.tenderPrice)"
                      type="number"
                    />
                  </td>
                  <td>{{ data.material }}</td>
                  <td>{{ data.materialDescription }}</td>
                  <td>{{ data.quantity }}</td>
                  <td>{{ data.buttonPrice }}</td>
                  <td>{{ data.uom }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-row justify-end items-center gap-4 w-full">
            <UiButton
              variant="primary"
              @click="clearPriceUpdateTemp"
              outline
              data-modal-dismiss="true"
            >
              <UiIcon name="black-left" variant="filled" />
              Cancel
            </UiButton>
            <UiButton variant="primary" @click="savePriceUpdateTemp">
              <UiIcon name="file-added" variant="duotone" />
              Save
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <ModalConfirmation
    :open="modalSuccess"
    id="equipment-success"
    type="success"
    title="Equipment Data Successfully Updated"
    text="The data has been successfully updated in the admin system."
    no-cancel
    static
    submit-button-text="Ok"
    :submit="() => (modalSuccess = false)"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
import { KTModal } from '@/metronic/core'

import { useFormatIdr, useFormatUsd } from '@/composables/currency'

import type { routeTypes } from '@/core/type/components/breadcrumb'

import BreadcrumbView from '@/components/BreadcrumbView.vue'
import StepperStatusGlobal from '@/components/stepperStatusGlobal/StepperStatusGlobal.vue'
import RadioCustom from '@/components/ui/atoms/radio/RadioCustom.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

import GeneralDataCard from './TenderSubmissionDetail/GeneralDataCard.vue'
import TenderOrganizationCard from './TenderSubmissionDetail/TenderOrganizationCard.vue'
import DocAttachmentCard from './TenderSubmissionDetail/DocAttachmentCard.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'

const route = useRoute()
const modal = ref()
const modalForm = computed(() => KTModal.getInstance(modal.value))
const modalSuccess = ref<boolean>(false)
const routes = ref<routeTypes[]>([
  {
    name: 'Vendor Tender Submission',
    to: `/vendor-tender/submission/${route.params.id}`,
  },
])

const search = ref<string>('')
const verification = ref({
  join: null,
  tnc: false,
})
const priceUpdateTemp = ref<{ price: number; isSelected: boolean }[]>([])

const radioOptions = [
  { text: 'Yes', value: 'Y' },
  { text: 'No', value: 'N' },
]
const tableHeads = ref<string[]>([
  '',
  'Tender Request Number',
  'Type',
  'Delivery Date',
  'Plant',
  'Material Group',
  'Item No',
  'Tender Price',
  'Material',
  'Material Desc',
  'Quantity',
  'Button Price',
  'UOM',
])

const listStep = ref([
  {
    icon: 'paper-plane',
    name: 'Vendor Submission',
    date: '24 Okt 2024',
  },
  {
    icon: 'book-open',
    name: 'Vendor Negotiation',
    date: '25 Okt 2024',
  },
  {
    icon: 'shield-search',
    name: 'Vendor Evaluation',
    date: '26 Okt 2024',
  },
  {
    icon: 'ranking',
    name: 'Vendor Awarding',
    date: '27 Okt 2024',
  },
])

const dataResponse = ref([
  {
    tenderRequestNumber: '10012525',
    type: 'R',
    deliveryDate: '2025-06-14',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    tenderPrice: 10000,
    material: 'CH-1062',
    materialDescription: 'Macro Feltilizer Urea',
    quantity: '1000',
    buttonPrice: '97000',
    uom: 'KG',
    isSelected: false,
  },
  {
    tenderRequestNumber: '2763746',
    type: 'R',
    deliveryDate: '2025-06-14',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    tenderPrice: 10000,
    material: 'CH-1062',
    materialDescription: 'Material 123445',
    quantity: '1000',
    buttonPrice: '97000',
    uom: 'KG',
    isSelected: false,
  },
  {
    tenderRequestNumber: '9384756',
    type: 'R',
    deliveryDate: '2025-06-14',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    tenderPrice: 10000,
    material: 'CH-1062',
    materialDescription: 'Mate SA 2736',
    quantity: '1000',
    buttonPrice: '97000',
    uom: 'KG',
    isSelected: false,
  },
  {
    tenderRequestNumber: '0192834',
    type: 'R',
    deliveryDate: '2025-06-14',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    tenderPrice: 10000,
    material: 'CH-1062',
    materialDescription: 'Real BHG',
    quantity: '1000',
    buttonPrice: '97000',
    uom: 'KG',
    isSelected: false,
  },
])

const updatePrice = () => {
  modalForm.value.toggle()
}

const clearPriceUpdateTemp = () => {
  priceUpdateTemp.value = []
}

const savePriceUpdateTemp = () => {
  priceUpdateTemp.value.forEach((item, index) => {
    if (item.isSelected) {
      dataResponse.value[index].tenderPrice = item.price
    }
  })

  clearPriceUpdateTemp()
  modalForm.value.toggle()
}

const submit = () => {
  modalSuccess.value = true
}

watch(
  dataResponse,
  (newVal) => {
    priceUpdateTemp.value = newVal.map((item) => ({
      price: item.tenderPrice,
      isSelected: item.isSelected,
    }))
  },
  { immediate: true },
)
</script>
