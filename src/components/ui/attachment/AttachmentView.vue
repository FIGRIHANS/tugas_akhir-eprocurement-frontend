<template>
  <div class="flex items-center gap-[10px]">
    <iconPDF />
    <div v-if="fileData">
      <p class="text-sm font-medium mb-[4px]">{{ fileName() }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import iconPDF from '../../icons/iconPDF.vue'
import type { attachmentFileTypes } from './types/attachment-view'

const props = defineProps<{
  fileData: attachmentFileTypes | null
}>()

const fileName = () => {
  if (props.fileData?.name) return props.fileData.name
  // else {
  //   if (props.fileData) {
  //     const splitUrl = props.fileData.url.split('/')
  //     const getName = splitUrl[splitUrl.length - 1].split('.')
  //     return getName[0]
  //   }
  // }
}
</script>
