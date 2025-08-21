<template>
  <div v-if="form" class="flex flex-col gap-[24px] mb-[24px]">
    <p class="font-semibold text-lg">General Data</p>
    <div class="w-[80%] flex gap-[24px] self-center">
      <!-- left -->
      <div class="flex-1">
        <!-- Company Code -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32"> Company Code </label>
          <input
            v-model="form.companyCode"
            class="input"
            placeholder=""
            :class="{ 'border-danger': form.companyCodeError }"
          />
        </div>
        <!-- Purchasing Organization -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32"> Purchasing Organization </label>
          <input
            v-model="form.purchasingOrganization"
            class="input"
            placeholder=""
            :class="{ 'border-danger': form.purchasingOrganizationError }"
          />
        </div>
        <!-- Purchasing Group -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32"> Purchasing Group </label>
          <input
            v-model="form.purchasingGroup"
            class="input"
            placeholder=""
            :class="{ 'border-danger': form.purchasingGroupError }"
          />
        </div>
      </div>

      <!-- middle -->
      <div class="flex-1">
        <!-- Payment Terms -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32"> Payment Terms </label>
          <input
            v-model="form.paymentTerms"
            class="input"
            placeholder=""
            :class="{ 'border-danger': form.paymentTermsError }"
          />
        </div>
        <!-- Document Type -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Document Type
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select
            v-model="form.documentType"
            class="select"
            :class="{ 'border-danger': form.documentTypeError }"
          >
            <option v-for="item of documentTypeOption" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <!-- Document Category -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32"> Document Category </label>
          <input
            v-model="form.documentCategory"
            class="input"
            placeholder=""
            :class="{ 'border-danger': form.documentCategoryError }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'

const form = inject<any>('form')

const documentTypeOption = ref([
  'ZAAS',
  'ZABL',
  'ZAHC',
  'ZARP',
  'ZASC',
  'ZASP',
  'ZAVH',
  'ZEAS',
  'ZEBL',
  'ZEHC',
  'ZEPR',
])
</script>
