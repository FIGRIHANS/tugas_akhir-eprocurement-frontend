<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'

defineProps<{ id: string | number }>()
const open = defineModel()
defineEmits(['close'])
</script>
<template>
  <UiModal v-model="open" title="Approval Verifikasi Vendor" size="lg">
    <div class="space-y-5 mb-5">
      <h3 class="text-center text-lg">Detail Verifikasi PT Agung sejahtera</h3>
      <div class="modal-table scrollable-auto">
        <table class="table align-middle">
          <thead>
            <tr class="border-b-2 border-b-primary text-nowrap">
              <th>No</th>
              <th>Nama Verificator</th>
              <th>Jabatan</th>
              <th>Tanggal Verifikasi</th>
              <th>Jenis Verifikasi</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Susi Susanti</td>
              <td>Manajer Keuangan</td>
              <td>2021-03-03</td>
              <td>Vendor Approval</td>
              <td>On Proccess</td>
              <td>Oke Sesuai dengan SOP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="space-y-5">
      <h3 class="text-center text-lg">Detail Approval PT Agung sejahtera</h3>
      <div class="modal-table scrollable-auto">
        <table class="table align-middle">
          <thead>
            <tr class="border-b-2 border-b-primary text-nowrap">
              <th>No</th>
              <th>Nama Approver</th>
              <th>Jabatan</th>
              <th>Tanggal Approval</th>
              <th>Jenis Approval</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Susi Susanti</td>
              <td>Kepala cabang</td>
              <td>2021-03-03</td>
              <td>Payment Approval</td>
              <td>On Proccess</td>
              <td>Oke Sesuai dengan SOP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UiModal>
</template>
