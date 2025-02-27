<template>
  <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
    <label class="form-label w-2/5">
      {{ label }}
    </label>

    <label for="upload-file" class="w-full">
      <div class="input-group w-full">
        <span class="btn btn-input bg-primary-clarity border rounded-r-none border-primary"
          ><i class="ki-filled ki-file-up !text-primary"> </i
        ></span>
        <span
          class="input select-none !text-primary bg-primary-light border-primary hover:border-primary"
        >
          {{ selectedFile }}
        </span>
      </div>
    </label>
    <input
      id="upload-file"
      class="hidden"
      :disabled="disabled"
      :accept="acceptedFiles"
      type="file"
      hidden
      @change="uploadFile($event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { IFileUploadProps } from './types/file-upload'

const props = withDefaults(defineProps<IFileUploadProps>(), {
  placeholder: '',
  disabled: false,
})
const emits = defineEmits(['addedFile'])

const selectedFile = ref(props.placeholder)

const uploadFile = (event: Event) => {
  const filesUploaded = event.target as HTMLInputElement
  if (filesUploaded.files && filesUploaded.files?.length > 0) {
    selectedFile.value = filesUploaded.files[0].name
    emits('addedFile', filesUploaded.files[0])
  }
}
</script>
