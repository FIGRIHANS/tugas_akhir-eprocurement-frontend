<template>
  <div class="file-upload relative w-full">
    <input
      type="file"
      ref="fileInput"
      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
      @change="handleFileUpload"
      class="hidden"
      :disabled="disabled || isLoading"
    />

    <div
      class="flex items-center cursor-pointer relative"
      :class="{ 'border-danger': error, 'opacity-50 cursor-not-allowed': isLoading }"
      @click="!isLoading && !disabled && triggerFileInput()"
    >
      <slot>
        <div class="upload__left"><IconUpload /></div>
        <div class="upload__right">Select file - Pdf (Max 16 mb)</div>
      </slot>
    </div>

    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded z-20"
    >
      <svg
        class="animate-spin h-6 w-6 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>

    <ErrorUploadModal :error-message="errorMessageUpload" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue'
import IconUpload from './PdfUpload/IconUpload.vue'
import { useUploadStore } from '@/stores/general/upload'
import { KTModal } from '@/metronic/core'

const ErrorUploadModal = defineAsyncComponent(() => import('./PdfUpload/ErrorUploadModal.vue'))

const props = defineProps<{
  error?: boolean
  disabled?: boolean
  isHoldUpload?: boolean
  varName?: string
}>()

const emits = defineEmits(['setFile', 'setFileOcr', 'onLoading'])

const uploadApi = useUploadStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)

const errorMessageUpload = computed(() => uploadApi.errorMessageUpload)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (file.size > 16 * 1024 * 1024) {
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  if (props.isHoldUpload) {
    emits('setFile')
    return
  }

  // MULAI LOADING: Di sini parent akan menyembunyikan AttachmentView dan menampilkan spinner
  isLoading.value = true
  emits('onLoading', true)

  try {
    const response = await uploadApi.uploadFile(file, 0)

    if (props.varName === 'invoiceDocument') {
      const responseOcr = await uploadApi.uploadFileOcr(file, 0)
      emits('setFileOcr', responseOcr)
    }

    emits('setFile', {
      id: 0,
      name: response.name,
      path: response.url,
      previewPath: response.urlWithToken,
      fileSize: file.size,
    })
  } catch (err) {
    console.error('Upload Failed:', err)
  } finally {
    isLoading.value = false
    emits('onLoading', false) // SELESAI: Parent mengembalikan tampilan normal
    if (fileInput.value) fileInput.value.value = '' // Reset input agar event @change jalan lagi
  }
}

watch(
  () => errorMessageUpload.value,
  () => {
    if (errorMessageUpload.value) {
      const modal = KTModal.getInstance(
        document.querySelector('#error_upload_modal') as HTMLElement,
      )
      modal?.show()
    }
  },
)

defineExpose({ triggerFileInput })
</script>

<style lang="scss" scoped>
@use './styles/upload.scss';

.file-upload {
  width: 100%;
}
</style>
