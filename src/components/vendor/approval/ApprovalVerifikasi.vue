<script lang="ts" setup>
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { ref } from 'vue'

defineProps<{ id: string | number; nama: string }>()

const modal = ref(false)
</script>
<template>
  <UiButton size="sm" :icon="true" variant="primary" :outline="true" @click="modal = !modal">
    <UiIcon name="data" variant="duotone" />
  </UiButton>

  <UiModal title="Vendor Verification Approval" v-model="modal" size="lg">
    <h3 class="font-semibold text-lg text-gray-800 text-center mb-5">{{ nama }}</h3>
    <div class="scrollable-x-auto">
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap border-b border-primary">
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
            <td>Edi Sutrisno</td>
            <td>Manager Keuangan</td>
            <td>2021-03-03 17:30:26</td>
            <td>Vendor Approval</td>
            <td>Approved</td>
            <td>Oke sesuai dengan SOP</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiModal>
</template>
