<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import type { IVendorVerificationProps } from './types/vendorVerification'

defineProps<IVendorVerificationProps>()
defineEmits(['close'])
</script>
<template>
  <UiModal :open="open" title="Detail Verification Vendor" @close="$emit('close')">
    <h3 class="text-center text-lg">Vendor: PT Agung sejahtera</h3>
    <div class="modal-table scrollable-auto">
      <table class="table align-middle">
        <thead>
          <tr class="border-b-2 border-b-primary">
            <th>Nama Verificator</th>
            <th>Jabatan</th>
            <th>Tanggal Verifikasi</th>
            <th>Status</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiModal>
</template>
