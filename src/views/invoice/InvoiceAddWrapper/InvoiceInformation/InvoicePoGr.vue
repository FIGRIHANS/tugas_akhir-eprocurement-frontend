<template>
  <div id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Invoice PO & GR Item</p>
    <button v-if="form?.status === 0" class="btn btn-outline btn-primary w-fit" @click="addNew">
      <i class="ki-duotone ki-plus-circle"></i>
      Add PO & GR
    </button>
    <div v-if="form" class="overflow-x-auto pogr__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="pogr__field-base"
              :class="{
                'pogr__field-base--po-sap': item.toLowerCase() === 'po number sap'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button v-if="form.status === 0" class="btn btn-icon btn-primary" @click="item.isEdit = !item.isEdit">
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button v-if="form.status === 0" class="btn btn-icon btn-outline btn-danger">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <input v-if="editAll(item)" v-model="item.grNumber" class="input w-[150px]" placeholder="" disabled/>
              <div v-else :id="`invoice-gr-dropdown-${index}`" :ref="(el) => { dropdownGr[index] = el as HTMLElement }" class="dropdown">
                <div class="input">
                  <input
                    v-model="item.grNumber"
                    placeholder="Search No GR"
                    class="dropdown-toggle w-[100px]"
                    @click="handleInput(index, item.grNumber)"
                    @input="handleInput(index, item.grNumber)"
                  />
                  <i class="ki-outline ki-magnifier"></i>
                </div>
                <div :id="`invoice-gr-items-${index}`" class="dropdown-content w-full max-w-56">
                  <div class="flex flex-col">
                    <div
                      class="border-b p-4 cursor-pointer hover:bg-primary hover:text-white"
                      @click="selectItem(index)"
                    >
                      Option 1
                    </div>
                    <div
                      class="border-b p-4 cursor-pointer hover:bg-primary hover:text-white"
                      @click="selectItem(index)"
                    >
                      Option 2
                    </div>
                    <div
                      class="border-b p-4 cursor-pointer hover:bg-primary hover:text-white"
                      @click="selectItem(index)"
                    >
                      Option 3
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <input v-model="item.poNumber" class="input" placeholder="" :disabled="editAll(item)"/>
            </td>
            <td>
              <input v-model="item.poSapNumber" class="input" placeholder="" :disabled="editInvoiceDp(item)"/>
            </td>
            <td>
              <input v-if="editAll(item)" v-model="item.poSapNumber" class="input" placeholder="" disabled/>
              <select v-else v-model="item.item" class="select">
                <option value="1">
                  Option 1
                </option>
                <option value="2">
                  Option 2
                </option>
                <option value="3">
                  Option 3
                </option>
              </select>
            </td>
            <td>
              <input v-model="item.quantity" class="input" placeholder="" :disabled="editInvoiceDp(item)"/>
            </td>
            <td>
              <input v-model="item.uom" class="input" placeholder="" :disabled="editInvoiceDp(item)"/>
            </td>
            <td>
              <input v-model="item.costPerUnit" class="input" placeholder="" :disabled="editInvoiceDp(item)"/>
            </td>
            <td>
              <input v-model="item.totalCost" class="input" placeholder="" :disabled="editInvoiceDp(item)"/>
            </td>
            <td v-if="form?.invoiceDp">
              <input v-if="editAll(item)" v-model="item.installmentCost" class="input" placeholder="" disabled/>
              <select v-else v-model="item.installmentCost" class="select">
                <option value="1">
                  Option 1
                </option>
                <option value="2">
                  Option 2
                </option>
                <option value="3">
                  Option 3
                </option>
              </select>
            </td>
            <td>
              <input v-model="item.deliveryDate" class="input" placeholder="" :disabled="editAll(item)"/>
            </td>
            <td>
              <input v-model="item.billable" class="input" placeholder="" :disabled="editInvoiceDp(item)"/>
            </td>
            <td>
              <input v-model="item.dpPercent" class="input" placeholder="" :disabled="editInvoiceDpWithDp(item)"/>
            </td>
            <td>
              <input v-model="item.dpValue" class="input" placeholder="" :disabled="editInvoiceDpWithDp(item)"/>
            </td>
            <td>
              <input v-model="item.whtType" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.whtCode" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.dpp" class="input" placeholder="" :disabled="editAll(item)"/>
            </td>
            <td>
              <input v-model="item.whtValue" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-if="editAll(item)" v-model="item.whtValue" class="input" placeholder="" disabled/>
              <select v-else v-model="item.vat" class="select">
                <option value="1">
                  Option 1
                </option>
                <option value="2">
                  Option 2
                </option>
                <option value="3">
                  Option 3
                </option>
              </select>
            </td>
            <td>
              <input v-model="item.otherDpp" class="input" placeholder="" :disabled="editAll"/>
            </td>
            <td>
              <input v-model="item.amount" class="input" placeholder="" disabled/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, watch, onMounted, nextTick, onUnmounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import type { itemsPoGrType } from '../../types/invoicePoGr'
import { KTDropdown } from '@/metronic/core'
import { defaultColumn, invoiceDpColumn } from '@/static/invoicePoGr'

const dropdownGr = ref<HTMLElement[]>([])
const dropdownGrInstance = ref<(KTDropdown | null)[]>([])
const columns = ref<string[]>([])

const form = inject<formTypes>('form')

const addNew = () => {
  if (form) {
    const data = {
      grNumber: '',
      poNumber: '',
      poSapNumber: '',
      item: '',
      quantity: '',
      uom: '',
      costPerUnit: '',
      totalCost: '',
      installmentCost: '',
      deliveryDate: '',
      billable: '',
      dpPercent: '',
      dpValue: '',
      whtType: '',
      whtCode: '',
      dpp: '',
      whtValue: '',
      vat: '',
      otherDpp: '',
      amount: '',
      isEdit: false
    }
    form.invoicePoGr.push(data)
  }
}

const editAll = (item: itemsPoGrType) => {
  return !item.isEdit
}

const editInvoiceDp = (item: itemsPoGrType) => {
  return !item.isEdit && !form?.invoiceDp
}

const editInvoiceDpWithDp = (item: itemsPoGrType) => {
  return !item.isEdit && !form?.invoiceDp && !form?.withDp
}

const handleInput = (index: number, value: string) => {
  if (value.length >= 4) {
    dropdownGrInstance.value[index]?.show()
  } else {
    dropdownGrInstance.value[index]?.hide()
  }
}

const selectItem = (index: number) => {
  dropdownGrInstance.value[index]?.hide()
}

const handleClickOutside = (event: MouseEvent) => {
  dropdownGr.value.forEach((el, index) => {
    if (el && !el.contains(event.target as Node)) {
      dropdownGrInstance.value[index]?.hide()
    }
  })
}

watch(
  () => form?.invoiceDp,
  () => {
    if (form?.invoiceDp) {
      columns.value = ['Action', ...invoiceDpColumn]
    } else {
      columns.value = ['Action', ...defaultColumn]
    }
  }
)

watch(
  () => dropdownGr.value,
  () => {
    nextTick(() => {
      dropdownGrInstance.value.forEach((instance) => {
        if (instance) {
          instance.dispose()
        }
      })
      dropdownGr.value.forEach((el, index) => {
        if (el) {
          dropdownGrInstance.value[index] = KTDropdown.getInstance(el) || new KTDropdown(el)
        }
      })
    })
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  columns.value = ['Action', ...defaultColumn]
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '../../styles/invoice-po-gr.scss';
</style>
