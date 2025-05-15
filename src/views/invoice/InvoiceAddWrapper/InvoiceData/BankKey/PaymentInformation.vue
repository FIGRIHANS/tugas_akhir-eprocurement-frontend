<template>
  <div v-if="form">
    <!-- Bank Key -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Key
      </label>
      <input v-if="form.status !== 0" v-model="form.bankKeyId" class="input" placeholder="" disabled />
      <select v-else v-model="form.bankKeyId" class="select" :class="{ 'border-danger': form.bankKeyIdError }">
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
    <!-- Bank Name -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Name
      </label>
      <input v-model="form.bankNameId" class="input" placeholder="" disabled/>
    </div>
    <!-- Beneficiary Name -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Beneficiary Name
      </label>
      <input v-model="form.beneficiaryName" class="input" placeholder="" disabled/>
    </div>
    <!-- Bank Account Number -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Account Number
      </label>
      <input v-model="form.bankAccountNumber" class="input" placeholder="" disabled/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>