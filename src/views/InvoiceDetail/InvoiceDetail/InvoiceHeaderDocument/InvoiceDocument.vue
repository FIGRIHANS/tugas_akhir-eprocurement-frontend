<template>
  <div class="flex flex-col gap-[20px]">
    <div>
      <p class="font-normal text-sm text-gray-600">Invoice No</p>
      <div class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="testFile" />
        <button class="btn btn-icon btn-outline btn-primary">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
    <div>
      <p class="font-normal text-sm text-gray-600">Faktur Pajak</p>
      <div class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="testFile" />
        <button class="btn btn-icon btn-outline btn-primary">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
    <div>
      <p class="font-normal text-sm text-gray-600">Reference Document</p>
      <div class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="testFile" />
        <button class="btn btn-icon btn-outline btn-primary">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
    <div>
      <p class="font-normal text-sm text-gray-600">Other Document</p>
      <div class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="testFile" />
        <button class="btn btn-icon btn-outline btn-primary">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'

const testFile = ref<File | null>(null)

onMounted(() => {
  const content = "Ini teks biasa untuk PDF"
  const blob = new Blob([content], { type: "application/pdf" })
  testFile.value = new File([blob], "dummy_data.pdf", { type: "application/pdf" })
})
</script>
