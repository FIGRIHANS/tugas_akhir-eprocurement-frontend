<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div>
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index" class="table-head">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index">
            <td>{{ item.line }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.uom }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.part }}</td>
            <td>{{ item.auxiliaryPartId }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.subTotal }}</td>
            <td>{{ item.taxCode }}</td>
            <td>{{ item.vatAmount }}</td>
            <td>{{ item.wht }}</td>
            <td>{{ item.whtAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')

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
</script>
