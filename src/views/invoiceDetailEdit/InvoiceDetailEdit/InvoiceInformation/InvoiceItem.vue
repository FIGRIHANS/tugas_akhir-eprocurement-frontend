<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Costs / Expenses</p>
    <button
      v-if="route.query.isSendSap !== 'true' || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin()"
      class="btn btn-outline btn-primary w-fit"
      @click="addNew"
    >
      <i class="ki-duotone ki-plus-circle"></i>
      Add Costs / Expenses
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
                'cost__field-base--activity': item.toLowerCase() === 'activity / expense',
                'cost__field-base--tax': item.toLowerCase() === 'tax code',
                'cost__field-base--cost': item.toLowerCase() === 'cost center',
                'cost__field-base--wht-type': item.toLowerCase() === 'wht type',
                'cost__field-base--wht-code': item.toLowerCase() === 'wht code',
                'cost__field-base--description': item.toLowerCase() === 'description',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoiceItem" :key="index" class="cost__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button
                class="btn btn-outline btn-icon btn-primary"
                :disabled="(checkIsEdit() && !item.isEdit) || route.query.isSendSap === 'true' || checkApprovalNonPoCcAdmin()"
                @click="goEdit(item)"
              >
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button
                class="btn btn-icon btn-outline btn-danger"
                @click="resetItem(item, index)"
                :disabled="route.query.isSendSap === 'true' || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin()"
              >
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getActivityName(item.activityId) }}</span>
              <v-select
                v-else
                v-model="formEdit.activityExpense"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.id"
                :options="listActivity"
                :error="{ 'error-select': formEdit.isActivityError }"
                :disabled="checkApprovalNonPoProc()"
                appendToBody
              ></v-select>
            </td>
            <td>
              <span v-if="!item.isEdit">
                {{
                  form.currCode === 'IDR'
                    ? useFormatIdr(item.isEdit ? formEdit.itemAmount : item.itemAmount)
                    : useFormatUsd(item.isEdit ? formEdit.itemAmount : item.itemAmount)
                }}
              </span>
              <input
                v-else
                v-model="formEdit.itemAmount"
                class="input"
                type="number"
                placeholder=""
                :class="{ 'border-danger': formEdit.isItemAmountError }"
                @change="formEdit.whtBaseAmount = formEdit.itemAmount"
              />
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.itemText || '-' }}</span>
              <input v-else v-model="formEdit.itemText" class="input" type="text" placeholder="" maxlength="50" :disabled="checkApprovalNonPoProc()" />
            </td>
            <td v-if="!checkNonPoPettyCash()">
              <span v-if="!item.isEdit">{{ getDebitCreditName(item.debitCredit) || '-' }}</span>
              <select
                v-else
                v-model="formEdit.debitCredit"
                class="select"
                placeholder=""
                :disabled="checkApprovalNonPoProc()"
                :class="{ 'border-danger': formEdit.isDebitCreditError }"
              >
                <option value="D">Debit</option>
                <option value="K">Credit</option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getTaxCodeName(item.taxCode) }}</span>
              <v-select
                v-else
                v-model="formEdit.taxCode"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.code"
                :options="listTaxCalculation"
                :disabled="checkApprovalNonPoProc()"
                appendToBody
              ></v-select>
            </td>
            <td>
              {{
                form.currCode === 'IDR'
                  ? useFormatIdr(item.isEdit ? formEdit.vatAmount : item.vatAmount)
                  : useFormatUsd(item.isEdit ? formEdit.vatAmount : item.vatAmount)
              }}
            </td>
            <td v-if="!checkNonPoPettyCash()">
              <span v-if="!item.isEdit">{{ getCostCenterName(item.costCenter) }}</span>
              <v-select
                v-else
                v-model="formEdit.costCenter"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.code"
                :options="costCenterList"
                :disabled="checkApprovalNonPoProc()"
                appendToBody
              ></v-select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.profitCenter || '-' }}</span>
              <select v-else v-model="formEdit.profitCenter" class="select" placeholder="" :disabled="checkApprovalNonPoProc()">
                <option v-for="item of profitCenter" :key="item.code" :value="item.code">
                  {{ item.name }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.assignment || '-' }}</span>
              <input v-else v-model="formEdit.assignment" class="input" placeholder="" :disabled="checkApprovalNonPoProc()" />
            </td>
            <td v-if="!checkNonPoPettyCash()">
              <span v-if="!item.isEdit">{{ getWhtTypeName(item.whtType) }}</span>
              <v-select
                v-else
                v-model="formEdit.whtType"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.code"
                :options="whtTypeList"
                :disabled="checkApprovalNonPoProc()"
                appendToBody
                @update:modelValue="callWhtCode(item)"
              ></v-select>
            </td>
            <td v-if="!checkNonPoPettyCash()">
              <span v-if="!item.isEdit">{{ getWhtCodeName(item.whtCode, item) }}</span>
              <v-select
                v-else
                v-model="formEdit.whtCode"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.whtCode} - ${option.description}`"
                :reduce="(option: any) => option.whtCode"
                :options="whtCodeList"
                :disabled="checkApprovalNonPoProc()"
                appendToBody
                @update:modelValue="setWhtAmount(item)"
              ></v-select>
            </td>
            <td v-if="!checkNonPoPettyCash()">
              <span v-if="!item.isEdit">
                {{
                  form.currCode === 'IDR'
                    ? useFormatIdr(item.isEdit ? formEdit.whtBaseAmount : item.whtBaseAmount)
                    : useFormatUsd(item.isEdit ? formEdit.whtBaseAmount : item.whtBaseAmount)
                }}
              </span>
              <input
                v-else
                v-model="formEdit.whtBaseAmount"
                class="input"
                type="number"
                placeholder=""
                :disabled="checkApprovalNonPoProc()"
                @change="setWhtAmount(item)"
              />
            </td>
            <td v-if="!checkNonPoPettyCash()">
              <span>{{
                form.currCode === 'IDR'
                  ? useFormatIdr(item.isEdit ? formEdit.whtAmount : item.whtAmount)
                  : useFormatUsd(item.isEdit ? formEdit.whtAmount : item.whtAmount)
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, inject, onMounted, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../types/invoiceDetailEdit'
import type { invoiceItemTypes } from '../../types/invoiceItem'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useLoginStore } from '@/stores/views/login'

const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()
const invoiceLoginApi = useLoginStore()
const route = useRoute()
const form = inject<Ref<formTypes>>('form')
const columns = ref([
  'Action',
  'Activity / Expense',
  'Item Amount',
  'Item Text',
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
const formEdit = reactive({
  activityExpense: 0,
  itemAmount: 0,
  itemText: '',
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
  isActivityError: false,
  isItemAmountError: false,
  isDebitCreditError: false,
  isTaxCodeError: false
})

const listActivity = computed(() => invoiceMasterApi.activityList)
const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)
const profitCenter = computed(() => invoiceMasterApi.profilCenterList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)
const userData = computed(() => invoiceLoginApi.userData)

const checkIsEdit = () => {
  const result = form?.value.invoiceItem.findIndex((item) => item.isEdit)
  return result !== -1
}

const checkPoPib = () => {
  return form?.value.invoiceTypeCode === 902
}

const checkIsNonPo = () => {
  return route.query.invoiceType === 'no_po'
}

const checkNonPoCc = () => {
  return form.value.invoiceTypeCode === 2
}

const checkNonPoPettyCash = () => {
  return form.value.invoiceTypeCode === 5
}

const checkApprovalNonPoProc = () => {
  return checkIsNonPo() && userData.value?.profile.profileId === 3191
}

const checkApprovalNonPoCcAdmin = () => {
  return checkIsNonPo() && userData.value?.profile.profileId === 3190
}

const addNew = () => {
  if (form) {
    const data = {
      id: 0,
      activityId: null,
      activityExpenses: '',
      activityName: '',
      itemAmount: 0,
      itemText: '',
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
      whtCodeList: [],
      isEdit: false,
    } as invoiceItemTypes
    form.value.invoiceItem.push(data)
  }
}

const resetFormEdit = () => {
  formEdit.activityExpense = 0
  formEdit.itemAmount = 0
  formEdit.itemText = ''
  formEdit.debitCredit = ''
  formEdit.taxCode = ''
  formEdit.vatAmount = 0
  formEdit.costCenter = ''
  formEdit.profitCenter = ''
  formEdit.assignment = ''
  formEdit.whtType = ''
  formEdit.whtCode = ''
  formEdit.whtBaseAmount = 0
  formEdit.whtAmount = 0
  formEdit.isActivityError = false
  formEdit.isItemAmountError = false
  formEdit.isDebitCreditError = false
  formEdit.isTaxCodeError = false
}

const goEdit = (item: invoiceItemTypes) => {
  if (item.isEdit) {
    if (!formEdit.activityExpense) formEdit.isActivityError = true
    else formEdit.isActivityError = false

    if (!formEdit.itemAmount || formEdit.itemAmount < 0) formEdit.isItemAmountError = true
    else formEdit.isItemAmountError = false

    if (!formEdit.debitCredit && !checkNonPoPettyCash()) formEdit.isDebitCreditError = true
    else formEdit.isDebitCreditError = false

    if (!formEdit.taxCode && checkNonPoPettyCash()) formEdit.isTaxCodeError = true
    else formEdit.isTaxCodeError = false
  }

  if (
    formEdit.isActivityError ||
    formEdit.isItemAmountError ||
    formEdit.isDebitCreditError ||
    formEdit.isTaxCodeError
  ) return
  item.isEdit = !item.isEdit

  if (item.isEdit) {
    formEdit.activityExpense = item.activityId
    formEdit.itemAmount = item.itemAmount
    formEdit.itemText = item.itemText
    formEdit.debitCredit = item.debitCredit
    formEdit.taxCode = item.taxCode
    formEdit.vatAmount = item.vatAmount
    formEdit.costCenter = item.costCenter
    formEdit.profitCenter = item.profitCenter
    formEdit.assignment = item.assignment
    formEdit.whtType = item.whtType
    formEdit.whtCode = item.whtCode
    formEdit.whtBaseAmount = item.whtBaseAmount
    formEdit.whtAmount = item.whtAmount
  } else {
    const itemIndex = listActivity.value.findIndex((sub) => sub.id === formEdit.activityExpense)
    item.activityId = formEdit.activityExpense
    item.activityExpenses = listActivity.value[itemIndex].code
    item.activityName = listActivity.value[itemIndex].name
    item.itemAmount = formEdit.itemAmount
    item.itemText = formEdit.itemText
    item.debitCredit = formEdit.debitCredit
    item.taxCode = formEdit.taxCode
    item.vatAmount = formEdit.vatAmount
    item.costCenter = formEdit.costCenter
    item.profitCenter = formEdit.profitCenter
    item.assignment = formEdit.assignment
    item.whtType = formEdit.whtType
    item.whtCode = formEdit.whtCode
    item.whtBaseAmount = formEdit.whtBaseAmount
    item.whtAmount = formEdit.whtAmount
    resetFormEdit()
  }
}

const resetItem = (item: invoiceItemTypes, index: number) => {
  if (item.isEdit) {
    item.isEdit = !item.isEdit
    resetFormEdit()
  } else {
    if (form) {
      if (form.value.invoiceItem[index].id !== 0) {
        verificationApi.costExpenseTempDelete?.push(form.value.invoiceItem[index].id)
      }
      form.value.invoiceItem.splice(index, 1)
    }
  }
}

const callWhtCode = (data: invoiceItemTypes) => {
  formEdit.whtCode = ''
  formEdit.whtAmount = 0
  data.whtCodeList = []
  invoiceMasterApi.getWhtCode(formEdit.whtType).then(() => {
    data.whtCodeList = whtCodeList.value
  })
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
  if (!form) return
  if (checkIsNonPo()) {
    const checkIsEdit = form.value.invoiceItem.findIndex((item) => item.isEdit)
    if (checkIsEdit !== -1) {
      const percentTax = getPercentTax(formEdit.taxCode) || 0
      const itemAmount = formEdit.itemAmount
      const result = percentTax * itemAmount
      formEdit.vatAmount = result
    } else {
      for (const item of form.value.invoiceItem) {
        const percentTax = getPercentTax(item.taxCode) || 0
        const itemAmount = item.itemAmount
        const result = percentTax * itemAmount
        item.vatAmount = result
      }
    }
  } else {
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
}

const getCostCenterName = (costCenter: string) => {
  const index = costCenterList.value.findIndex((item) => item.code === costCenter)
  if (index !== -1) {
    const data = costCenterList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1)
    return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
}

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getDebitCreditName = (code: string) => {
  if (code === 'K') return 'Credit'
  else if (code === 'D') return 'Debit'
  else return '-'
}

const getWhtTypeName = (code: string) => {
  const index = whtTypeList.value.findIndex((item) => item.code === code)
  if (index !== -1) {
    const data = whtTypeList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getWhtCodeName = (code: string, data: invoiceItemTypes) => {
  const index = data.whtCodeList.findIndex((item) => item.whtCode === code)
  if (index !== -1) {
    const detailData = data.whtCodeList[index]
    return `${detailData.whtCode} - ${detailData.description}`
  }
  return '-'
}

const setWhtAmount = (data: invoiceItemTypes) => {
  if (formEdit.whtCode) {
    const whtlist = data.whtCodeList || []
    const indexWht = whtlist.findIndex((item) => item.whtCode === formEdit.whtCode)
    if (indexWht !== -1) {
      const tarif = whtlist[indexWht].tarif / 100
      formEdit.whtAmount = tarif * formEdit.whtBaseAmount
    }
  } else {
    formEdit.whtAmount = 0
  }
}

watch(
  () => [form?.value.additionalCosts, form?.value.currCode, formEdit],
  () => {
    if (!checkPoPib()) getVatAmount()
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  for (const item of form.value.invoiceItem) {
    if (item.whtCode) {
      invoiceMasterApi.getWhtCode(item.whtType).then(() => {
        item.whtCodeList = whtCodeList.value
      })
    }
  }

  if (checkNonPoPettyCash()) {
    columns.value = [
    'Action',
    'Activity / Expense',
    'Item Amount',
    'Item Text',
    'Tax Code',
    'VAT Amount',
    'Profit Center',
    'Assignment'
    ]
  }
})
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
