<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="font-semibold text-lg">General Data</p>
    <div class="w-[80%] flex gap-[24px] self-center">
      <!-- left -->
      <div class="flex-1">
        <!-- Tender ID -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Tender ID
          </label>
          <input v-model="form.tenderId" class="input" placeholder="" :class="{ 'border-danger': form.tenderIdError }"/>
        </div>
        <!-- Tender Status -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Tender Status
          </label>
          <input v-model="form.tenderStatus" class="input" placeholder="" disabled/>
        </div>
        <!-- PIC -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            PIC
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <input v-model="form.pic" class="input" placeholder="" :class="{ 'border-danger': form.picError }"/>
        </div>
        <!-- Purchase Requisition Scenario -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            PR Scenario
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.purchaseRequisitionScenario" class="select" :class="{ 'border-danger': form.purchaseRequisitionScenarioError }">
            <option v-for="item of prScenarioOption" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
      <!-- middle -->
      <div class="flex-1">
        <!-- Evaluation Object -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Evaluation Object
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.evaluationObject" class="select" :class="{ 'border-danger': form.evaluationObjectError }">
            <option v-for="item of evaluationOption" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Tender Period -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Tender Period
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <DatePicker
            v-model="form.tenderPeriod"
            format="dd MMM yyyy"
            :error="form.tenderPeriodError"
            range
          />
        </div>
        <!-- Remarks -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Remarks
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <textarea v-model="form.remarks" class="textarea" placeholder="" rows="6" :class="{ 'border-danger': form.remarksError }"></textarea>
        </div>
      </div>
      <!-- right -->
      <div class="flex-1">
        <!-- LBMA Ref Date -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32 whitespace-nowrap">
            LBMA Ref Date
          </label>
          <span class="text-sm">{{ moment().format('DD.MM.YYYY') }}</span>
          <button class="btn btn-xs btn-primary" @click="openTrend">Trend</button>
        </div>
        <!-- LBMA Ref Price(oz t) -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32 whitespace-nowrap">
            LBMA Ref Price(oz t)
          </label>
          <span class="text-sm">{{ useFormatUsd(form.lbmaPriceOz) }}</span>
          <span class="text-sm">USD</span>
        </div>
        <!-- LBMA Ref Price(gr) -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32 whitespace-nowrap">
            LBMA Ref Price(gr)
          </label>
          <span class="text-sm">{{ useFormatUsd(form.lbmaPriceOz / 31.1034768) }}</span>
          <span class="text-sm">USD</span>
        </div>
        <!-- BI Middle Exc Rate -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32 whitespace-nowrap">
            BI Middle Exc Rate
          </label>
          <span class="text-sm">{{ useFormatIdr(form.biExchangeRate) }}</span>
          <span class="text-sm">IDR</span>
        </div>
        <!-- LBMA Ref Price(gr) -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32 whitespace-nowrap">
            LBMA Ref Price(gr)
          </label>
          <span class="text-sm">{{ useFormatIdr(form.biExchangeRate * (form.lbmaPriceOz / 31.1034768)) }}</span>
          <span class="text-sm">IDR</span>
        </div>
      </div>
    </div>
    <TrendLbma />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, defineAsyncComponent } from 'vue'
import { KTModal } from '@/metronic/core'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { FormTypes } from '../../types/tenderCreate'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import moment from 'moment'

const TrendLbma = defineAsyncComponent(() => import('./GeneralData/TrendLbma.vue'))

const form = inject<FormTypes>('form')

const prScenarioOption = ref([
  {
    id: 'Fixed Asset',
    name: 'Fixed Asset'
  },
  {
    id: 'Adhoc',
    name: 'Adhoc'
  },
  {
    id: 'MRP',
    name: 'MRP'
  },
  {
    id: 'Non Stock Item',
    name: 'Non Stock Item'
  },
  {
    id: 'Services',
    name: 'Services'
  },
  {
    id: 'Project Based',
    name: 'Project Based'
  }
])

const evaluationOption = ref([
  {
    id: 'Raw Material',
    name: 'Raw Material'
  },
  {
    id: 'Fixed Asset',
    name: 'Fixed Asset'
  },
  {
    id: 'Services',
    name: 'Services'
  },
  {
    id: 'Labor & Supply',
    name: 'Labor & Supply'
  },
  {
    id: 'Finished Product',
    name: 'Finished Product'
  },
  {
    id: 'Safety Tools',
    name: 'Safety Tools'
  }
])

const openTrend = () => {
  const idModal = document.querySelector('#trend_lbma_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

watch(
  () => form?.tenderPeriod,
  () => {
    if (!form) return
    if (form.tenderPeriod.length !== 0) {
      form.tenderStartDate = form?.tenderPeriod[0] 
      form.tenderEndDate = form?.tenderPeriod[1] 
    } else {
      form.tenderStartDate = ''
      form.tenderEndDate = ''
    }
  },
  {
    immediate: true
  }
)
</script>
