
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Document Attachment
      </h3>
    </div>
    <div class="card-body">
      <div class="text-sm mb-[20px]">
        <p class="text-gray-600">Tender Technical Proposal</p>
         <pdfUpload v-show="!technicalProposal" @setFile="setFileTechnical" isHoldUpload>
           <p class="border-b border-dashed border-primary w-fit pb-[4px] text-primary cursor-pointer">Upload Document</p>
         </pdfUpload>
         <AttachmentView v-show="technicalProposal" :fileData="technicalProposal" />
      </div>
      <div class="text-sm mb-[20px]">
        <p class="text-gray-600">Tender Commercial Proposal</p>
         <pdfUpload v-show="!commercialProposal" @setFile="setFileCommercial" isHoldUpload>
           <p class="border-b border-dashed border-primary w-fit pb-[4px] text-primary cursor-pointer">Upload Document</p>
         </pdfUpload>
         <AttachmentView v-show="commercialProposal" :fileData="commercialProposal" />
      </div>
      <div class="text-sm mb-[20px]">
        <p class="text-gray-600">Other Document</p>
         <pdfUpload v-show="!otherDocument" @setFile="setFileOther" isHoldUpload>
           <p class="border-b border-dashed border-primary w-fit pb-[4px] text-primary cursor-pointer">Upload Document</p>
         </pdfUpload>
         <AttachmentView v-show="otherDocument" :fileData="otherDocument" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import pdfUpload from '@/components/ui/pdfUpload/pdfUpload.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import type { attachmentFileTypes } from '@/components/ui/attachment/types/attachment-view'

const technicalProposal = ref<attachmentFileTypes | null>(null)
const commercialProposal = ref<attachmentFileTypes | null>(null)
const otherDocument = ref<attachmentFileTypes | null>(null)

const setFileTechnical = () => {
  technicalProposal.value = {
    name: 'document1.pdf',
    path: ''
  }
}

const setFileCommercial = () => {
  commercialProposal.value = {
    name: 'document1.pdf',
    path: ''
  }
}

const setFileOther = () => {
  otherDocument.value = {
    name: 'document1.pdf',
    path: ''
  }
}
</script>
