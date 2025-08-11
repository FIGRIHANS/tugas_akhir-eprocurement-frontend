<template>
  <div class="modal" data-modal="true" id="tender_negotiation_modal">
    <div class="modal-content max-w-[1200px] modal-center-y">
      <div class="modal-body p-[24px]">
        <div class="flex gap-5">
          <div class="flex flex-col gap-5 w-[30%]">
            <UiInput
              v-model="iteration"
              row
              label="Iteration"
              id="newDocName"
              placeholder="2"
              disabled
            />
            <UiInput
              v-model="volumeDisc"
              row
              label="Volume Disc"
              id="newDocName"
              placeholder="Percent"
              @change="setDiscount()"
            />
            <UiSelect
              row
              label="Type"
              :options="[
                { label: 'Volume Disc', value: 1 },
                { label: 'Itimize Disc', value: 2 },
              ]"
              text-key="label"
              value-key="value"
              v-model="discType"
            />
            <UiInput
              row
              label="Exp Disc"
              v-model="expDisc"
              id="newDocName"
              placeholder="30%"
              disabled
            />
            <UiInput
              row
              label="Currency"
              v-model="currency"
              id="newDocName"
              placeholder="USD"
              disabled
            />
          </div>
          <div class="w-[70%]">
            <table class="table text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th
                    v-for="(item, index) in columnsCalculation"
                    :key="index"
                    class="nego__field-base !border-b-blue-500"
                    :class="{
                      'nego__field-base--description': item === 'Material Desc',
                    }"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) of countTable" :key="index">
                  <td>{{ data.row1 }}</td>
                  <td>{{ data.row2 }}</td>
                  <td>{{ data.row3 }}</td>
                  <td>{{ data.row4 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <UiButton @click="calculate"> Calculate Negotiation</UiButton>
        </div>

        <div class="nego__table mt-[24px]">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th
                  v-for="(item, index) in columns"
                  :key="index"
                  class="nego__field-base !border-b-blue-500"
                  :class="{
                    'nego__field-base--description': item === 'Material Desc',
                  }"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data of list" :key="data.prNo">
                <td>{{ data.prNo }}</td>
                <td>{{ data.ItemNo }}</td>
                <td>{{ data.Material }}</td>
                <td>{{ data.MaterialDesc }}</td>
                <td>{{ data.Quantity }}</td>
                <td>{{ data.UoM }}</td>
                <td>
                  {{ data.UnitPrice?.toLocaleString() }}
                </td>
                <td>{{ data.unitCurrency }}</td>
                <td>{{ data.ExpDisc }}</td>
                <td>
                  <input
                    v-if="discType !== 1"
                    v-model="data.ExpectedDisc"
                    type="number"
                    class="input"
                  />
                  <span v-else>{{
                    (data.ExpectedDisc =
                      getPercentFromString(data.ExpDisc) * data.UnitPrice)?.toLocaleString()
                  }}</span>
                </td>
                <td>{{ (data.UnitPrice - data.ExpectedDisc)?.toLocaleString() }}</td>
                <td>{{ (data.Quantity * data.UnitPrice)?.toLocaleString() }}</td>
                <td>{{ (data.ExpectedDisc * data.Quantity)?.toLocaleString() }}</td>
                <td>
                  {{ ((data.UnitPrice - data.ExpectedDisc) * data.Quantity)?.toLocaleString() }}
                </td>
                <td>{{ data.VendorPurposeDisc }}</td>
                <td>
                  {{
                    data.VendorDiscAmount =
                      getPercentFromString(data.VendorPurposeDisc) * data.UnitPrice
                  }}
                </td>
                <td>
                  {{ (data.UnitPrice - data.VendorDiscAmount)?.toLocaleString() }}
                </td>
                <td>{{ (data.Quantity * data.UnitPrice)?.toLocaleString() }}</td>
                <td>
                  {{ (data.Quantity * data.VendorDiscAmount)?.toLocaleString() }}
                </td>
                <td>
                  {{
                    (
                      data.Quantity * data.UnitPrice -
                      data.Quantity * data.VendorDiscAmount
                    )?.toLocaleString()
                  }}
                </td>
                <td>
                  {{
                    (
                      data.Quantity * data.UnitPrice * getPercentFromString(data.ExpDisc) -
                      data.Quantity * data.VendorDiscAmount
                    )?.toLocaleString()
                  }}
                </td>
                <td>{{ data.varNettCurrency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-row-reverse align-items-center gap-[8px] mt-[24px]">
          <button class="btn btn-primary" @click="saveUpdate">Confirm</button>
          <button class="btn btn-outline btn-primary" @click="hide">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue'
import { KTModal } from '@/metronic/core'
import type {
  NegotiationEntitiesTypes,
  tableNegotiationHistoryTypes,
} from '../types/tenderNegotiation'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { cloneDeep } from 'lodash'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const iteration = ref<string>('')
const volumeDisc = ref<string>()
const expDisc = ref<string>()
const currency = ref<string>()
const discType = ref(1)
const totalAmountAdmin = ref(171000)
const totalAmountVendor = ref(171000)
const totalAmountVariance = ref(totalAmountAdmin.value - totalAmountVendor.value)

const expectedDiscAdmin = ref()
const expectedDicValueAdmin = ref()
const expectedDiscVendor = ref()
const expectedDicValueVendor = ref()

const list = ref<NegotiationEntitiesTypes[]>([])

const props = defineProps<{
  data: NegotiationEntitiesTypes[]
  historyData: tableNegotiationHistoryTypes
}>()

const getPercentFromString = (value: string) => {
  const persentase_bersih = value.replace('%', '')
  const persentase_desimal = parseFloat(persentase_bersih) / 100
  return persentase_desimal
}

const setDiscount = () => {
  let value = volumeDisc.value
  if (typeof value === 'string' && !value.endsWith('%')) {
    value += '%'
  }
  const data = value
  volumeDisc.value = data
}

const calculateDiscountValue = () => {
  expectedDicValueAdmin.value =
    getPercentFromString(expectedDiscAdmin.value) * totalAmountAdmin.value
  expectedDicValueVendor.value =
    getPercentFromString(expectedDiscVendor.value) * totalAmountVendor.value
}

const calculateExpectedAmount = () => {
  const result = list.value.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.Quantity * currentItem.UnitPrice
  }, 0)

  totalAmountAdmin.value = result
  totalAmountVendor.value = result
  // data.Quantity * data.UnitPrice
}

const calculate = () => {
  expectedDiscAdmin.value = volumeDisc.value
  list.value.forEach((item) => {
    item.ExpDisc = volumeDisc.value || ''
  })

  calculateExpectedAmount()
  calculateDiscountValue()
}

const emits = defineEmits(['setNego'])

const columns = ref<string[]>([
  'PR No',
  'Item No',
  'Material',
  'Material Desc',
  'Quantity',
  'UoM',
  'Unit Price',
  'Currency',
  'Exp Disc %',
  'Expected Disc',
  'Exp Price Per Unit',
  'Total Gross Amount',
  'Total Disc',
  'Total Nett Amount',
  'Vendor Purpose Disc',
  'Vendor Disc Amount',
  'Vendor Price Per Unit',
  'Total Gross Amount',
  'Total Disc',
  'Total Nett Amount',
  'Var Nett Amount',
  'Currency',
])

const columnsCalculation = ref<string[]>([
  'Comercial Item',
  'Expected Amount',
  'Vendor Proposed',
  'Variance',
])

const countpercentDiff = () => {
  const admin = parseInt(expectedDiscAdmin.value)
  const vendor = parseInt(expectedDiscVendor.value)

  const result = admin - vendor + '%'
  return result
}

const countTable = computed(() => {
  return [
    {
      row1: 'Total Amount',
      row2: totalAmountAdmin.value.toLocaleString(),
      row3: totalAmountVendor.value.toLocaleString(),
      row4: totalAmountVariance.value.toLocaleString() || '-',
    },
    {
      row1: 'Expected Disc',
      row2: expectedDiscAdmin.value || '-',
      row3: expectedDiscVendor.value,
      row4: countpercentDiff(),
    },
    {
      row1: 'Expected Disc',
      row2: expectedDicValueAdmin.value?.toLocaleString(),
      row3: expectedDicValueVendor.value?.toLocaleString(),
      row4: (expectedDicValueAdmin.value - expectedDicValueVendor.value)?.toLocaleString(),
    },
    {
      row1: 'Final Amount',
      row2: (totalAmountAdmin.value - expectedDicValueAdmin.value)?.toLocaleString(),
      row3: (totalAmountVendor.value - expectedDicValueVendor.value)?.toLocaleString(),
      row4: (
        totalAmountAdmin.value -
        expectedDicValueAdmin.value -
        (totalAmountVendor.value - expectedDicValueVendor.value)
      )?.toLocaleString(),
    },
  ]
})

const hide = () => {
  const idModal = document.querySelector('#tender_negotiation_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
}

const saveUpdate = () => {
  const returnData = {
    totalAmountAdmin: totalAmountAdmin.value,
    totalAmountVendor: totalAmountVendor.value,
    totalAmountVariance: totalAmountVariance.value,
    expectedDiscAdmin: expectedDiscAdmin.value,
    expectedDiscVendor: expectedDiscVendor.value,
    expectedDiscDiffPerc: countpercentDiff(),
    expectedDicValueAdmin: expectedDicValueAdmin.value,
    expectedDicValueVendor: expectedDicValueVendor.value,
    expectedDiscDiffValue: expectedDicValueAdmin.value - expectedDicValueVendor.value,
    finalAmountAdmin: totalAmountAdmin.value - expectedDicValueAdmin.value,
    finalAmountVendor: totalAmountVendor.value - expectedDicValueVendor.value,
    finalAmountDiff:
      totalAmountAdmin.value -
      expectedDicValueAdmin.value -
      (totalAmountVendor.value - expectedDicValueVendor.value),
  }

  emits('setNego', returnData)
  hide()
}

onMounted(() => {
  expectedDiscAdmin.value = expDisc.value
  calculateExpectedAmount()
  calculateDiscountValue()
})

watch(
  () => props.data,
  () => {
    list.value = cloneDeep(props.data)
    console.log(countTable.value)
    iteration.value = props.historyData.iteration
    expDisc.value = props.historyData.expectedDisc
    currency.value = props.historyData.discCurrency
    volumeDisc.value = expDisc.value
    expectedDiscAdmin.value = expDisc.value
    expectedDiscVendor.value = props.historyData.vendorPurposedDisc
    calculateExpectedAmount()
    calculateDiscountValue()
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>
