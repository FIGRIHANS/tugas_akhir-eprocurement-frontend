<template>
  <div class="file-upload">
    <input type="file" ref="fileInput" accept=".pdf" @change="handleFileUpload" class="hidden" />

    <div class="flex items-center" @click="triggerFileInput">
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
import { ref } from 'vue'
import IconUpload from './PdfUpload/IconUpload.vue'

const emits = defineEmits(['setFile'])

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  if (file.size > 2 * 1024 * 1024) return

  emits('setFile', file)
}
</script>

<style lang="scss" scoped>
@use './styles/upload.scss';
</style>
