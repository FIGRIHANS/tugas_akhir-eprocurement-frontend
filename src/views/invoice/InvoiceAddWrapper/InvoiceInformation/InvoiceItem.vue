<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Costs / Expenses</p>
    <button
      v-if="form?.status === 0 || form?.status === -1 || form?.status === 5"
      class="btn btn-outline btn-primary w-fit"
      @click="addNew"
    >
      <i class="ki-duotone ki-plus-circle"></i>
      Add Costs / Expenses
    </button>
    <div v-if="form" class="overflow-x-auto cost__table">
      <table
        class="table table-xs table-border"
        :class="{ 'border-danger': form?.invoiceItemError }"
      >
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :class="{
                'cost__field-base--activity': item.toLowerCase() === 'activity / expense',
                'cost__field-base--item-amount': item.toLowerCase() === 'item amount',
                'cost__field-base--tax': item.toLowerCase() === 'tax code',
                'cost__field-base--cost': item.toLowerCase() === 'cost center',
                'cost__field-base--description': item.toLowerCase() === 'description',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="form.invoiceItem.length === 0">
            <td :colspan="columns.length" class="text-center text-[13px]">No Data Available</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in form.invoiceItem" :key="index" class="cost__field-items">
              <td class="flex items-center justify-around gap-[8px]">
                <button
                  v-if="form.status === 0 || form.status === -1 || form.status === 5"
                  class="btn btn-icon btn-primary"
                  :disabled="checkIsEdit() && !item.isEdit"
                  @click="item.isEdit = !item.isEdit"
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
                <span v-if="!item.isEdit || form.invoiceType === '4'">{{
                  getActivityName(item.activity) || '-'
                }}</span>
                <v-select
                  v-else
                  v-model="item.activity"
                  class="customSelect"
                  placeholder="Select"
                  :get-option-label="(option: any) => option.name"
                  :reduce="(option: any) => option.id"
                  :options="listActivity"
                  appendToBody
                ></v-select>
              </td>
              <td>
                <span v-if="!item.isEdit || form.invoiceType === '4'">{{
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
                  @input="editVariance(index)"
                  @change="item.whtBaseAmount = item.itemAmount.toString()"
                />
              </td>
              <td v-if="form.invoiceType === '4'">
                <span v-if="!item.isEdit">{{ item.realizationAmount || '-' }}</span>
                <input
                  v-else
                  v-model="item.realizationAmount"
                  class="input"
                  :class="{ 'input-danger': item.isTextLimitExceeded }"
                  type="text"
                  placeholder=""
                  @input="handleRealizationInput(item, $event, index)"
                />
              </td>
              <td v-if="form.invoiceType === '4'">
                <span v-if="!item.isEdit || form.invoiceType === '4'">{{
                  item.variance || '-'
                }}</span>
                <input
                  v-else
                  v-model="item.variance"
                  class="input"
                  :class="{ 'input-danger': item.isTextLimitExceeded }"
                  type="number"
                  placeholder=""
                  disabled
                />
              </td>
              <td>
                <span v-if="!item.isEdit || form.invoiceType === '4'">{{
                  item.itemText || '-'
                }}</span>
                <input
                  v-else
                  v-model="item.itemText"
                  class="input"
                  :class="{ 'input-danger': item.isTextLimitExceeded }"
                  type="text"
                  placeholder=""
                  @input="onItemTextInput(item, $event)"
                />
              </td>

              <td v-if="!isPettyCash">
                <span v-if="!item.isEdit || form.invoiceType === '4'">{{
                  getDebitCreditName(item.debitCredit) || '-'
                }}</span>
                <select v-else v-model="item.debitCredit" class="select" placeholder="">
                  <option value="D">Debit</option>
                  <option value="K">Credit</option>
                </select>
              </td>
              <td v-if="!isPettyCash">
                <span v-if="!item.isEdit || form.invoiceType === '4'">{{
                  getTaxCodeName(item.taxCode) || '-'
                }}</span>
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
                    : useFormatUsd(item.vatAmount) || '-'
                }}</span>
              </td>
              <td v-if="!isPettyCash">
                <span v-if="!item.isEdit">{{ getCostCenterName(item.costCenter) || '-' }}</span>
                <v-select
                  v-else
                  v-model="item.costCenter"
                  class="customSelect"
                  placeholder="Select"
                  :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                  :reduce="(option: any) => option.code"
                  :options="costCenterList"
                  appendToBody
                ></v-select>
              </td>
              <td>
                <span>{{ item.profitCenter || '-' }}</span>
              </td>
              <td>
                <span>{{ item.assignment || '-' }}</span>
              </td>
              <td v-if="!isPettyCash">
                <span>{{ item.whtType || '-' }}</span>
              </td>
              <td v-if="!isPettyCash">
                <span>{{ item.whtCode || '-' }}</span>
              </td>
              <td v-if="!isPettyCash">
                <span>{{
                  form?.currency === 'IDR'
                    ? useFormatIdr(item.whtBaseAmount)
                    : useFormatUsd(item.whtBaseAmount) || '-'
                }}</span>
              </td>
              <td v-if="!isPettyCash">
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
import { computed, watch, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()

const form = inject<formTypes>('form')

const isPettyCash = computed(() => form?.invoiceType === '5')

const columns = computed(() => {
  const baseColumns = ['Action', 'Activity / Expense', 'Item Amount', 'Item Text']

  if (form.invoiceType === '4') {
    const index = baseColumns.indexOf('Item Text')

    if (index !== -1) {
      baseColumns.splice(index, 0, 'Realization Amount', 'Variance')
    }
  }

  if (!isPettyCash.value) {
    baseColumns.push('Debit/Credit')
  }

  if (!isPettyCash.value) {
    baseColumns.push('Tax Code')
  }

  baseColumns.push('VAT Amount')
  if (!isPettyCash.value) {
    baseColumns.push('Cost Center')
  }
  baseColumns.push('Profit Center')
  baseColumns.push('Assignment')

  if (!isPettyCash.value) {
    baseColumns.push('WHT Type')
    baseColumns.push('WHT Code')
    baseColumns.push('WHT Base Amount')
    baseColumns.push('WHT Amount')
  }

  return baseColumns
})

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const listActivity = computed(() => invoiceMasterApi.activityList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)

const addNew = () => {
  if (form) {
    const data = {
      id: 0,
      activity: null,
      activityCode: '',
      activityName: '',
      itemAmount: 0,
      itemText: '',
      debitCredit: 'D',
      taxCode: '',
      vatAmount: 0,
      costCenter: isPettyCash.value ? '' : '',
      profitCenter: '',
      assignment: '',
      whtType: '',
      whtCode: '',
      whtBaseAmount: '',
      whtAmount: '',
      whtCodeList: [],
      isEdit: false,
      isTextLimitExceeded: false,
      realizationAmount: 0,
      variance: 0,
    }
    form.invoiceItem.push(data)
  }
}

const deleteItem = (index: number) => {
  if (form.invoiceItem[index].id !== 0) {
    verificationApi.costExpenseTempDelete?.push(form.invoiceItem[index].id)
  }
  form?.invoiceItem.splice(index, 1)
}

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1) return listActivity.value[getIndex].name
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
    for (const item of form.invoiceItem) {
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

const getCostCenterName = (costCenter: string) => {
  const index = costCenterList.value.findIndex((item) => item.code === costCenter)
  if (index !== -1) {
    const data = costCenterList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const checkIsEdit = () => {
  const checkIndex = form.invoiceItem.findIndex((item) => item.isEdit)
  return checkIndex !== -1
}

const onItemTextInput = (item: { itemText?: string; isTextLimitExceeded?: boolean }, e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target) return
  // If user attempts to input >50 chars, mark as exceeded and truncate immediately
  if (target.value && target.value.length > 50) {
    item.isTextLimitExceeded = true
    const truncated = target.value.slice(0, 50)
    target.value = truncated
    item.itemText = truncated
  } else {
    // clear the flag when within limit
    item.isTextLimitExceeded = false
  }
}
const editVariance = (index: number) => {
  const item = form.invoiceItem[index]
  const itemAmount = Number(item.itemAmount) || 0
  const realizationAmount = Number(item.realizationAmount) || 0
  item.variance = itemAmount - realizationAmount
}
const handleRealizationInput = (item: any, e: Event, index: number) => {
  item.hasRealizationInput = true
  onItemTextInput(item, e)
  editVariance(index)
}
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
