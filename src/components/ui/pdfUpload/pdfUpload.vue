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
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

defineProps<{
  error?: boolean
  disabled?: boolean
}>()

const emits = defineEmits(['setFile'])

const fileInput = ref<HTMLInputElement | null>(null)
const vendorMasterDataStore = useVendorMasterDataStore()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  if (file.size > 2 * 1024 * 1024) return

  try {
    const response = await vendorMasterDataStore.uploadFile({
      FormFile: file,
      Actioner: 'anonym',
      FolderName: 'invoice',
      FileName: file.name,
    })

    emits('setFile', {
      name: response.name,
      url: response.url,
      urlWithToken: response.urlWithToken
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
