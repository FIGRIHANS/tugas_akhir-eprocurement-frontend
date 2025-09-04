<template>
  <div class="flex flex-col gap-6">
    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">{{ $t('vendorProfile.administration') }}</h3>
      </div>

      <div class="card-table">
        <table class="table align-middle">
          <tbody>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.username') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.userName || '-' }}</span>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.country') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.countryName || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.emailUser') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.userEmail || '-' }}</span>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.province') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.stateName || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.companyName') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.vendorName || '-' }}</span>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.city') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.cityName || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.companyCategory') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.companyCategoryName || '-' }}</span>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.telephone') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.vendorPhone || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.companyGroup') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.groupCompany || '-' }}</span>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.vendorEmail') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.vendorEmail || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.npwpNo') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.npwp || '-' }}</span>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.website') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.vendorWebsite || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.npwpDoc') }}</td>
              <td class="font-bold w-1/3">
                <span v-if="!data?.npwpUrl">-</span>
                <UiButton
                  v-else
                  variant="primary"
                  outline
                  size="sm"
                  @click="downloadFile(data.npwpUrl)"
                >
                  <UiIcon name="cloud-download" variant="duotone" />
                  {{ $t('general.download', { field: $t('vendorProfile.npwpDoc') }) }}
                </UiButton>
              </td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">
                {{ $t('vendorProfile.currencyPreference') }}
              </td>
              <td class="font-bold w-1/3">
                <span>{{ `${data?.currencySymbol || '-'} (${data?.currencyLabel || '-'})` }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600"></td>
              <td class="font-bold w-1/3"></td>
              <td class="border-x w-6"></td>
              <td class="!pl-[1.875rem] text-gray-600">{{ $t('vendorProfile.companyAddress') }}</td>
              <td class="font-bold w-1/3">
                <span>{{ data?.addressCompanyDetail || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="text-gray-600">{{ $t('vendorProfile.businessField') }}</td>
              <td colspan="4" class="font-bold">
                <ol class="list-decimal list-inside">
                  <li
                    v-for="(businessField, index) in data?.businessFieldName?.split(',')"
                    :key="index"
                  >
                    {{ businessField.trim() }}
                  </li>
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const vendorStore = useVendorAdministrationStore()
const uploadStore = useUploadStore()

const data = computed(() => vendorStore.data)

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

onMounted(() => {
  props.vendorId && vendorStore.getData(String(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    vendorStore.getData(String(props.vendorId))
  },
)
</script>
