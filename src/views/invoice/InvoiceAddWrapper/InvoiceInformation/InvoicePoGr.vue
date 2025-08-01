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
                'pogr__field-base--po-item': item.toLowerCase() === 'item text'
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
                  <button v-if="checkInvoiceDp()" class="btn btn-outline btn-icon btn-primary" @click="goEdit(item)">
                    <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                    <i v-else class="ki-duotone ki-check-circle"></i>
                  </button>
                  <button v-if="(form.status === 0 || form.status === -1 || form.status === 5) && !checkInvoiceDp()"
                    class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                    <i class="ki-duotone ki-cross-circle"></i>
                  </button>
                </td>
                <td>
                  <span v-if="!item.isEdit">{{ item.poNo }}</span>
                  <div v-else>
                    <div class="input" :class="{ 'border-danger': item.poNoError }">
                      <input v-model="item.poNo" placeholder="" @keypress="searchEnter" />
                      <i class="ki-filled ki-magnifier"></i>
                    </div>
                    <p v-if="searchDpAvailableError" class="text-danger text-[9px]">*PO Number not available for DP</p>
                    <p v-if="isSearch && !searchDpAvailableError" class="text-success text-[9px]">*PO Number available for DP</p>
                  </div>
                </td>
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
                  <input v-else v-model="formEdit.itemAmountLC" type="number" class="input" />
                </td>
                <td>
                  <span v-if="(checkInvoiceDp() && !item.isEdit) || !checkInvoiceDp()">{{ item.taxCode || '-' }}</span>
                  <select v-if="checkInvoiceDp() && item.isEdit" v-model="formEdit.taxCode" class="select" placeholder="">
                    <option v-for="(option, index) in listTaxCalculation" :key="index" :value="option.code">
                      {{ option.code }}
                    </option>
                  </select>
                </td>
                <td v-if="!checkPoPib()">
                  <span v-if="item.isEdit">{{ form?.currency === item.currencyLC ? useFormatIdr(formEdit.vatAmount) : useFormatUsd(formEdit.vatAmount) }}</span>
                  <span v-else>{{ form?.currency === item.currencyLC ? useFormatIdr(item.vatAmount || 0) : useFormatUsd(item.vatAmount || 0) }}</span>
                </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td v-if="!checkInvoiceDp()">-</td>
                <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.department }}</td>
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
                  <input v-else v-model="item.poNo" class="input" placeholder=""
                    :class="{ 'border-danger': item.poNoError }" @change="item.poNoError = false" />
                  <p v-if="item.poNoError" class="text-danger text-[9px]">*PO Number must be at least 10 digits</p>
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.poItem }}</span>
                  <input v-else v-model="item.poItem" class="input" placeholder=""
                    :class="{ 'border-danger': item.poItemError }" @change="item.poItemError = false" />
                  <p v-if="item.poItemError" class="text-danger text-[9px]">*PO Item must be at least 2 digits</p>
                </td>
                <td v-if="!checkInvoiceDp()">{{ item.itemAmountLC }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.uom || '-' }}</td>
                <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.department || '-' }}</span>
                  
                  <select v-else v-model="item.department" class="select" name="select">
                    <option v-for="item of costCenterList" :key="item.code" :value="item.code">
                      {{ item.code }}
                    </option>
                  </select>

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
import { defaultColumn, invoiceDpColumn, PoPibColumn, manualAddColumn } from '@/static/invoicePoGr'
import SearchPoGr from './InvoicePoGr/SearchPoGr.vue'
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
  if (form?.invoiceType === '903') columns.value = ['Action', ...PoPibColumn]
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
      isEdit: false
    } as itemsPoGrType

    form?.invoicePoGr.push(data)

    if (form?.invoicePoGr.length === 1) {
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
  if ((checkInvoiceDp() && searchDpAvailableError.value) || (!isSearch.value && item.isEdit)) return
  item.isEdit = !item.isEdit
  if (item.isEdit) {
    formEdit.taxCode = item.taxCode
    formEdit.itemAmountLC = item.itemAmountLC
    if (checkInvoiceDp()) formEdit.vatAmount = item.vatAmount || 0
  } else {
    item.taxCode = formEdit.taxCode
    item.itemAmountLC = formEdit.itemAmountLC
    if (checkInvoiceDp()) item.vatAmount = formEdit.vatAmount
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
      poNoError: false
    }
    form.invoicePoGr.push(data)
  }
}

const editForm = (index: number) => {

  if (form) {
    const data = form.invoicePoGr[index]
    data.poNoError = false
    data.poItemError = false
    if (data.poNo.length !== 10) {
      data.poNoError = true
    }

    if (data.poItem.toString().length < 2) {
      data.poItemError = true
    }

    if (!data.poItemError && !data.poNoError) {
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
  const percentTax = getPercentTax(formEdit.taxCode) || 0
  const itemAmount = formEdit.itemAmountLC
  console.log(percentTax)
  console.log(itemAmount)
  const result = percentTax * itemAmount
  formEdit.vatAmount = result
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
  () => [form?.invoicePoGr, formEdit],
  () => {
    if (checkInvoiceDp()) {
      getVatAmount()
    }
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
