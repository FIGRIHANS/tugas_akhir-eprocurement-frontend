<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Invoice PO & GR Item</p>
    <button class="btn btn-outline btn-primary w-fit" @click="addNew">
      <i class="ki-duotone ki-plus-circle"></i>
      Add PO & GR
    </button>
    <div v-if="form" class="overflow-x-auto pogr__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form.invoicePoGrError }">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="pogr__field-base"
              :class="{
                'pogr__field-base--description': item.toLowerCase() === 'description',
                'pogr__field-base--auxiliary': item.toLowerCase() === 'auxiliary part id'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
            <td>
              <input v-model="item.line" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.quantity" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.uom" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.price" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.part" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.auxiliaryPartId" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.description" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.subTotal" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.taxCode" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.vatAmount" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.wht" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.whtAmount" class="input" placeholder="" type="text"/>
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
  'Line',
  'Quantity',
  'UOM',
  'Price',
  'Part',
  'Auxiliary Part ID',
  'Description',
  'Subtotal',
  'Tax Code',
  'VAT Amount',
  'WHT',
  'WHT Amount'
])

const form = inject<formTypes>('form')

const addNew = () => {
  if (form) {
    const data = {
      line: '',
      quantity: '',
      uom: '',
      price: '',
      part: '',
      auxiliaryPartId: '',
      subTotal: '',
      taxCode: '',
      vatAmount: '',
      wht: '',
      whtAmount: '',
      description: ''
    }
    form.invoicePoGr.push(data)
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/invoice-po-gr.scss';
</style>
