<template>
  <div :class="{ 'flex items-center flex-wrap lg:flex-nowrap gap-2.5': label }">
    <label class="form-label w-2/5" :class="{ 'flex items-center gap-1': required }">
      {{ label }} <span v-if="required" class="text-danger"> * </span>
    </label>

    <label :for="name" class="w-full flex flex-col">
      <div class="input-group w-full">
        <span
          class="btn btn-input bg-primary-clarity border rounded-r-none border-primary"
          :class="{ 'flex items-center gap-1': required, 'border-danger': error }"
          ><i class="ki-filled ki-cloud-add !text-primary"> </i
        ></span>
        <span
          class="input select-none !text-primary bg-primary-light border-primary hover:border-primary"
          :class="{ 'flex items-center gap-1': required, 'border-danger': error }"
          :title="selectedFile"
        >
          {{ truncateSelectedFile }}
        </span>
      </div>
      <span v-if="hintText" class="text-xs text-danger"> {{ hintText }} </span>
    </label>
    <input
      :id="name"
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
import { computed, ref } from 'vue'
import type { IFileUploadProps } from './types/file-upload'

const props = withDefaults(defineProps<IFileUploadProps>(), {
  name: 'upload-file',
  placeholder: '',
  disabled: false,
  required: false,
  error: false,
  hintText: '',
})
const emits = defineEmits(['addedFile'])

const selectedFile = ref(props.placeholder)

const truncateSelectedFile = computed(() => {
  if (props.textLength && selectedFile.value !== props.placeholder) {
    return selectedFile.value.substring(0, props.textLength) + '...'
  }

  return selectedFile.value
})

const uploadFile = (event: Event) => {
  const filesUploaded = event.target as HTMLInputElement
  const isBelowMaxSize =
    filesUploaded.files && props.maxSize ? filesUploaded.files[0].size <= props.maxSize : true

  if (filesUploaded.files && filesUploaded.files?.length > 0 && isBelowMaxSize) {
    selectedFile.value = filesUploaded.files[0].name
    emits('addedFile', filesUploaded.files[0])
  }
}
</script>
