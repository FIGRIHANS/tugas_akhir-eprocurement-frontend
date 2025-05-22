<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
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
      <div class="card-title">Business Licenses</div>
    </div>
    <div class="card-table">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>License Type</th>
            <th>License Number</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Document</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="izinUsahaStore.loading">
            <td colspan="5" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>
          <tr v-else-if="izinUsahaStore.error">
            <td colspan="5" class="text-center">
              {{ izinUsahaStore.error }}
            </td>
          </tr>
          <tr v-else-if="!izinUsahaStore.data.length">
            <td colspan="5" class="text-center">No data</td>
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
            <td>
              <a
                :href="item.documentUrl"
                target="_blank"
                class="btn btn-primary btn-outline btn-sm"
              >
                <UiIcon name="cloud-download" variant="duotone" />
                <span>Download Document</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
