<template>
  <UiModal v-model="visible" size="md">
    <div class="p-6">
      <h3 class="text-lg font-semibold mb-4">Manual PJAP Sync (POC)</h3>

      <div class="space-y-4">
        <div>
          <label class="form-label required">No Faktur</label>
          <input v-model="form.noFaktur" type="text" class="form-control" placeholder="010..." />
        </div>

        <div>
          <label class="form-label required">NPWP Vendor</label>
          <input v-model="form.npwpVendor" type="text" class="form-control" placeholder="0000..." />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label required">Masa Pajak</label>
            <select v-model="form.masaPajak" class="form-select">
              <option v-for="i in 12" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>

          <div>
            <label class="form-label required">Tahun Pajak</label>
            <input
              v-model="form.tahunPajak"
              type="number"
              class="form-control"
              placeholder="Year"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm mt-2">
          {{ errorMsg }}
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <UiButton class="btn-light" @click="closeModal">Cancel</UiButton>
        <UiButton
          class="btn-primary"
          :loading="isLoading"
          :disabled="!isValidForm"
          @click="handleVerify"
        >
          Verify
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import type { SyncManualResult } from '@/stores/views/invoice/types/verification'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', data: SyncManualResult): void
}>()

const store = useInvoiceVerificationStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const form = reactive({
  noFaktur: '',
  npwpVendor: '',
  masaPajak: new Date().getMonth() + 1,
  tahunPajak: new Date().getFullYear(),
})

const isLoading = ref(false)
const errorMsg = ref('')

const isValidForm = computed(() => {
  return form.noFaktur && form.npwpVendor && form.masaPajak && form.tahunPajak
})

const handleVerify = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    const res = await store.syncManual({
      noFaktur: form.noFaktur,
      npwpVendor: form.npwpVendor,
      masaPajak: Number(form.masaPajak),
      tahunPajak: Number(form.tahunPajak),
    })

    if (res.result?.content) {
      emit('success', res.result.content)
      closeModal()
    } else {
      // Fallback if structure is different or no content
      errorMsg.value = 'No content in response.'
    }
  } catch (error: any) {
    console.error(error)
    errorMsg.value = error.response?.data?.result?.message || 'Verification Failed'
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  visible.value = false
  resetForm()
}

const resetForm = () => {
  form.noFaktur = ''
  form.npwpVendor = ''
  form.masaPajak = new Date().getMonth() + 1
  form.tahunPajak = new Date().getFullYear()
  errorMsg.value = ''
}
</script>
