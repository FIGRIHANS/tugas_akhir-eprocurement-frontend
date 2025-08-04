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
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <input v-model="form.tenderId" class="input" placeholder="" :class="{ 'border-danger': form.tenderIdError }"/>
        </div>
        <!-- Tender Status -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Tender Status
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <input v-model="form.tenderStatus" class="input" placeholder="" :class="{ 'border-danger': form.tenderStatusError }"/>
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
            <option v-for="item of dummyOption" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
      <!-- right -->
      <div class="flex-1">
        <!-- Evaluation Object -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Evaluation Object
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.evaluationObject" class="select" :class="{ 'border-danger': form.evaluationObjectError }">
            <option v-for="item of dummyOption" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Tender Period -->
        <div class="py-[8px]">
          <DatePicker
            v-model="form.tenderPeriod"
            label="Tender Period"
            format="dd MMM yyyy"
            :error="form.tenderPeriodError"
            required
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { FormTypes } from '../../types/tenderCreate'
import DatePicker from '@/components/datePicker/DatePicker.vue'

const form = inject<FormTypes>('form')

const dummyOption = ref([
  {
    id: '1',
    name: 'test'
  },
  {
    id: '2',
    name: 'test2'
  },
  {
    id: '3',
    name: 'test3'
  }
])
</script>
