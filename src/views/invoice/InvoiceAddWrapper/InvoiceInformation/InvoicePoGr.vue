<template>
  <div v-if="form" id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">{{ form?.invoiceDp === '9012' ? 'Invoice PO Item' : 'Invoice PO & GR Item' }}</p>
    <div>
      <div class="flex items-center gap-[10px]">
        <div class="relative max-w-[250px]">
          <label class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]">
            Reference Number
          </label>
          <div class="input">
            <input v-model="search" placeholder="" type="number" @keypress="searchEnter" @disabled="form.invoicePoGr.length > 0"/>
            <i class="ki-outline ki-magnifier"></i>
          </div>
        </div>
        <button class="btn btn-outline btn-primary" @click="searchItem" :disabled="isDisabledSearch">
          Search
        </button>
      </div>
      <p v-if="searchError" class="text-danger text-[9px]">*PO Number must be exactly 10 characters long</p>
      <p v-if="searchDpAvailableError" class="text-danger text-[9px]">*PO Number not available for DP</p>
      <p v-if="isSearch && !searchDpAvailableError" class="text-success text-[9px]">*PO Number available for DP</p>
    </div>
    <div v-if="form" class="overflow-x-auto pogr__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="pogr__field-base"
              :class="{
                'pogr__field-base--po-item': item.toLowerCase() === 'item text'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="form.invoicePoGr.length === 0">
            <td colspan="11" class="text-center text-[13px]">No Data Available</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
              <td class="flex items-center justify-around gap-[8px]">
                <button class="btn btn-outline btn-icon btn-primary" @click="goEdit(item)">
                  <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                  <i v-else class="ki-duotone ki-check-circle"></i>
                </button>
                <button v-if="form.status === 0 || form.status === -1 || form.status === 5" class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                  <i class="ki-duotone ki-cross-circle"></i>
                </button>
              </td>
              <td>{{ item.poNo }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentDate }}</td>
              <td v-if="!checkInvoiceDp()">{{ form.currency === item.currencyLC ? useFormatIdr(item.itemAmountLC) : useFormatUsd(item.itemAmountTC) }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.uom }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.conditionTypeDesc || '-' }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.qcStatus || '-' }}</td>
              <td v-if="checkInvoiceDp()">
                <span v-if="!item.isEdit">{{ useFormatIdr(item.itemAmountLC) }}</span>
                <input v-else v-model="formEdit.itemAmountLC" type="number" />
              </td>
              <td>
                <span v-if="(checkInvoiceDp() && item.isEdit) || !checkInvoiceDp()">{{ item.taxCode || '-' }}</span>
                <select v-if="checkInvoiceDp() && item.isEdit" v-model="formEdit.taxCode" class="select" placeholder="">
                  <option v-for="(option, index) in listTaxCalculation" :key="index" :value="option.code">
                    {{ option.code }}
                  </option>
                </select>
              </td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.department }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <SearchPoGr :currency="form?.currency || ''" :is-invoice-dp="form?.invoiceDp" :is-po-pib="form?.invoiceType === 'pib'" @setItem="setItemPoGr" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { KTModal } from '@/metronic/core'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import SearchPoGr from './InvoicePoGr/SearchPoGr.vue'
import type { PoGrSearchTypes, itemsPoGrType } from '../../types/invoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceApi = useInvoiceSubmissionStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const columns = ref<string[]>([])
const search = ref<number | null>(null)
const searchError = ref<boolean>(false)
const searchDpAvailableError = ref<boolean>(false)
const isSearch = ref<boolean>(false)
const isDisabledSearch = ref<boolean>(false)

const formEdit = reactive({
  itemAmountLC: 0,
  taxCode: '',
})

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)

const searchEnter = (event: KeyboardEvent) => {
  if (isDisabledSearch.value) return
  if (event.key === 'Enter') {
    searchItem()
  }
}

const searchItem = () => {
  if (checkInvoiceDp()) {
    addItemInvoiceDp()
  } else {
    openAddItem()
  }
}

const addItemInvoiceDp = () => {
  const poNumber = search.value?.toString() ?? ''
  isDisabledSearch.value = true
  invoiceApi.getAvailableDp(poNumber, form?.vendorId || '')
    .then((response) => {
      if (response.statusCode === 200) {
        if (response.result.content.isAvailable && form) {
          if (form.invoicePoGr.length > 0) {
            form.invoicePoGr[0].poNo = search.value?.toString() || ''
          } else {
            const data = {
              poNo: search.value?.toString(),
              poItem: 0,
              grDocumentNo: '',
              grDocumentItem: 0,
              grDocumentDate: '',
              taxCode: '',
              currencyLC: '',
              currencyTC: '',
              itemAmountLC: 0,
              itemAmountTC: 0,
              quantity: 0,
              uom: '',
              itemText: '',
              currency: '',
              conditionType: '',
              conditionTypeDesc: '',
              qcStatus: '',
              postingDate: '',
              enteredOn: '',
              purchasingOrg: '',
              department: '',
              isEdit: false
            } as itemsPoGrType
  
            form.invoicePoGr.push(data)
          }
        } else {
          searchDpAvailableError.value = true
        }
      }
    })
    .finally(() => {
      isSearch.value = true
      isDisabledSearch.value = false
    })
}

const openAddItem = () => {
  if (search.value) {
    if (search.value.toString().length !== 10) return searchError.value = true
    else searchError.value = false
    if (form) {
      if (!form.vendorId  || !form.companyCode) {
        form.companyCodeError = true
        return
      } else {
        form.companyCodeError = false
      }
    }
    if (search.value.toString().length !== 10) return
    invoiceApi.getPoGr(search.value.toString(), form?.companyCode || '', form?.vendorId || '')
    const idModal = document.querySelector('#add_po_gr_item_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
  }
}

const checkInvoiceDp = () => {
  return form?.invoiceDp === '9012'
}

const checkPoPib = () => {
  return form?.invoiceType === '902'
}

const deleteItem = (index: number) => {
  if (form) {
    if (form.invoicePoGr[index].isEdit) {
      resetItem(form.invoicePoGr[index])
    } else {
      form.invoicePoGr.splice(index, 1)
    }
  }
}

const setColumn = () => {
  if (form?.invoiceType === '902') columns.value = ['Action', ...PoPibColumn]
  else if (form?.invoiceDp === '9012') columns.value = ['Action', ...invoiceDpColumn]
  else columns.value = ['Action', ...defaultColumn]
}

const setItemPoGr = (items: PoGrSearchTypes[]) => {
  for (const item of items) {
    const data = {
      poNo: item.poNo,
      poItem: item.poItem,
      grDocumentNo: item.grDocumentNo,
      grDocumentItem: item.grDocumentItem,
      grDocumentDate: item.grDocumentDate,
      taxCode: item.taxCode,
      currencyLC: item.currencyLC,
      currencyTC: item.currencyTC,
      itemAmountLC: item.itemAmountLC,
      itemAmountTC: item.itemAmountTC,
      quantity: item.quantity,
      uom: item.unit,
      itemText: item.itemText,
      currency: item.currency,
      conditionType: item.conditionType,
      conditionTypeDesc: item.conditionTypeDesc,
      qcStatus: item.qcStatus,
      postingDate: item.postingDate,
      enteredOn: item.enteredOn,
      purchasingOrg: item.purchasingOrg,
      department: item.department,
      isEdit: false
    } as itemsPoGrType

    form?.invoicePoGr.push(data)
  }
  if (form) invoiceApi.getRemainingDp(form.invoicePoGr[0].poNo)
    .then((response) => {
      if (response.statusCode === 200) {
        form.remainingDpAmount = useFormatIdr(response.result.content.remainingDPAmount.toString())
      }
    })
}

const resetFormEdit = () => {
  formEdit.taxCode = ''
  formEdit.itemAmountLC = 0
}

const goEdit = (item: itemsPoGrType) => {
  item.isEdit = !item.isEdit

  if (item.isEdit) {
    formEdit.taxCode = item.taxCode
    formEdit.itemAmountLC = item.itemAmountLC
  } else {
    item.taxCode = formEdit.taxCode
    item.itemAmountLC = formEdit.itemAmountLC
    resetFormEdit()
  }
}

const resetItem = (item: itemsPoGrType) => {
  item.isEdit = !item.isEdit
  resetFormEdit()
}

watch(
  () => [form?.invoiceDp, form?.invoiceType],
  () => {
    setColumn()
  },
  {
    immediate: true
  }
)

onMounted(() => {
  setColumn()
})
</script>

<style lang="scss" scoped>
@use '../../styles/invoice-po-gr.scss';
</style>
