<template>
  <div class="flex items-center gap-[10px]">
    <iconPDF />
    <div>
      <p class="text-sm font-medium mb-[4px]">Invoice Dokumen.pdf</p>
      <div class="text-xs font-normal m-[0px] flex gap-[5px] items-center">
        <span>4.7 MB</span>
        <span class="w-[4px] h-[5px] rounded-full bg-gray-700"></span>
        <span>26 Sep 2024 3:20 PM</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import iconPDF from '../../icons/iconPDF.vue'
</script>
