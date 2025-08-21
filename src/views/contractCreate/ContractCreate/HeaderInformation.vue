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
import GeneralData from './HeaderInformation/GeneralData.vue'
import TableItem from './HeaderInformation/TableItem.vue'
</script>

<style lang="scss" scoped>
@use '../styles/headerInformation.scss';
</style>
