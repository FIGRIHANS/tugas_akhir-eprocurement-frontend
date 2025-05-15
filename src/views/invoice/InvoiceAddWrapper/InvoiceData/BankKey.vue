<template>
  <div class="card flex-1">
    <div class="card-header px-[16px] py-[22px]">
      <div class="flex gap-4 mb-5 flex-1 border rounded-lg p-[4px]" data-tabs="true">
        <button
          class="btn btn-primary btn-clear flex-1 justify-center"
          :class="{ 'active': tabNow === 'payment' }"
          :disabled="isDisabled"
          @click="tabNow = 'payment'"
        > Payment Information </button>
        <button
          class="btn btn-primary btn-clear flex-1 justify-center"
          :class="{ 'active': tabNow === 'alternative' }"
          :disabled="isDisabled"
          @click="tabNow = 'alternative'"
        > Alternative Payment </button>
      </div>
    </div>
    <div class="py-[8px] px-[50px]">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, type Component } from 'vue'

const PaymentInformation = defineAsyncComponent(() => import('./BankKey/PaymentInformation.vue'))
const AlternativePayment = defineAsyncComponent(() => import('./BankKey/AlternativePayment.vue'))

const tabNow = ref<string>('payment')
const isDisabled = ref<boolean>(true)

const contentComponent = computed(() => {
  const components = {
    payment: PaymentInformation,
    alternative: AlternativePayment
  } as { [key: string]: Component }

  return components[tabNow.value]
})
</script>
