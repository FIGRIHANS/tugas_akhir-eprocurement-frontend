<template>
  <div class="card flex-1" id="reject-target-data-paymentInformation">
    <div
      class="card-header gap-[8px]"
      :class="{
        'px-[16px] py-[22px] justify-start': !checkIsNonPo(),
        'px-[20px] py-[8px] justify-center': checkIsNonPo()
      }"
    >
      <div v-if="checkIsNonPo()" class="flex-1 flex gap-4" data-tabs="true">
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
    <div
      class="card-body"
      :class="{
        'py-[8px] px-[50px]': isTabActive === 'payment',
        'p-0': isTabActive === 'alternative'
      }"
      :id="isTabActive === 'alternative' ? 'reject-target-data-alternativePayment' : undefined"
    >
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, watch, inject, type Component, type Ref } from 'vue'
import { useRoute } from 'vue-router'

type RejectNavSignal = {
  token: number
  headerTab?: string | null
  bankTab?: string | null
} | null

const PaymentInformation = defineAsyncComponent(() => import('./BankKey/PaymentInformation.vue'))
const AlternativePayment = defineAsyncComponent(() => import('./BankKey/AlternativePayment.vue'))

const route = useRoute()
const rejectNavSignal = inject<Ref<RejectNavSignal> | undefined>('rejectNavSignal')
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

watch(
  () => rejectNavSignal?.value?.token,
  () => {
    const tab = rejectNavSignal?.value?.bankTab
    if (tab) isTabActive.value = tab
  },
)
</script>
