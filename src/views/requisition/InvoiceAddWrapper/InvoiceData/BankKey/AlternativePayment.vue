<template>
  <div v-if="form">
    <div class="flex align-items-center p-[16px]">
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.isAlternativePayee" class="checkbox" name="check" type="checkbox"/>
        Alternative Payee
      </label>
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.isOneTimeVendor" class="checkbox" name="check" type="checkbox"/>
        One Time Vendor
      </label>
    </div>
    <div class="flex">
      <div class="flex-1">
        <!-- Name -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Name
          </label>
          <input v-model="form.nameAlternative" class="input" placeholder=""/>
        </div>
        <!-- Name 2 -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Name 2
          </label>
          <input v-model="form.nameOtherAlternative" class="input" placeholder=""/>
        </div>
        <!-- Street -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Street
          </label>
          <input v-model="form.streetAltiernative" class="input" placeholder=""/>
        </div>
        <!-- City -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            City
          </label>
          <select v-model="form.cityAlternative" class="select">
            <option v-for="item of dummyCity" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Country -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Country
          </label>
          <select v-model="form.countryAlternative" class="select">
            <option v-for="item of dummyCountry" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Bank Account Number -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Account Number
          </label>
          <input v-model="form.bankAccountNumberAlternative" class="input" placeholder=""/>
        </div>
      </div>
      <div class="flex-1">
        <!-- Bank Key -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Key
          </label>
          <input v-model="form.bankKeyAlternative" class="input" placeholder=""/>
        </div>
        <!-- Bank Country -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Country
          </label>
          <input v-model="form.bankCountryAlternative" class="input" placeholder=""/>
        </div>
        <!-- No. NPWP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            No. NPWP
          </label>
          <input v-model="form.npwpNumberAlternative" class="input" placeholder=""/>
        </div>
        <!-- No. KTP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            No. KTP
          </label>
          <input v-model="form.ktpNumberAlternative" class="input" placeholder=""/>
        </div>
        <!-- Email -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Email
          </label>
          <input v-model="form.emailAlternative" class="input" placeholder=""/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')

const dummyCity = ref([
  {
    id: '1',
    name: 'Jakarta'
  },
  {
    id: '2',
    name: 'Tangerang'
  },
  {
    id: '3',
    name: 'Medan'
  },
  {
    id: '4',
    name: 'Bandung'
  }
])

const dummyCountry = ref([
  {
    id: '1',
    name: 'Indonesia'
  },
  {
    id: '2',
    name: 'Rusia'
  },
  {
    id: '3',
    name: 'Malaysia'
  },
  {
    id: '4',
    name: 'Singapore'
  }
])
</script>
