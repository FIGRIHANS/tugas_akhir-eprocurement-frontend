<template>
  <div class="card flex-1">
    <div
      class="card-header gap-[8px]"
      :class="{
        'px-[16px] py-[22px] justify-start': !isNonPo,
        'px-[20px] py-[8px] justify-center': isNonPo
      }"
    >
      <div v-if="isNonPo" class="flex-1 flex gap-4">
        <button class="btn btn-primary btn-clear flex-1 justify-center" :class="{ 'active': isTabActive === 'payment' }" @click="isTabActive = 'payment'">
          Payment Information
        </button>
        <button class="btn btn-primary btn-clear flex-1 justify-center" :class="{ 'active': isTabActive === 'alternative' }" @click="isTabActive = 'alternative'">
          Alternative Payment
        </button>
      </div>
      <div v-else class="flex align-items-center gap-[8px]">
        <i class="ki-duotone ki-bill text-gray-600 text-xl"></i>
        <span class="font-medium">Payment Information</span>
      </div>
    </div>
    <div v-if="form" class="card-body py-[8px] px-[50px]">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, defineAsyncComponent, onMounted, type Ref, type Component } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { useRoute } from 'vue-router'

const PaymentInformation = defineAsyncComponent(() => import('./BankKey/PaymentInformation.vue'))
const AlternativePayment = defineAsyncComponent(() => import('./BankKey/AlternativePayment.vue'))

const route = useRoute()
const form = inject<Ref<formTypes>>('form')
const isTabActive = ref<string>('payment')
const isNonPo = ref<boolean>(false)

const contentComponent = computed(() => {
  const components = {
    payment: PaymentInformation,
    alternative: AlternativePayment
  } as { [key: string]: Component }

  return components[isTabActive.value]
})

watch(
  () => form.value,
  () => {
    if (
      form.value.nameAlternativeError ||
      form.value.streetAltiernativeError ||
      form.value.bankAccountNumberAlternativeError ||
      form.value.bankKeyAlternativeError ||
      form.value.emailAlternativeError
    ) isTabActive.value = 'alternative'
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  if (route.query.invoiceType === 'no_po') {
    isNonPo.value = true
  }
})
</script>
