<template>
  <div class="flex-1">
    <div class="border-b border-gray-200 gap-[8px] p-[10px] flex items-center">
      <i class="ki-duotone ki-document text-gray-600 text-xl"></i>
      <span class="font-medium">General Data</span>
    </div>
    <div v-if="form" class="py-[8px] px-[16px]">
      <!-- Nama Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Nama Vendor
        </label>
        <select v-model="form.vendorId" class="select" :class="{ 'border-danger': form.vendorIdError }">
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
      </div>
      <!-- Bidang Usaha -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bidang Usaha
        </label>
        <input v-model="form.businessField" class="input" placeholder="" disabled/>
      </div>
      <!-- Sub Bidang  Usaha -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Sub Bidang  Usaha
        </label>
        <input v-model="form.subBusinessField" class="input" placeholder="" disabled/>
      </div>
      <!-- Alamat -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Alamat
        </label>
        <textarea v-model="form.address" class="textarea" placeholder="" rows="6" disabled></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>
