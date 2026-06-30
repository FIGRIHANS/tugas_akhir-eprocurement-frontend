<template>
  <div class="modal" data-modal="true" id="success_reject_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body flex flex-col items-center gap-[30px] p-[40px]">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Berhasil Ditolak</p>
          <p class="text-[13px] font-normal text-gray-600">
            Invoice ini telah dibatalkan dan dikembalikan ke submitter. Submitter dapat memperbaiki
            data invoice lalu mengajukan kembali untuk proses verifikasi.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const emits = defineEmits(['afterClose'])

let shouldEmitAfterClose = false

const show = () => {
  const el = document.querySelector('#success_reject_modal') as HTMLElement
  if (!el) return
  let modal = KTModal.getInstance(el)
  if (!modal) modal = new KTModal(el)
  shouldEmitAfterClose = true
  modal.show()
}

onMounted(() => {
  const el = document.querySelector('#success_reject_modal') as HTMLElement
  if (!el) return

  const modal = KTModal.getInstance(el) ?? new KTModal(el)
  modal.on('hide', () => {
    if (!shouldEmitAfterClose) return
    shouldEmitAfterClose = false
    emits('afterClose')
  })
})

defineExpose({ show })
</script>
