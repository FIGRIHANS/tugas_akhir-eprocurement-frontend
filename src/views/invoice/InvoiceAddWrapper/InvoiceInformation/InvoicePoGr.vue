<template>
  <div v-if="form" id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">{{ form?.invoiceDp === '9012' ? 'Invoice PO' : 'Invoice PO & GR Item' }}</p>

    <div v-if="form?.invoiceType !== '902' && !checkInvoiceDp()">
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
    </div>
    <div v-if="form.invoiceType === '902'">
      <button class="btn btn-outline btn-primary" @click="addNewPodata">
        <i class="ki-duotone ki-plus-circle"></i>
        Add Line Item
      </button>
    </div>

    <!-- Invoice PO & GR Item By Search Table  -->

    <div v-if="form?.invoiceType !== '902'">
      <div v-if="form" class="overflow-x-auto pogr__table">
        <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
          <thead>
            <tr>
              <th v-for="(item, index) in columns" :key="index" class="pogr__field-base" :class="{
                'pogr__field-base--po-item': item.toLowerCase() === 'item text',
                'pogr__field-base--tax': item.toLowerCase() === 'tax code',
              }">
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
                  <button class="btn btn-outline btn-icon btn-primary" :disabled="checkIsEdit() && !item.isEdit" @click="goEdit(item)">
                    <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                    <i v-else class="ki-duotone ki-check-circle"></i>
                  </button>
                  <button v-if="(form.status === 0 || form.status === -1 || form.status === 5) && !checkInvoiceDp()"
                    class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                    <i class="ki-duotone ki-cross-circle"></i>
                  </button>
                </td>
                <td>
                  <span v-if="(!item.isEdit && checkInvoiceDp()) || !checkInvoiceDp()">{{ item.poNo }}</span>
                  <div v-if="item.isEdit && checkInvoiceDp()">
                    <div class="input" :class="{ 'border-danger': item.poNoError }">
                      <input v-model="item.poNo" placeholder="" type="number" @keypress="searchEnter" />
                      <i class="ki-filled ki-magnifier"></i>
                    </div>
                    <p v-if="searchError" class="text-danger text-[9px]">*PO Number must be exactly 10 characters long</p>
                    <p v-if="searchDpAvailableError" class="text-danger text-[9px]">*PO Number not available for DP</p>
                    <p v-if="isSearch && !searchDpAvailableError" class="text-success text-[9px]">*PO Number available for DP</p>
                  </div>
                </td>
                <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
                <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo }}</td>
                <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem }}</td>
                <td v-if="!checkInvoiceDp() && !checkPoPib()">
                  {{ form.status === 5 ? moment(item.grDocumentDate).format('YYYY') : item.grDocumentDate ? moment(item.grDocumentDate).format('YYYY/MM/DD') : item.grDocumentDate }}
                </td>
                <td v-if="!checkInvoiceDp()">{{ form.currency === item.currencyLC ? useFormatIdr(item.itemAmountLC) : useFormatUsd(item.itemAmountTC) }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.uom }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
                <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.conditionTypeDesc || '-' }}</td>
                <td v-if="form?.invoiceType === '903'">{{ getTaxCodeName(item.taxCode) || '-' }}</td>
                <td v-if="!checkInvoiceDp() && form?.invoiceType !== '903'">{{ item.qcStatus || '-' }}</td>
                <td v-if="form?.invoiceType === '903'">
                  <span v-if="item.isEdit">{{ form?.currency === item.currencyLC ? useFormatIdr(formEdit.vatAmount) : useFormatUsd(formEdit.vatAmount) }}</span>
                  <span v-else>{{ form?.currency === item.currencyLC ? useFormatIdr(item.vatAmount || 0) : useFormatUsd(item.vatAmount || 0) }}</span>
                </td>
                <td v-if="checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ useFormatIdr(item.itemAmountLC) }}</span>
                  <input v-else v-model="formEdit.itemAmountLC" type="number" class="input" />
                </td>
                <td>
                  <span v-if="!item.isEdit">{{ getTaxCodeName(item.taxCode) || '-' }}</span>
                  <v-select
                    v-else
                    v-model="formEdit.taxCode"
                    class="customSelect"
                    :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                    :reduce="(option: any) => option.code"
                    :options="listTaxCalculation"
                    appendToBody
                  ></v-select>
                </td>
                <td v-if="!checkPoPib()">
                  <span v-if="item.isEdit">{{ form?.currency === item.currencyLC ? useFormatIdr(formEdit.vatAmount) : useFormatUsd(formEdit.vatAmount) }}</span>
                  <span v-else>{{ form?.currency === item.currencyLC ? useFormatIdr(item.vatAmount || 0) : useFormatUsd(item.vatAmount || 0) }}</span>
                </td>
                <td v-if="form?.invoiceType !== '903'">-</td>
                <td v-if="form?.invoiceType !== '903'">-</td>
                <td v-if="form?.invoiceType !== '903'">{{ form?.currency === item.currencyLC ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) }}</td>
                <td v-if="!checkInvoiceDp()">-</td>
                <td>{{ item.department || '-' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invoice PO & Gr Add Item Manual -->
    <div v-else>
      <div v-if="form" class="overflow-x-auto pogr__table">
        <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
          <thead>
            <tr>
              <th v-for="(item, index) in columns" :key="index" class="pogr__field-base" :class="{
                'pogr__field-base--po-number': item.toLowerCase() === 'po number',
                'pogr__field-base--po-item': item.toLowerCase() === 'po item',
              }">
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
                  <button class="btn btn-icon btn-primary" @click="editForm(index)">
                    <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                    <i v-else class="ki-duotone ki-check-circle"></i>
                  </button>
                  <button class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                    <i class="ki-duotone ki-cross-circle"></i>
                  </button>
                </td>
                <td>
                  <span v-if="!item.isEdit">{{ item.poNo }}</span>
                  <input type="text" v-else v-model="item.poNo" class="input" placeholder=""
                    :class="{ 'border-danger': item.poNoError }" @change="item.poNoError = false" />
                  <p v-if="item.poNoError" class="text-danger text-[9px]">*PO Number must be at least 10 digits</p>
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.poItem }}</span>
                  <input type="number" v-else v-model="item.poItem" class="input" placeholder=""
                    :class="{ 'border-danger': item.poItemError }" @change="item.poItemError = false" />
                  <p v-if="item.poItemError" class="text-danger text-[9px]">*PO Item must be at least 2 digits</p>
                </td>
                <td v-if="!checkInvoiceDp()">{{ form.currency === item.currencyLC ? useFormatIdr(item.itemAmountLC) : useFormatUsd(item.itemAmountTC) }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.uom || '-' }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.department || '-' }}</span>
                  
                  <select v-else v-model="item.department" class="select" name="select" :class="{ 'border-danger': item.departementError }">
                    <option v-for="item of costCenterList" :key="item.code" :value="item.code">
                      {{ item.code }}
                    </option>
                  </select>
                  <p v-if="item.departementError" class="text-danger text-[9px]">Please Chose Departement</p>
                  <!-- <input v-else v-model="item.department" class="input" placeholder=""
                    :class="{ 'border-danger': item.department }"  /> -->
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <SearchPoGr :currency="form?.currency || ''" :is-invoice-dp="form?.invoiceDp"
      :is-po-pib="form?.invoiceType === 'pib'" @setItem="setItemPoGr" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { KTModal } from '@/metronic/core'
import { defaultColumn, invoiceDpColumn, poCCColumn, manualAddColumn } from '@/static/invoicePoGr'
import SearchPoGr from './InvoicePoGr/SearchPoGr.vue'
import moment from 'moment'
import type { PoGrSearchTypes, itemsPoGrType } from '../../types/invoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const masterDataApi = useInvoiceMasterDataStore()
const invoiceApi = useInvoiceSubmissionStore()
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
  vatAmount: 0
})

const listTaxCalculation = computed(() => masterDataApi.taxList)
const costCenterList = computed(() => masterDataApi.costCenterList)

const checkIsEdit = () => {
  const result = form?.invoicePoGr.findIndex((item) => item.isEdit)
  return result !== -1
}

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
  const poNumber = search.value?.toString() ?? form?.invoicePoGr[0].poNo ?? ''
  if (poNumber.length !== 10) return searchError.value = true
  isDisabledSearch.value = true
  invoiceApi.getAvailableDp(poNumber, form?.vendorId || '', formEdit.itemAmountLC || form?.invoicePoGr[0].itemAmountLC || 0)
    .then((response) => {
      if (response.statusCode === 200) {
        if (!response.result.content.isAvailable && form) {
          searchDpAvailableError.value = true
          form.invoicePoGr[0].department = response.result.content.department
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
      if (!form.vendorId || !form.companyCode) {
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

const checkInvoiceWithDp = () => {  
  return form?.invoiceDp === '9013'
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
  if (form?.invoiceType === '903') columns.value = ['Action', ...poCCColumn]
  else if (form?.invoiceDp === '9012') columns.value = ['Action', ...invoiceDpColumn]
  else if (form?.invoiceType === '902') columns.value = ['Actions', ...manualAddColumn]
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
      whtBaseAmount: form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC,
      isEdit: false
    } as itemsPoGrType

    form?.invoicePoGr.push(data)

    if (form?.invoicePoGr.length === 1 && checkInvoiceWithDp()) {
      const firstItem = form.invoicePoGr[0]
      invoiceApi.getRemainingDp(firstItem.poNo).then((response) => {
        if (response.statusCode === 200) {
          const remaining = response.result.content.remainingDPAmount
          form.remainingDpAmount = form.currency === firstItem.currencyLC ? useFormatIdr(remaining) : useFormatUsd(remaining)
        }
      })
    }
  }
}

const resetFormEdit = () => {
  formEdit.taxCode = ''
  formEdit.itemAmountLC = 0
  formEdit.vatAmount = 0
}

const goEdit = (item: itemsPoGrType) => {
  if ((checkInvoiceDp() && searchDpAvailableError.value || form?.invoiceType === '903') || (checkInvoiceDp() && !isSearch.value && item.isEdit)) return
  item.isEdit = !item.isEdit
  if (item.isEdit) {
    formEdit.taxCode = item.taxCode
    formEdit.itemAmountLC = form?.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC
    formEdit.vatAmount = item.vatAmount || 0
  } else {
    item.taxCode = formEdit.taxCode
    item.vatAmount = formEdit.vatAmount
    if (form?.currency === 'IDR') item.itemAmountLC = formEdit.itemAmountLC
    else item.itemAmountTC = formEdit.itemAmountLC
    item.whtBaseAmount = formEdit.itemAmountLC
    resetFormEdit()
  }
}

const resetItem = (item: itemsPoGrType) => {
  item.isEdit = !item.isEdit
  resetFormEdit()
}

const addNewPodata = () => {
  if (form) {
    if (!form.vendorId || !form.companyCode) {
      form.companyCodeError = true
      return
    } else {
      form.companyCodeError = false
    }
    masterDataApi.getCostCenter(form?.companyCode || '')
    const data = {
      id: 0,
      poNo:'',
      poItem: 0,
      grDocumentNo: '',
      grDocumentItem: 0,
      grDocumentDate: null,
      taxCode: '',
      currencyLC: '',
      currencyTC: '',
      itemAmountLC: 0,
      itemAmountTC: 0,
      quantity: 0,
      uom: '',
      itemText: '',
      currency: '',
      conditionType:'',
      conditionTypeDesc: '',
      qcStatus: '',
      postingDate: null,
      enteredOn: '',
      purchasingOrg: '',
      department:'',
      isEdit: true,
      poItemError: false,
      poNoError: false,
      departementError: false
    }
    form.invoicePoGr.push(data)
  }
}

const editForm = (index: number) => {

  if (form) {
    const data = form.invoicePoGr[index]
    data.poNoError = false
    data.poItemError = false
    data.departementError = false

    if (data.poNo.toString().length != 10) {
      data.poNoError = true
    }

    if (data.poItem.toString().length != 2) {
      data.poItemError = true
    }

    if (data.department === '') {
      data.departementError = true
    }

    if (!data.poItemError && !data.poNoError && !data.departementError) {
      data.isEdit = !data.isEdit
    }
  }
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
  const checkIsEdit = form.invoicePoGr.findIndex((item) => item.isEdit)
  if (checkIsEdit !== -1) {
    const percentTax = getPercentTax(formEdit.taxCode) || 0
    const itemAmount = formEdit.itemAmountLC
    const result = percentTax * itemAmount
    formEdit.vatAmount = result
  } else {
    for (const item of form.invoicePoGr) {
      const percentTax = getPercentTax(item.taxCode) || 0
      const itemAmount = form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC
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

watch(
  () => [form?.invoiceDp, form?.invoiceType],
  () => {
    setColumn()
  },
  {
    immediate: true
  }
)

watch(
  () => form?.invoiceDp,
  () => {
    if (form) {
      form.invoicePoGr = []
      if (checkInvoiceDp()) {
        const data = {
          poNo: '',
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
    }
  }
)

watch(
  () => [form?.invoicePoGr, form?.currency, formEdit],
  () => {
    getVatAmount()
  },
  {
    deep: true,
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
