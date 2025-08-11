<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Document Attachment
      </h3>
    </div>
    <div class="card-body">
      <div class="mb-[20px]">
        <div class="text-gray-600 text-sm mb-2">Tender Technical Proposal</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="/media/file-types/pdf.svg" alt="PDF" class="w-5 h-5" />
            <span class="text-blue-600 cursor-pointer hover:underline text-sm">
              {{ documents?.technicalProposal || 'filename.pdf' }}
            </span>
          </div>
          <button class="btn btn-sm btn-icon btn-light" @click="editDocument('technical')">
            <i class="ki-duotone ki-pencil text-blue-600 fs-6">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
        </div>
      </div>
      <div class="mb-[20px]">
        <div class="text-gray-600 text-sm mb-2">Tender Commercial Proposal</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="/media/file-types/pdf.svg" alt="PDF" class="w-5 h-5" />
            <span class="text-blue-600 cursor-pointer hover:underline text-sm">
              {{ documents?.commercialProposal || 'filename.pdf' }}
            </span>
          </div>
          <button class="btn btn-sm btn-icon btn-light" @click="editDocument('commercial')">
            <i class="ki-duotone ki-pencil text-blue-600 fs-6">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
        </div>
      </div>
      <div>
        <div class="text-gray-600 text-sm mb-2">Other Document</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="/media/file-types/pdf.svg" alt="PDF" class="w-5 h-5" />
            <span class="text-blue-600 cursor-pointer hover:underline text-sm">
              {{ documents?.otherDocument || 'filename.pdf' }}
            </span>
          </div>
          <button class="btn btn-sm btn-icon btn-light" @click="editDocument('other')">
            <i class="ki-duotone ki-pencil text-blue-600 fs-6">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    inject
  } from 'vue'

  interface DocumentsType {
    technicalProposal: string
    commercialProposal: string
    otherDocument: string
  }

  const documents = inject < DocumentsType > ('documents')

  const editDocument = (type: string) => {
    console.log(`Editing document: ${type}`)
  }
</script>
