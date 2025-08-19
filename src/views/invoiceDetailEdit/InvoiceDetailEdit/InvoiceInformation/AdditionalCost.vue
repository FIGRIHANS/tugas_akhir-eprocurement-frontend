<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Additional Cost</p>
    <button class="btn btn-outline btn-primary w-fit" @click="addNew">
      <i class="ki-duotone ki-plus-circle"></i>
      Add Additional Cost
    </button>
    <div v-if="form" class="overflow-x-auto cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__field-base"
              :class="{
                'cost__field-base--cost': item.toLowerCase() === 'cost center',
                'cost__field-base--description': item.toLowerCase() === 'description'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCosts" :key="index" class="cost__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button class="btn btn-outline btn-icon btn-primary" :disabled="checkIsEdit() && !item.isEdit" @click="goEdit(item)">
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button class="btn btn-icon btn-outline btn-danger" @click="resetItem(item, index)">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.activityExpense }}</span>
              <select v-else v-model="formEdit.activityExpense" class="select" placeholder="">
                <option v-for="item of listActivity" :key="item.code" :value="item.code">
                  {{ item.name }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.itemAmount }}</span>
              <input v-else v-model="formEdit.itemAmount" class="input" type="number" placeholder=""/>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.debitCredit }}</span>
              <select v-else v-model="formEdit.debitCredit" class="select" placeholder="">
                <option value="D">
                  Debit
                </option>
                <option value="K">
                  Credit
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.taxCode }}</span>
              <select v-else v-model="formEdit.taxCode" class="select" placeholder="">
                <option v-for="(option, index) in listTaxCalculation" :key="index" :value="option.code">
                  {{ option.code }}
                </option>
              </select>
            </td>
              <td v-if="!checkPoPib()">
                {{ form.currCode === 'IDR' ? useFormatIdr(item.isEdit ? formEdit.vatAmount : item.vatAmount) : useFormatUsd(item.isEdit ? formEdit.vatAmount : item.vatAmount) }}
              </td>
            <td>
              <span v-if="!item.isEdit">{{ item.costCenter }}</span>
              <select v-else v-model="formEdit.costCenter" class="select" placeholder="">
                <option v-for="item of costCenterList" :key="item.code" :value="item.code">
                  {{ item.code + ' - ' + item.name }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.profitCenter }}</span>
              <select v-else v-model="formEdit.profitCenter" class="select" placeholder="">
                <option v-for="item of profitCenter" :key="item.code" :value="item.code">
                  {{ item.name }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.assignment }}</span>
              <input v-else v-model="formEdit.assignment" class="input" placeholder=""/>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.whtType }}</span>
              <select v-else v-model="formEdit.whtType" class="select" placeholder="" @change="callWhtCode(item)">
                <option v-for="item of whtTypeList" :key="item.code" :value="item.code">
                  {{ item.name }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.whtCode }}</span>
              <select v-else v-model="formEdit.whtCode" class="select" placeholder="">
                <option v-for="sub of item.whtCodeList" :key="sub.whtCode" :value="sub.whtCode">
                  {{ sub.whtCode }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.whtBaseAmount }}</span>
              <input v-else v-model="formEdit.whtBaseAmount" class="input" type="number" placeholder=""/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, inject, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import type { itemsCostType } from '../../types/additionalCost'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()
const form = inject<Ref<formTypes>>('form')
const columns = ref([
  'Action',
  'Activity / Expense',
  'Item Amount',
  'Debit/Credit',
  'Tax Code',
  'Vat Amount',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount'
])
const formEdit = reactive({
  activityExpense: '',
  itemAmount: 0,
  debitCredit: '',
  taxCode: '',
  vatAmount: 0,
  costCenter: '',
  profitCenter: '',
  assignment: '',
  whtType: '',
  whtCode: '',
  whtBaseAmount: 0
})

const listActivity = computed(() => invoiceMasterApi.activityList)
const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)
const profitCenter = computed(() => invoiceMasterApi.profilCenterList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)

const checkIsEdit = () => {
  const result = form?.value.additionalCosts.findIndex((item) => item.isEdit)
  return result !== -1
}

const checkPoPib = () => {
  return form?.value.invoiceTypeCode === 902
}

const addNew = () => {
  if (form) {
    const data = {
      id: 0,
      activityExpense: '',
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
      isEdit: false
    }
    form.value.additionalCosts.push(data)
  }
}

const resetFormEdit = () => {
  formEdit.activityExpense = ''
  formEdit.itemAmount = 0
  formEdit.debitCredit = ''
  formEdit.taxCode = ''
  formEdit.vatAmount = 0
  formEdit.costCenter = ''
  formEdit.profitCenter = ''
  formEdit.assignment = ''
  formEdit.whtType = ''
  formEdit.whtCode = ''
  formEdit.whtBaseAmount = 0
}

const goEdit = (item: itemsCostType) => {
  item.isEdit = !item.isEdit

  if (item.isEdit) {
    formEdit.activityExpense = item.activityExpense
    formEdit.itemAmount = item.itemAmount
    formEdit.debitCredit = item.debitCredit
    formEdit.taxCode = item.taxCode
    formEdit.vatAmount = item.vatAmount
    formEdit.costCenter = item.costCenter
    formEdit.profitCenter = item.profitCenter
    formEdit.assignment = item.assignment
    formEdit.whtType = item.whtType
    formEdit.whtCode = item.whtCode
    formEdit.whtBaseAmount = item.whtBaseAmount
  } else {
    item.activityExpense = formEdit.activityExpense
    item.itemAmount = formEdit.itemAmount
    item.debitCredit = formEdit.debitCredit
    item.taxCode = formEdit.taxCode
    item.vatAmount = formEdit.vatAmount
    item.costCenter = formEdit.costCenter
    item.profitCenter = formEdit.profitCenter
    item.assignment = formEdit.assignment
    item.whtType = formEdit.whtType
    item.whtCode = formEdit.whtCode
    item.whtBaseAmount = formEdit.whtBaseAmount
    resetFormEdit()
  }
}

const resetItem = (item: itemsCostType, index: number) => {
  if (item.isEdit) {
    item.isEdit = !item.isEdit
    resetFormEdit()
  } else {
    if (form) {
      verificationApi.additionalCostTempDelete?.push(form.value.additionalCosts[index])
      form.value.additionalCosts.splice(index, 1)
    }
  }
}

const callWhtCode = (data: itemsCostType) => {
  formEdit.whtCode = ''
  invoiceMasterApi.getWhtCode(formEdit.whtType).then(() => {
    data.whtCodeList = whtCodeList.value
  })
}

const getPercentTax = (code: string) => {
  if (code === 'V0') return 0
  const getIndex = listTaxCalculation.value.findIndex((item) => item.code === code)
  if (getIndex !== -1) {
    const splitName = listTaxCalculation.value[getIndex].name.split(' - ')
    return parseFloat(splitName[1].replace(',', '.').replace('%','')) / 100
  }
}

const getVatAmount = () => {
  if (!form) return
  const checkIsEdit = form.value.additionalCosts.findIndex((item) => item.isEdit)
  if (checkIsEdit !== -1) {
    const percentTax = getPercentTax(formEdit.taxCode) || 0
    const itemAmount = formEdit.itemAmount
    const result = percentTax * itemAmount
    formEdit.vatAmount = result
  } else {
    for (const item of form.value.additionalCosts) {
      const percentTax = getPercentTax(item.taxCode) || 0
      const itemAmount = item.itemAmount
      const result = percentTax * itemAmount
      item.vatAmount = result
    }
  }
}

watch(
  () => [form?.value.additionalCosts, form?.value.currCode, formEdit],
  () => {
    if (!checkPoPib()) getVatAmount()
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
