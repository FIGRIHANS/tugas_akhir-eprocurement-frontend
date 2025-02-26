<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <div class="input w-[250px]">
        <i class="ki-outline ki-magnifier"></i>
        <input v-model="search" placeholder="Cari Invoice" type="text"/>
      </div>
      <button class="btn btn-primary">
        <i class="ki-duotone ki-plus-circle"></i>
        Add Invoice
      </button>
    </div>

    <div class="overflow-x-scroll">
      <table class="table align-middle text-gray-700 font-medium text-sm">
      <thead>
        <tr>
          <th>
            No
          </th>
          <th>
            No Invoice
          </th>
          <th>
            Status
          </th>
          <th>
            No Faktur Pajak
          </th>
          <th>
            Tanggal Faktur
          </th>
          <th>
            Tax Calculation
          </th>
          <th>
            Tax Code
          </th>
          <th>
            WHT Code
          </th>
          <th>
            Payment Term
          </th>
          <th>
            Company
          </th>
          <th>
            Vendor
          </th>
          <th>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            1
          </td>
          <td>
            INV238744
          </td>
          <td>
            <span class="badge badge-outline badge-warning">
              Proses Verifikasi
            </span>
          </td>
          <td>
            7236287634
          </td>
          <td>
            15 Okt 2024
          </td>
          <td>
            Header
          </td>
          <td>
            2766534
          </td>
          <td>
            W2
          </td>
          <td>
            Z045
          </td>
          <td>
            PT Arya Noble
          </td>
          <td>
            PT Pharmacy
          </td>
          <td>
            <button class="btn btn-outline btn-primary">
              <i class="ki-filled ki-eye"></i>
            </button>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const search = ref<string>('')
</script>
