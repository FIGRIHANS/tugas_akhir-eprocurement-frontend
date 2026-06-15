<template>
  <div class="modal" data-modal="true" id="success_reject_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body flex flex-col items-center gap-[30px] p-[40px]">
        <ModalRejectLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Berhasil Ditolak</p>
          <p class="text-[13px] font-normal text-gray-600">
            Invoice ini telah dibatalkan dan dikembalikan ke submitter. Submitter dapat memperbaiki
            data invoice lalu mengajukan kembali untuk proses verifikasi.
          </p>
        </div>
        <button class="btn btn-primary w-full justify-center" @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KTModal } from '@/metronic/core'
import ModalRejectLogo from '@/assets/svg/ModalRejectLogo.vue'

const emits = defineEmits(['afterClose'])

const closeModal = () => {
  const el = document.querySelector('#success_reject_modal') as HTMLElement
  if (!el) return
  const modal = KTModal.getInstance(el)
  modal?.hide()
  emits('afterClose')
}

const show = () => {
  const el = document.querySelector('#success_reject_modal') as HTMLElement
  if (!el) return
  let modal = KTModal.getInstance(el)
  if (!modal) modal = new KTModal(el)
  modal.show()
}

defineExpose({ show })
</script>
