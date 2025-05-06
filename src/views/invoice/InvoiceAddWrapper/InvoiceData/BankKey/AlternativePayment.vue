<template>
  <div v-if="form">
    <!-- Account Name -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Account Name
      </label>
      <input v-model="form.accountName" class="input" placeholder=""/>
    </div>
    <!-- No. NPWP -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        No. NPWP
      </label>
      <input v-model="form.npwpNumber" class="input" placeholder=""/>
    </div>
    <!-- Bank Name -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Name
      </label>
      <input v-model="form.bankNameNew" class="input" placeholder=""/>
    </div>
    <!-- No. Rekening -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        No. Rekening
      </label>
      <input v-model="form.bankAccountNumberNew" class="input" placeholder=""/>
    </div>
    <!-- Bank Address -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Address
      </label>
      <textarea v-model="form.bankAddressNew" class="textarea" placeholder="" rows="6"></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>