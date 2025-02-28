<template>
  <div class="flex items-center gap-[10px]">
    <iconPDF />
    <div v-if="fileData">
      <p class="text-sm font-medium mb-[4px]">{{ fileData.name }}</p>
      <div class="text-xs font-normal m-[0px] flex gap-[5px] items-center">
        <span>{{ Number(fileData.size / (1024 * 1024)).toFixed(2) }} MB</span>
        <span class="w-[4px] h-[5px] rounded-full bg-gray-700"></span>
        <span>{{ moment(fileData.lastModified).format('DD MMM YYYY, hh:mm A') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import iconPDF from '../../icons/iconPDF.vue'
import moment from 'moment'

defineProps<{
  fileData: File | null
}>()
</script>
