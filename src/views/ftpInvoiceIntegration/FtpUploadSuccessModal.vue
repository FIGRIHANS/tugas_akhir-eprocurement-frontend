<template>
  <div class="modal" data-modal="true" id="ftp_upload_success_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body flex flex-col items-center gap-[30px] p-[40px]">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">FTP Document Uploaded Successfully</p>
          <p class="text-[13px] font-normal text-gray-600">
            Dokumen FTP berhasil diunggah. Data invoice akan tersedia di tab FTP Data setelah
            sinkronisasi selesai.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KTModal } from '@/metronic/core'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const emits = defineEmits(['closed'])

const show = () => {
  const el = document.querySelector('#ftp_upload_success_modal') as HTMLElement
  if (!el) return

  let modal = KTModal.getInstance(el)
  if (!modal) {
    modal = new KTModal(el, {
      backdrop: true,
      backdropStatic: false,
    })
  }

  modal.on('hidden', () => {
    emits('closed')
  })
  modal.show()
}

defineExpose({ show })
</script>
