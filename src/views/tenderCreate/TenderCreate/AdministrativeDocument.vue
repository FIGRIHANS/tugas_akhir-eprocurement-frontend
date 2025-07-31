<template>
  <div>
    <div class="border rounded-xl flex align-items-center gap-[24px] p-[24px]">
      <GeneralData class="flex-1" />
      <TenderOrganization class="flex-1" />
      <DocumentAttachment class="flex-1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import GeneralData from './AdministrativeDocument/GeneralData.vue'
import TenderOrganization from './AdministrativeDocument/TenderOrganization.vue'
import DocumentAttachment from './AdministrativeDocument/DocumentAttachment.vue'
</script>
