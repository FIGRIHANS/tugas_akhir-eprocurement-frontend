<template>
  <div class="modal" data-modal="true" id="failed_budget_check_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[40px]">
        <FailedLogo />
        <div>
          <p class="text-lg font-medium text-center">Budget Checking Failed</p>
          <p class="text-[13px] mt-[14px] text-center">
            {{ getResponseMessage() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import FailedLogo from './ModalFailedBudgetCheck/FailedLogo.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { isEmpty } from 'lodash'

const emits = defineEmits(['afterClose'])
const invoiceApi = useInvoiceSubmissionStore()

const responseCheckBudget = computed(() => invoiceApi.responseCheckBudget)

const getResponseMessage = () => {
  if (!isEmpty(responseCheckBudget.value) && responseCheckBudget.value) {
    const index = responseCheckBudget.value.RESPONSE.findIndex((item) => item.TYPE === 'E')
    if (index !== -1) return responseCheckBudget.value.RESPONSE[index].MESSAGE.join(' ')
  } else {
    return ''
  }
}

const hideModal = () => {
  const idModal = document.querySelector('#failed_budget_check_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('failed_budget_check_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('failed_budget_check_modal')?.removeEventListener('click', hideModal)
})
</script>
