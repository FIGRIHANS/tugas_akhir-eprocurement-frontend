<template>
  <div class="file-upload">
    <input type="file" ref="fileInput" accept=".pdf" @change="handleFileUpload" class="hidden" :disabled="disabled" />

    <div class="flex items-center" :class="{ 'border-danger': error }" @click="triggerFileInput">
      <div class="upload__left">
        <IconUpload />
      </div>
      <div class="upload__right">
        Select file - Pdf (Max 2 mb)
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue'
import IconUpload from './PdfUpload/IconUpload.vue'
import { useUploadStore } from '@/stores/general/upload'

defineProps<{
  error?: boolean
  disabled?: boolean
}>()

const emits = defineEmits(['setFile'])

const uploadApi = useUploadStore()
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  if (file.size > 2 * 1024 * 1024) return

  try {
    const response = await uploadApi.uploadFile(file, 0)

    emits('setFile', {
      name: response.name,
      path: response.path,
      fileSize: file.size
    })
  } catch {

  }
}

defineExpose({
  triggerFileInput
})
</script>

<style lang="scss" scoped>
@use './styles/upload.scss';
</style>
