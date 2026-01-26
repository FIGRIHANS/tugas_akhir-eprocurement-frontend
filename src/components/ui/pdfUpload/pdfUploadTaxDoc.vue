<template>
  <div class="file-upload">
    <input
      type="file"
      ref="fileInput"
      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
      @change="handleFileUpload"
      class="hidden"
      :disabled="disabled"
    />

    <div class="flex items-center" :class="{ 'border-danger': error }" @click="triggerFileInput">
      <slot>
        <div class="upload__left">
          <IconUpload />
        </div>
        <div class="upload__right">Select file - Pdf (Max 16 mb)</div>
      </slot>
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
}>()

const emits = defineEmits(['setFile', 'setFileQr'])

const uploadApi = useUploadStore()
const fileInput = ref<HTMLInputElement | null>(null)

const errorMessageUpload = computed(() => uploadApi.errorMessageUpload)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  if (props.isHoldUpload) return emits('setFile')
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  if (file.size > 16 * 1024 * 1024) return

  try {
    const response = await uploadApi.uploadFile(file, 0)

    emits('setFile', {
      id: 0,
      name: response.name,
      path: response.url,
      previewPath: response.urlWithToken,
      fileSize: file.size,
    })
    // const responseQr = await uploadApi.uploadFileQr(file, 0)
    // emits('setFileQr', responseQr)
  } catch {}
}

watch(
  () => errorMessageUpload.value,
  () => {
    if (errorMessageUpload.value) {
      const idModal = document.querySelector('#error_upload_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
    }
  },
)

defineExpose({
  triggerFileInput,
})
</script>

<style lang="scss" scoped>
@use './styles/upload.scss';
</style>
