<template>
  <div class="flex flex-col gap-4">
    <h2 class="font-semibold leading-[25px]">Nama Perusahaan</h2>
    <div class="grid grid-cols-3 gap-4">
      <UiInput label="Nama Perusahaan" placeholder="Masukkan Nama Perusahaan" />
      <UiInput label="Group Perusahaan" placeholder="Masukkan Group Perusahaan" />
      <UiInput label="Tanggal Berdiri" placeholder="Pilih Tanggal" />
    </div>
    <hr class="border-gray-300">

    <h2 class="font-semibold leading-[25px]">Lokasi Kantor Pusat</h2>
    <hr class="border-gray-300">

    <h2 class="font-semibold leading-[25px]">Lokasi Perusahaan</h2>
    <hr class="border-gray-300">

    <h2 class="font-semibold leading-[25px]">Bidang Usaha & Bisnis Unit</h2>

    <div class="flex justify-between">
      <UiButton outline>Save As Draft <UiIcon name="bookmark" variant="duotone" /></UiButton>
      <UiButton>Lanjut <UiIcon name="black-right" /></UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
</script>
