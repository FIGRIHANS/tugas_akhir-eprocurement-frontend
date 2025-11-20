<template>
  <div class="flex items-center gap-[10px]" :class="{ 'flex-row-reverse': reverseIcon }">
    <!-- Icons -->
    <iconPDF v-if="extension === 'pdf'" />
    <iconExcel v-else-if="['xls', 'xlsx'].includes(extension)" />
    <iconImage v-else-if="['jpg', 'jpeg', 'png'].includes(extension)" />
    <IconWord v-else-if="['doc', 'docx'].includes(extension)" />

    <div v-if="fileData">
      <!-- File Name With Truncate + Tooltip -->
      <p class="text-sm font-medium mb-[4px]" :title="fileData?.name">
        {{ displayName }}
      </p>

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
import { computed } from 'vue'

const props = defineProps<{
  fileData: attachmentFileTypes | null
  uploadDate?: string
  reverseIcon?: boolean
  maxLength?: number
}>()

// Mengambil fullname
const rawName = computed(() => {
  if (props.fileData?.name) return props.fileData.name

  if (props.fileData?.path) {
    const splitUrl = props.fileData.path.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  return ''
})

// Display truncated name
const displayName = computed(() => {
  const full = rawName.value
  const max = props.maxLength

  if (!max || full.length <= max) return full

  return full.substring(0, max) + '...'
})

// Extension helper
const extension = computed(() => {
  const full = rawName.value
  return full.split('.').pop()?.toLowerCase() || ''
})
</script>
