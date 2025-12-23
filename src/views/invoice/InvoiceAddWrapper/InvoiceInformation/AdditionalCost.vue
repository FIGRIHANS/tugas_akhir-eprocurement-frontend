<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Additional Cost</p>
    <button
      v-if="form?.status === 0 || form?.status === -1 || form?.status === 5"
      class="btn btn-outline btn-primary w-fit"
      @click="addNew"
    >
      <i class="ki-duotone ki-plus-circle"></i>
      Add Additional Cost
    </button>
    <div v-if="form" class="overflow-x-auto cost__table">
      <table
        class="table table-xs table-border"
        :class="{ 'border-danger': form?.additionalCostError }"
      >
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :class="{
                'cost__field-base--activity': item.toLowerCase() === 'activity / expense',
                'cost__field-base--tax': item.toLowerCase() === 'tax code',
                'cost__field-base--item-amount': item.toLowerCase() === 'item amount',
                'cost__field-base--description': item.toLowerCase() === 'description',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="form.additionalCost.length === 0">
            <td colspan="11" class="text-center text-[13px]">No Data Available</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in form.additionalCost" :key="index" class="cost__field-items">
              <td class="flex items-center justify-around gap-[8px]">
                <button
                  v-if="form.status === 0 || form.status === -1 || form.status === 5"
                  class="btn btn-icon btn-primary"
                  @click="goEdit(item)"
                >
                  <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                  <i v-else class="ki-duotone ki-check-circle"></i>
                </button>
                <button
                  v-if="form.status === 0 || form.status === -1 || form.status === 5"
                  class="btn btn-icon btn-outline btn-danger"
                  @click="deleteItem(index)"
                >
                  <i class="ki-duotone ki-cross-circle"></i>
                </button>
              </td>
              <td>
                <span v-if="!item.isEdit">{{ getActivityName(item.activity) || '-' }}</span>
                <v-select
                  v-else
                  v-model="item.activity"
                  class="customSelect"
                  placeholder="Select"
                  :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                  :reduce="(option: any) => option.id"
                  :options="listActivity"
                  :error="{ 'error-select': item.isActivityError }"
                  appendToBody
                ></v-select>
              </td>
              <td>
                <span v-if="!item.isEdit">{{
                  form?.currency === 'IDR'
                    ? useFormatIdr(item.itemAmount)
                    : useFormatUsd(item.itemAmount) || '-'
                }}</span>
                <input
                  v-else
                  v-model="item.itemAmount"
                  class="input"
                  type="number"
                  placeholder=""
                  :class="{ 'border-danger': item.isItemAmountError }"
                  @change="item.whtBaseAmount = Number(item.itemAmount)"
                />
              </td>
              <td>
                <span v-if="!item.isEdit">{{ getDebitCreditName(item.debitCredit) || '-' }}</span>
                <select
                  v-else
                  v-model="item.debitCredit"
                  class="select"
                  placeholder=""
                  :class="{ 'border-danger': item.isDebitCreditError }"
                >
                  <option value="D">Debit</option>
                  <option value="K">Credit</option>
                </select>
              </td>
              <td>
                <span v-if="!item.isEdit">{{ getTaxCodeName(item.taxCode) || '-' }}</span>
                <v-select
                  v-else
                  v-model="item.taxCode"
                  class="customSelect"
                  placeholder="Select"
                  :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                  :reduce="(option: any) => option.code"
                  :options="listTaxCalculation"
                  appendToBody
                ></v-select>
              </td>
              <td>
                <span>{{
                  form?.currency === 'IDR'
                    ? useFormatIdr(item.vatAmount)
                    : useFormatUsd(item.vatAmount)
                }}</span>
              </td>
              <td>
                <span>{{ item.costCenter || '-' }}</span>
              </td>
              <td>
                <span>{{ item.profitCenter || '-' }}</span>
              </td>
              <td>
                <span>{{ item.assignment || '-' }}</span>
              </td>
              <td>
                <span>{{ item.whtType || '-' }}</span>
              </td>
              <td>
                <span>{{ item.whtCode || '-' }}</span>
              </td>
              <td>
                <span>{{
                  form?.currency === 'IDR'
                    ? useFormatIdr(item.whtBaseAmount)
                    : useFormatUsd(item.whtBaseAmount) || '-'
                }}</span>
              </td>
              <td>
                <span>{{
                  form?.currency === 'IDR'
                    ? useFormatIdr(item.whtAmount)
                    : useFormatUsd(item.whtAmount) || '-'
                }}</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { itemsCostType } from '../../types/additionalCost'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()
const columns = ref([
  'Action',
  'Activity / Expense',
  'Item Amount',
  'Debit/Credit',
  'Tax Code',
  'VAT Amount',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'WHT Amount',
])

const form = inject<formTypes>('form')

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const listActivity = computed(() => invoiceMasterApi.activityList)

const addNew = () => {
  if (form) {
    const data = {
      id: 0,
      activity: null,
      activityCode: '',
      activityName: '',
      itemAmount: 0,
      debitCredit: '',
      taxCode: '',
      vatAmount: 0,
      costCenter: '',
      profitCenter: '',
      assignment: '',
      whtType: '',
      whtCode: '',
      whtBaseAmount: 0,
      whtAmount: 0,
      isEdit: false,
    }
    form.additionalCost.push(data)
  }
}

const deleteItem = (index: number) => {
  if (form.additionalCost[index].id !== 0) {
    verificationApi.additionalCostTempDelete?.push(form.additionalCost[index].id)
  }
  form?.additionalCost.splice(index, 1)
}

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1)
    return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
}

const getDebitCreditName = (code: string) => {
  if (code === 'K') return 'Credit'
  else if (code === 'D') return 'Debit'
  else return '-'
}

const getPercentTax = (code: string) => {
  if (code === 'V0') return 0
  const getIndex = listTaxCalculation.value.findIndex((item) => item.code === code)
  if (getIndex !== -1) {
    const splitName = listTaxCalculation.value[getIndex].name.split(' - ')
    return parseFloat(splitName[1].replace(',', '.').replace('%', '')) / 100
  }
}

const getVatAmount = () => {
  if (form) {
    for (const item of form.additionalCost) {
      const percentTax = getPercentTax(item.taxCode) || 0
      const itemAmount = Number(item.itemAmount)
      const result = percentTax * itemAmount
      item.vatAmount = result
    }
  }
}

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const goEdit = (item: itemsCostType) => {
  if (item.isEdit) {
    for (const data of form.additionalCost) {
      if (!data.activity) data.isActivityError = true
      else data.isActivityError = false

      if (!data.itemAmount || data.itemAmount < 0) data.isItemAmountError = true
      else data.isItemAmountError = false

      if (!data.debitCredit) data.isDebitCreditError = true
      else data.isDebitCreditError = false
    }
    if (item.isActivityError || item.isItemAmountError || item.isDebitCreditError) return
  }
  item.isEdit = !item.isEdit
}

watch(
  () => [form?.additionalCost, form?.currency],
  () => {
    getVatAmount()
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
