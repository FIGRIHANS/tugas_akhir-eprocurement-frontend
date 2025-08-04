<template>
  <div v-if="form">
    <div class="border rounded-xl p-[24px]">
      <p class="font-semibold">Timeline</p>
      <div class="border rounded-lg p-[4px] mt-[24px] mb-[24px] w-fit">
        <div class="flex gap-4" data-tabs="true">
          <a class="btn btn-primary btn-clear" :class="{ 'active': activeTabTimeline === 'automatic' }" href="#" @click="onSetTab(true)">
            Automatic Timeline
          </a>
          <a class="btn btn-primary btn-clear" :class="{ 'active': activeTabTimeline === 'manual' }" href="#" @click="onSetTab(false)">
            Manual Timeline
          </a>
        </div>
      </div>
      <BillingTimeline v-show="activeTabTimeline === 'automatic'" v-model="form.automaticTimeline" />
      <BillingTimeline v-show="activeTabTimeline === 'manual'" v-model="form.manualTimeline" :isManual="true" />
    </div>
    <div class="my-[24px]">
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.agreePersonInCharge" class="checkbox" name="check" type="checkbox"/>
        As the person in charge, I expressly agree to all applicable provisions.
      </label>
    </div>
    <div>
      <p class="font-semibold">Signature</p>
      <div class="flex gap-[16px] mt-[16px]">
        <Vue3Signature :sigOption="optionSignature" :w="'346px'" :h="'220px'" class="border rounded-2xl border-gray-300 overflow-hidden" />
        <div class="flex flex-col justify-between">
          <div>
            <p class="text-sm">PIC Tender</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import BillingTimeline from './TenderBilling/BillingTimeline.vue'
import Vue3Signature from "vue3-signature"
import type { FormTypes } from '../types/tenderCreate'

const form = inject<FormTypes>('form')

defineProps<{
  activeTabTimeline: string
}>()

const emits = defineEmits(['setTabTimeline'])

const optionSignature = ref({
  penColor: "rgb(0, 0, 0)",
  backgroundColor: "rgba(249, 249, 249)"
})

const onSetTab = (isAutomatic: boolean) => {
  emits('setTabTimeline', isAutomatic ? 'automatic' : 'manual')
}
</script>

<style lang="scss" scoped>
@use '../styles//administrativeDocument.scss';
</style>
