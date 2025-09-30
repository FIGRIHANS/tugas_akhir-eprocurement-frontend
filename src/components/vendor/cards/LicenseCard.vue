<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import { formatDate } from '@/core/utils/format'
import { type ILicense } from '@/stores/vendor/types/vendor'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const izinUsahaStore = useVendorIzinUsahaStore()
const uploadStore = useVendorUploadStore()

const route = useRoute()

const loading = ref<boolean>(false)
const error = ref<string>('')

const download = async (path: string) => {
  loading.value = true
  error.value = ''

  try {
    const file = await uploadStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (err) {
    console.error(err)
    alert('Failed to download document. Please try again later.')
  } finally {
    loading.value = false
  }
}

const sortedLicenses = computed<ILicense[]>(() => {
  return izinUsahaStore.data.slice().sort((a, b) => {
    if (a.seq && b.seq) {
      return a.seq - b.seq
    }
    return 0
  })
})

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
      <div class="card-title">{{ $t('vendorVerification.businessLicenses.businesslicenses') }}</div>
    </div>
    <div class="card-table scrollable-x-auto">
      <table class="table align-middle table-border">
        <thead>
          <tr class="text-nowrap">
            <th>{{ $t('vendorVerification.businessLicenses.licensetype') }}</th>
            <th>{{ $t('vendorVerification.businessLicenses.licensenumber') }}</th>
            <th>{{ $t('vendorVerification.businessLicenses.startdate') }}</th>
            <th>{{ $t('vendorVerification.businessLicenses.enddate') }}</th>
            <th>{{ $t('vendorVerification.businessLicenses.document') }}</th>
          </tr>
        </thead>
        <tbody class="text-nowrap">
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
          <tr v-else v-for="item in sortedLicenses" :key="item.licenseId">
            <td>{{ item.licenseName }}</td>
            <td>{{ item.licenseNo }}</td>
            <td>
              {{
                item.issuedUTCDate ? formatDate(new Date(item.issuedUTCDate as string), 'us') : '-'
              }}
            </td>
            <td>
              {{
                item.expiredUTCDate
                  ? formatDate(new Date(item.expiredUTCDate as string), 'us')
                  : '-'
              }}
            </td>
            <td>
              <UiButton
                :disabled="loading"
                :outline="true"
                size="sm"
                @click="download(item.documentUrl)"
              >
                <UiIcon name="cloud-download" variant="duotone" />
                <span>{{
                  $t('general.download', {
                    field: $t('vendorVerification.businessLicenses.document'),
                  })
                }}</span>
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
