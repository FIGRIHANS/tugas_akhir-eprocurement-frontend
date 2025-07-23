<template>
  <div class="modal" data-modal="true" id="reject_verification_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-header py-[16px] px-[16px]">
        <h3 class="modal-title text-lg font-semibold">
          Reject Invoice
        </h3>
      </div>
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[16px]">
        <UiTextArea v-model="reason" label="Reason" placeholder="Enter reason" :error="isReasonError" required />
        <div class="flex gap-[16px] w-full">
          <button class="btn btn-outline btn-primary btn-lg w-full justify-center" :disabled="verificationApi.isRejectLoading" data-modal-dismiss="true">
            <i class="ki-duotone ki-black-left-line"></i>
            Cancel
          </button>
          <button class="btn btn-danger btn-lg w-full justify-center" :disabled="verificationApi.isRejectLoading" @click="goReject">
            <i class="ki-duotone ki-cross-circle"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const emits = defineEmits(['reject'])

const verificationApi = useInvoiceVerificationStore()
const reason = ref<string>('')
const isReasonError = ref<boolean>(false)

const goReject = () => {
  if (!reason.value) return isReasonError.value = true
  emits('reject', reason.value)
}
</script>
