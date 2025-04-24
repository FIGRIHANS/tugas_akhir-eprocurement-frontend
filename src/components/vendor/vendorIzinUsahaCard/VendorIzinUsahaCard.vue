<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { formatDate } from '@/core/utils/format'
import { useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const izinUsahaStore = useVendorIzinUsahaStore()
const route = useRoute()
watch(
  () => route.params.id,
  (id) => {
    izinUsahaStore.getData(id as string)
  },
  { immediate: true },
)
</script>
<template>
  <div class="card card-grid">
    <div class="card-header">
      <div class="card-title">Data Izin Usaha</div>
    </div>
    <div class="card-table">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Jenis Izin Usaha</th>
            <th>No. Izin Usaha</th>
            <th>Tanggal Mulai Berlaku</th>
            <th>Tanggal Selesai</th>
            <th>Instansi Penerbit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="izinUsahaStore.loading">
            <td colspan="5" class="text-center">
              <span class="text-xl text-primary">
                <UiIcon name="abstract-33" variant="duotone" class="mx-auto animate-spin" />
              </span>
            </td>
          </tr>
          <tr v-else-if="izinUsahaStore.error">
            <td colspan="5" class="text-center">
              {{ izinUsahaStore.error }}
            </td>
          </tr>
          <tr v-else v-for="item in izinUsahaStore.data" :key="item.licenseId">
            <td>{{ item.licenseName }}</td>
            <td>{{ item.licenseNo }}</td>
            <td>
              {{ item.issuedUTCDate ? formatDate(new Date(item.issuedUTCDate as string)) : '-' }}
            </td>
            <td>
              {{ item.expiredUTCDate ? formatDate(new Date(item.expiredUTCDate as string)) : '-' }}
            </td>
            <td>{{ item.issuedBy ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
