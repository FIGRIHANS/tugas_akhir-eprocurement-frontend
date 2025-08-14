<template>
  <div class="card flex-1">
    <div
      class="card-header justify-start gap-[8px]"
      :class="{
        'px-[16px] py-[22px]': !checkIsNonPo(),
        'px-[20px] py-[8px]': checkIsNonPo()
      }"
    >
      <div v-if="checkIsNonPo()" class="flex gap-4 mb-5" data-tabs="true">
        <button class="btn btn-primary btn-clear" :class="{ 'active': isTabActive === 'payment' }" @click="isTabActive = 'payment'">
          Payment Information
        </button>
        <button class="btn btn-primary btn-clear" :class="{ 'active': isTabActive === 'alternative' }" @click="isTabActive = 'alternative'">
          Alternative Payment
        </button>
      </div>
      <div v-else>
        <i class="ki-duotone ki-bill text-gray-600 text-xl"></i>
        <span class="font-medium">Payment Information</span>
      </div>
    </div>
    <div
      class="card-body"
      :class="{
        'py-[8px] px-[50px]': isTabActive === 'payment',
        'p-0': isTabActive === 'alternative'
      }"
    >
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, type Component } from 'vue'
import { useRoute } from 'vue-router'

const PaymentInformation = defineAsyncComponent(() => import('./BankKey/PaymentInformation.vue'))
const AlternativePayment = defineAsyncComponent(() => import('./BankKey/AlternativePayment.vue'))

const route = useRoute()
const isTabActive = ref<string>('payment')

const contentComponent = computed(() => {
  const components = {
    payment: PaymentInformation,
    alternative: AlternativePayment
  } as { [key: string]: Component }

  return components[isTabActive.value]
})

const checkIsNonPo = () => {
  return route.query.type === 'nonpo'
}
</script>
