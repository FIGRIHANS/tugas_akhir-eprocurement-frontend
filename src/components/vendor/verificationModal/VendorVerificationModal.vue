<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiLoading from '@/components/UiLoading.vue'
import { formatDate } from '@/core/utils/format'
import { useVerificationDetailStore } from '@/stores/vendor/vendor'
import { onMounted } from 'vue'

const verificationStore = useVerificationDetailStore()
const props = defineProps<{ id: string | number; name: string }>()
const open = defineModel()
defineEmits(['close'])

onMounted(() => {
  verificationStore.getData(props.id as number)
})
</script>
<template>
  <UiModal v-model="open" title="Approval Verifikasi Vendor" size="lg">
    <div class="space-y-5 mb-5">
      <h3 class="text-center text-lg">Detail Verifikasi {{ name }}</h3>
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
            <tr v-if="verificationStore.loading">
              <td colspan="7" class="text-center">
                <UiLoading />
              </td>
            </tr>
            <tr v-else-if="verificationStore.error">
              <td colspan="7" class="text-center text-danger">{{ verificationStore.error }}</td>
            </tr>
            <tr v-else-if="!verificationStore.data.length">
              <td colspan="7" class="text-center">No data</td>
            </tr>

            <tr v-else v-for="(item, index) in verificationStore.data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.verificatorName }}</td>
              <td>{{ item.position }}</td>
              <td>{{ item.createdDate ? formatDate(new Date(item.createdDate)) : '-' }}</td>
              <td>{{ item.verificationType }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.keterangan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="space-y-5 hidden">
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
