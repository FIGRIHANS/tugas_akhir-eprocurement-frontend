<template>
  <div class="modal" data-modal="true" id="reject_verification_modal">
    <div class="modal-content max-w-[560px] modal-center-y">
      <div class="modal-header py-[16px] px-[16px]">
        <h3 class="modal-title text-lg font-semibold">Reject Invoice</h3>
      </div>

      <div class="modal-body flex flex-col justify-center items-center gap-[16px] p-[16px]">
        <p class="text-[12px] text-gray-600 w-full -mt-[4px]">
          Pilih halaman, bagian, dan kolom yang perlu diperbaiki (opsional) agar submitter lebih mudah menemukannya.
        </p>

        <UiSelect
          v-model="page"
          label="Page"
          placeholder="Select page (optional)"
          class="w-full"
          :options="pageOptions"
        />

        <UiSelect
          v-model="component"
          label="Component"
          placeholder="Select component (optional)"
          class="w-full"
          :options="componentOptions"
          :disabled="!page"
        />

        <UiSelect
          v-model="field"
          label="Field"
          placeholder="Select field (optional)"
          class="w-full"
          :options="fieldOptions"
          :disabled="!component"
        />

        <UiTextArea
          v-model="reason"
          label="Reason"
          placeholder="Enter reason"
          class="w-full"
          :error="isReasonError"
          required
        />

        <div class="flex gap-[16px] w-full">
          <button
            class="btn btn-outline btn-primary btn-lg w-full justify-center"
            data-modal-dismiss="true"
            type="button"
          >
            <i class="ki-duotone ki-black-left-line"></i>
            Cancel
          </button>

          <button
            class="btn btn-danger btn-lg w-full justify-center flex items-center gap-2"
            type="button"
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
import { computed, ref, watch } from 'vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import {
  INVOICE_REJECT_PAGES,
  encodeInvoiceRejectNotes,
  getRejectComponentsForPage,
  getRejectFieldsForComponent,
  type InvoiceRejectTargetMeta,
} from '@/core/utils/invoiceRejectTarget'

export type RejectPayload = {
  notes: string
  page?: string | null
  component?: string | null
  field?: string | null
}

const emits = defineEmits<{
  reject: [payload: RejectPayload]
}>()

const verificationApi = useInvoiceVerificationStore()
const reason = ref<string>('')
const page = ref<string>('')
const component = ref<string>('')
const field = ref<string>('')
const isReasonError = ref<boolean>(false)

const pageOptions = INVOICE_REJECT_PAGES
const componentOptions = computed(() => getRejectComponentsForPage(page.value))
const fieldOptions = computed(() => getRejectFieldsForComponent(component.value))

watch(page, () => {
  component.value = ''
  field.value = ''
})

watch(component, () => {
  field.value = ''
})

const goReject = () => {
  if (!reason.value.trim()) {
    isReasonError.value = true
    return
  }
  isReasonError.value = false

  const meta: InvoiceRejectTargetMeta = {
    page: page.value || null,
    component: component.value || null,
    field: field.value || null,
  }

  emits('reject', {
    notes: encodeInvoiceRejectNotes(reason.value, meta),
    page: meta.page,
    component: meta.component,
    field: meta.field,
  })
}
</script>
