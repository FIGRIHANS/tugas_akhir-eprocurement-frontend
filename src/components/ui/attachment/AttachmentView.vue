<template>
  <div class="flex items-center gap-[10px]" :class="{ 'flex-row-reverse': reverseIcon }">
    <iconPDF v-if="getExtention() === 'pdf'" />
    <iconExcel v-if="getExtention() === 'xls' || getExtention() === 'xlsx'" />
    <iconImage v-if="getExtention() === 'jpg' || getExtention() === 'jpeg' || getExtention() === 'png'" />
    <IconWord v-if="getExtention() === 'doc' || getExtention() === 'docx'" />
    <div v-if="fileData">
      <p class="text-sm font-medium mb-[4px]">{{ fileName() }}</p>
      <p v-if="uploadDate" class="text-xs text-gray-700">
        {{ $t('general.uploaded') }}: {{ uploadDate }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import iconPDF from '../../icons/iconPDF.vue'
import iconExcel from '@/components/icons/iconExcel.vue'
import iconImage from '@/components/icons/iconImage.vue'
import IconWord from '@/components/icons/IconWord.vue'
import type { attachmentFileTypes } from './types/attachment-view'

const props = defineProps<{
  fileData: attachmentFileTypes | null
  uploadDate?: string
  reverseIcon?: boolean
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

const getExtention = () => {
  const nameFile = fileName()
  const splitExntention = nameFile.split('.')
  return splitExntention[1]
}
</script>
