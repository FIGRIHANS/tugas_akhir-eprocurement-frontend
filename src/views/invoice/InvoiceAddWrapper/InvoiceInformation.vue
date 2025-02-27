<template>
  <div>
    <div class="flex gap-[24px]">
      <HeaderDocument />
      <InvoiceCalculation />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderDocument from './InvoiceInformation/HeaderDocument.vue'
import InvoiceCalculation from './InvoiceInformation/InvoiceCalculation.vue'
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>
