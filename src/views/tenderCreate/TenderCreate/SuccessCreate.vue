<template>
  <div class="modal" data-modal="true" id="success_create_tender_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[40px]">
        <LogoSuccess />
        <div>
          <p class="text-lg font-medium text-center">Tender Published</p>
          <p class="text-[13px] mt-[14px] text-center">
            Tender with ID 10000008 successfully published and forwarded to the appropriate vendors.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import LogoSuccess from './successCreate/LogoSuccess.vue'
import { KTModal } from '@/metronic/core'

const emits = defineEmits(['afterClose'])

const hide = () => {
  const idModal = document.querySelector('#success_create_tender_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('success_create_tender_modal')?.addEventListener('click', hide)
})

onUnmounted(() => {
  document.getElementById('success_create_tender_modal')?.removeEventListener('click', hide)
})
</script>
