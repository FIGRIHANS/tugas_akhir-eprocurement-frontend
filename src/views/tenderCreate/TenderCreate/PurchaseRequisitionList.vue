<template>
  <div>
    <div class="border rounded-md p-[24px]">
      <GeneralData />
    </div>
    <div class="border rounded-md p-[24px] mt-[24px]">
      <TableItem />
    </div>
  </div>
</template>

<script lang="ts" setup>
import GeneralData from './PurchaseRequisitionList/GeneralData.vue'
import TableItem from './PurchaseRequisitionList/TableItem.vue'
</script>
