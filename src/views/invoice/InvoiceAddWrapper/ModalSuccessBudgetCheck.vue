<template>
  <div class="modal" data-modal="true" id="success_budget_check_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[20px] items-center">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Budget Checking Succeed</p>
          <p class="text-sm text-black-100 mt-1">Budget Available, Invoice can be proceed</p>
          <p class="text-[13px] font-normal mt-2">{{ getResponseMessage() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalSuccessLogo from './ModalSuccessBudgetCheck/LogoSuccess.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { isEmpty } from 'lodash'

const emits = defineEmits(['afterClose'])
const invoiceApi = useInvoiceSubmissionStore()

const responseCheckBudget = computed(() => invoiceApi.responseCheckBudget)

const getResponseMessage = () => {
  if (!isEmpty(responseCheckBudget.value) && responseCheckBudget.value) {
    const index = responseCheckBudget.value.RESPONSE.findIndex((item) => item.TYPE === 'S')
    if (index !== -1) return responseCheckBudget.value.RESPONSE[index].MESSAGE.join(' ')
  } else {
    return ''
  }
}

const hideModal = () => {
  const idModal = document.querySelector('#success_budget_check_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('success_budget_check_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('success_budget_check_modal')?.removeEventListener('click', hideModal)
})
</script>
