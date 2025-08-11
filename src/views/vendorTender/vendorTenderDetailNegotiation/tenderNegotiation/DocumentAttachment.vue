
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Document Tender
      </h3>
    </div>
    <div class="card-body">
      <div class="text-sm mb-[20px]">
        <p class="text-gray-600">Tender Technical Proposal</p>
        <AttachmentView :fileData="dummyData" class="mt-[10px]" />
      </div>
      <div class="text-sm mb-[20px]">
        <p class="text-gray-600">Tender Commercial Proposal</p>
        <AttachmentView :fileData="dummyData" class="mt-[10px]" />
      </div>
      <div class="text-sm mb-[20px]">
        <p class="text-gray-600">Other Document</p>
        <AttachmentView :fileData="dummyData" class="mt-[10px]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import type { attachmentFileTypes } from '@/components/ui/attachment/types/attachment-view'

const dummyData = ref<attachmentFileTypes>({
  name: 'fileDummy',
  path: ''
})
</script>
