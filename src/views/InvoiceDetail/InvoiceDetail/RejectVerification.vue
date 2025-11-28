<template>
  <div class="modal" data-modal="true" id="reject_verification_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-header py-[16px] px-[16px]">
        <h3 class="modal-title text-lg font-semibold">Reject Invoice</h3>
      </div>

      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[16px]">
        <UiTextArea
          v-model="reason"
          label="Reason"
          placeholder="Enter reason"
          class="w-full"
          :error="isReasonError"
          required
        />

        <div class="flex gap-[16px] w-full">
          <!-- Cancel TIDAK loading -->
          <button
            class="btn btn-outline btn-primary btn-lg w-full justify-center"
            data-modal-dismiss="true"
          >
            <i class="ki-duotone ki-black-left-line"></i>
            Cancel
          </button>

          <!-- Reject + Spinner -->
          <button
            class="btn btn-danger btn-lg w-full justify-center flex items-center gap-2"
            :disabled="verificationApi.isRejectLoading"
            @click="goReject"
          >
            <template v-if="verificationApi.isRejectLoading">
              <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </template>

            <template v-else>
              <i class="ki-duotone ki-cross-circle"></i>
              Reject
            </template>
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
  if (!reason.value) return (isReasonError.value = true)
  emits('reject', reason.value)
}
</script>
