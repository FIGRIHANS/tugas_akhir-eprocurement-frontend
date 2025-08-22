<template>
  <div class="modal" data-modal="true" id="success_invoice_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Successfully {{ props.isDraft ? 'Drafted' : 'Submitted' }}</p>
          <p class="text-[13px] font-normal">
            {{
              props.isDraft ?
              'Your invoice has been saved as a draft. You can review and make any necessary changes before submitting it for approval' :
              'The invoice you sent is currently under review. Further information will be provided via notification.'
            }}
            
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const props = defineProps<{
  isDraft: boolean
}>()

const emits = defineEmits(['afterClose'])

const hideModal = () => {
  const idModal = document.querySelector('#success_invoice_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('success_invoice_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('success_invoice_modal')?.removeEventListener('click', hideModal)
})
</script>
