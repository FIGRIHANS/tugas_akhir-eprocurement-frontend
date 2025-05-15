<template>
  <div v-if="form">
    <div class="flex items-center">
      <!-- Name -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Name
        </label>
        <input v-model="form.nameBank" class="input" placeholder=""/>
      </div>
      <!-- Bank Number -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Bank Number
        </label>
        <input v-model="form.bankNumber" class="input" placeholder=""/>
      </div>
    </div>
    <div class="flex items-center">
      <!-- Postal Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Postal Code
        </label>
        <input v-model="form.postalCode" class="input" placeholder=""/>
      </div>
      <!-- Bank Country -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Bank Country
        </label>
        <select v-model="form.bankCountry" class="select">
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
    </div>
    <div class="flex items-center">
      <!-- Street -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Street
        </label>
        <input v-model="form.street" class="input" placeholder=""/>
      </div>
      <!-- No. NPWP -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          No. NPWP
        </label>
        <input v-model="form.npwpNumber" class="input" placeholder=""/>
      </div>
    </div>
    <div class="flex items-center">
      <!-- City -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          City
        </label>
        <select v-model="form.city" class="select">
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
      <!-- No. KTP -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          No. KTP
        </label>
        <input v-model="form.ktpNumber" class="input" placeholder=""/>
      </div>
    </div>
    <div class="flex items-center">
      <!-- Country -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Country
        </label>
        <select v-model="form.country" class="select">
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
      <!-- Email -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] flex-1">
        <label class="form-label max-w-32">
          Email
        </label>
        <input v-model="form.email" class="input" placeholder=""/>
      </div>
    </div>
    <div class="flex items-center">
      <!-- Bank Account -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px] w-[50%]">
        <label class="form-label max-w-32">
          Bank Account
        </label>
        <select v-model="form.bankAccount" class="select">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../../types/invoiceDetailEdit'

const form = inject<formTypes>('form')
</script>