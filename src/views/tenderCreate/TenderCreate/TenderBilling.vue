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
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { FormTypes } from '../types/tenderCreate'
import BillingTimeline from './TenderBilling/BillingTimeline.vue'

const form = inject<FormTypes>('form')

defineProps<{
  activeTabTimeline: string
}>()

const emits = defineEmits(['setTabTimeline'])

const onSetTab = (isAutomatic: boolean) => {
  emits('setTabTimeline', isAutomatic ? 'automatic' : 'manual')
}
</script>

<style lang="scss" scoped>
@use '../styles//administrativeDocument.scss';
</style>
