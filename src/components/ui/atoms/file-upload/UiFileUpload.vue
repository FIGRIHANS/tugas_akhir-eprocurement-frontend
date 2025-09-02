<template>
  <div :class="{ 'flex items-center flex-wrap lg:flex-nowrap gap-2.5': label }">
    <label class="form-label w-2/5" :class="{ 'flex items-center gap-1': required }">
      {{ label }} <span v-if="required" class="text-danger"> * </span>
    </label>

    <label :for="name" class="w-full flex flex-col">
      <div class="input-group w-full">
        <span
          class="btn btn-input bg-primary-clarity border rounded-r-none border-primary"
          :class="{ 'flex items-center gap-1': required, '!border-danger': error }"
        >
          <i class="ki-filled ki-cloud-add !text-primary"></i>
        </span>
        <span
          class="input select-none !text-primary bg-primary-light border-primary hover:border-primary"
          :class="{ 'flex items-center gap-1': required, '!border-danger': error }"
          :title="selectedFile"
        >
          {{ truncateSelectedFile }}
        </span>
      </div>
      <span v-if="hintText" class="text-xs text-danger">{{ hintText }}</span>
    </label>

    <input
      :id="name"
      class="hidden"
      :disabled="disabled"
      :accept="acceptedFiles"
      type="file"
      hidden
      @change="uploadFile($event)"
      ref="fileEl"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import type { IFileUploadProps } from './types/file-upload'

const props = withDefaults(defineProps<IFileUploadProps>(), {
  placeholder: '',
  disabled: false,
  required: false,
  error: false,
  hintText: '',
})
const emits = defineEmits(['addedFile', 'uploadFailed', 'cleared'])

const selectedFile = ref(props.placeholder)
const fileEl = ref<HTMLInputElement | null>(null)

const truncateSelectedFile = computed(() => {
  if (props.textLength && selectedFile.value) {
    return selectedFile.value.length > props.textLength
      ? selectedFile.value.substring(0, props.textLength) + '...'
      : selectedFile.value
  }
  return selectedFile.value
})

const uploadFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  const isBelowMaxSize = file && props.maxSize ? file.size <= props.maxSize : true

  if (file && isBelowMaxSize) {
    selectedFile.value = file.name
    emits('addedFile', file)
  } else {
    emits('uploadFailed', true)
  }
}

const clear = () => {
  if (fileEl.value) fileEl.value.value = ''
  selectedFile.value = props.placeholder || ''
  emits('cleared')
}

defineExpose({ clear })

watch(
  () => props.placeholder,
  (newVal) => {
    if (!fileEl.value || fileEl.value.value === '') {
      selectedFile.value = newVal
    }
  },
)
</script>
