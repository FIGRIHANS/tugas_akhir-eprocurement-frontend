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
                'cost__field-base--description': item.toLowerCase() === 'description'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCost" :key="index" class="cost__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button class="btn btn-icon btn-primary" @click="item.isEdit = !item.isEdit">
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button class="btn btn-icon btn-outline btn-danger">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.type" class="input" placeholder="" disabled/>
              <select v-else v-model="item.type" class="select" placeholder="">
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
              <input v-model="item.gl" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.costCenter" class="input" placeholder="" disabled/>
              <select v-else v-model="item.costCenter" class="select" placeholder="">
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
              <input v-model="item.quantity" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-model="item.uom" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-model="item.costPerUnit" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-model="item.totalCost" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.pphType" class="input" placeholder="" disabled/>
              <select v-else v-model="item.pphType" class="select" placeholder="">
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
              <input v-model="item.pphCode" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.dpp" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-model="item.pphValue" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.vat" class="input" placeholder="" disabled/>
              <select v-else v-model="item.vat" class="select" placeholder="">
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
              <input v-model="item.otherDpp" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-model="item.amount" class="input" placeholder="" disabled/>
            </td>
            <td>
              <input v-model="item.remark" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const columns = ref([
  'Action',
  'Jenis',
  'GL',
  'Cost Center',
  'QTY',
  'UoM',
  'Cost Per Unit',
  'Total Cost',
  'Tipe PPH',
  'Kode PPH',
  'DPP',
  'Nilai PPH',
  'VAT',
  'DPP Lain - Lain',
  'Amount',
  'Remark'
])

const form = inject<formTypes>('form')

const addNew = () => {
  if (form) {
    const data = {
      type: '',
      gl: '',
      costCenter: '',
      quantity: '',
      uom: '',
      costPerUnit: '',
      totalCost: '',
      pphType: '',
      pphCode: '',
      dpp: '',
      pphValue: '',
      vat: '',
      otherDpp: '',
      amount: '',
      remark: '',
      isEdit: false
    }
    form.additionalCost.push(data)
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
