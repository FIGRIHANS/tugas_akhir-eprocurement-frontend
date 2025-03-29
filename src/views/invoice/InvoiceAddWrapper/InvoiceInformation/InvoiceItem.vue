<template>
  <div id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Invoice Item</p>
    <button v-if="form?.status === 0" class="btn btn-outline btn-primary w-fit" @click="addNew">
      <i class="ki-duotone ki-plus-circle"></i>
      Add Line Item
    </button>
    <div v-if="form" class="overflow-x-auto pogr__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="pogr__field-base"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoiceItem" :key="index" class="pogr__field-items">
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
              <input v-if="editAll(item)" v-model="item.activity" class="input w-[150px]" placeholder="" disabled/>
              <div v-else :id="`invoice-activity-dropdown-${index}`" :ref="(el) => { dropdownActivity[index] = el as HTMLElement }" class="dropdown">
                <div class="input">
                  <input
                    v-model="item.activity"
                    placeholder="Search Activity"
                    class="dropdown-toggle w-[100px]"
                    @click="handleInput(index, item.activity)"
                    @input="handleInput(index, item.activity)"
                  />
                  <i class="ki-outline ki-magnifier"></i>
                </div>
                <div :id="`invoice-activity-items-${index}`" class="dropdown-content w-full max-w-56">
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
              <input v-if="editAll(item)" v-model="item.glAccount" class="input w-[150px]" placeholder="" disabled/>
              <div v-else :id="`invoice-gl-dropdown-${index}`" :ref="(el) => { dropdownGl[index] = el as HTMLElement }" class="dropdown">
                <div class="input">
                  <input
                    v-model="item.glAccount"
                    placeholder="Search G/L Account"
                    class="dropdown-toggle w-[100px]"
                    @click="handleInputGl(index, item.glAccount)"
                    @input="handleInputGl(index, item.glAccount)"
                  />
                  <i class="ki-outline ki-magnifier"></i>
                </div>
                <div :id="`invoice-gl-items-${index}`" class="dropdown-content w-full max-w-56">
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
              <input v-if="editAll(item)" v-model="item.item" class="input" placeholder="" disabled/>
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
              <input v-model="item.quantity" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.uom" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.costCenter" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.costPerUnit" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.totalCost" class="input" placeholder="" disabled/>
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
              <input v-if="editAll(item)" v-model="item.vat" class="input" placeholder="" disabled/>
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
              <input v-model="item.otherDpp" class="input" placeholder=""/>
            </td>
            <td>
              <input v-model="item.amount" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.invoiceDueDate" class="input" placeholder="" :disabled="editAll(item)"/>
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
import { KTDropdown } from '@/metronic/core'
import type { invoiceItemTypes } from '../../types/invoiceItem'

const dropdownActivity = ref<HTMLElement[]>([])
const dropdownActivityInstance = ref<(KTDropdown | null)[]>([])
const dropdownGl = ref<HTMLElement[]>([])
const dropdownGlInstance = ref<(KTDropdown | null)[]>([])
const columns = ref<string[]>([
  'Action',
  'Activity',
  'G/L Account',
  'Item',
  'QTY',
  'UoM',
  'Cost Center',
  'Cost Per Unit',
  'Total Cost',
  'WHT Type',
  'WHT Code',
  'DPP',
  'WHT Value',
  'VAT',
  'DPP Lain-Lain',
  'Amount',
  'Invoice Due Date'
])

const form = inject<formTypes>('form')

const addNew = () => {
  if (form) {
    const data = {
      activity: '',
      glAccount: '',
      item: '',
      quantity: '',
      uom: '',
      costCenter: '',
      costPerUnit: '',
      totalCost: '',
      whtType: '',
      whtCode: '',
      dpp: '',
      whtValue: '',
      vat: '',
      otherDpp: '',
      amount: '',
      invoiceDueDate: '',
      isEdit: false
    }
    form.invoiceItem.push(data)
  }
}

const editAll = (item: invoiceItemTypes) => {
  return !item.isEdit
}

const handleInput = (index: number, value: string) => {
  if (value.length >= 4) {
    dropdownActivityInstance.value[index]?.show()
  } else {
    dropdownActivityInstance.value[index]?.hide()
  }
}

const handleInputGl = (index: number, value: string) => {
  if (value.length >= 4) {
    dropdownGlInstance.value[index]?.show()
  } else {
    dropdownGlInstance.value[index]?.hide()
  }
}

const selectItem = (index: number) => {
  dropdownActivityInstance.value[index]?.hide()
}

const handleClickOutside = (event: MouseEvent) => {
  dropdownActivity.value.forEach((el, index) => {
    if (el && !el.contains(event.target as Node)) {
      dropdownActivityInstance.value[index]?.hide()
    }
  })
  dropdownGl.value.forEach((el, index) => {
    if (el && !el.contains(event.target as Node)) {
      dropdownGlInstance.value[index]?.hide()
    }
  })
}

watch(
  () => dropdownActivity.value,
  () => {
    nextTick(() => {
      dropdownActivityInstance.value.forEach((instance) => {
        if (instance) {
          instance.dispose()
        }
      })
      dropdownActivity.value.forEach((el, index) => {
        if (el) {
          dropdownActivityInstance.value[index] = KTDropdown.getInstance(el) || new KTDropdown(el)
        }
      })
    })
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => dropdownGl.value,
  () => {
    nextTick(() => {
      dropdownGlInstance.value.forEach((instance) => {
        if (instance) {
          instance.dispose()
        }
      })
      dropdownGl.value.forEach((el, index) => {
        if (el) {
          dropdownGlInstance.value[index] = KTDropdown.getInstance(el) || new KTDropdown(el)
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '../../styles/invoice-po-gr.scss';
</style>
