<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IVendorAdministrasiCardProps } from './types/vendorAdministrasiCard'
import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import { useVendorUploadStore } from '@/stores/vendor/upload'

const administrasiStore = useVendorAdministrationStore()
const uploadStore = useVendorUploadStore()
const route = useRoute()

const loading = ref<boolean>(false)
const error = ref<string>('')

withDefaults(defineProps<IVendorAdministrasiCardProps>(), {
  allowExport: false,
})

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

watch(
  () => route.params.id,
  (id) => {
    administrasiStore.getData(id as string)
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">Administration</div>
      <UiButton :outline="true" v-if="allowExport">
        <UiIcon name="printer" variant="duotone" />
        <span>Export Data</span>
      </UiButton>
    </div>
    <div
      v-if="administrasiStore.loading"
      class="flex items-center justify-center text-xl text-primary py-5"
    >
      <UiLoading size="md" />
    </div>
    <div v-else-if="administrasiStore.error" class="flex items-center justify-center py-5">
      <span class="text-sm text-red-500 font-medium">
        {{ administrasiStore.error }}
      </span>
    </div>
    <div v-else-if="!administrasiStore.data.length" class="flex items-center justify-center py-5">
      <span class="text-sm font-medium"> Oops! No data </span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="card-table border">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Username</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].userName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">User Email</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorEmail }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Company Name</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Company Category</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].companyCategoryName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Company Group</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].groupCompany }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">NPWP Number</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].npwp }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">NPWP Document</td>
                <td class="text-sm font-bold text-gray-700">
                  <UiButton
                    :outline="true"
                    size="sm"
                    @click="download(administrasiStore.data[0].npwpUrl)"
                    :disabled="loading"
                  >
                    <span v-if="loading">
                      <UiLoading />
                    </span>
                    <template v-else>
                      <UiIcon name="cloud-download" variant="duotone" />
                      <span>Download NPWP Document</span>
                    </template>
                  </UiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-table border">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Country</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].countryName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Province</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].stateName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Regency/City</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].cityName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Telephone</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorPhone }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Vendor Email</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorEmail }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Website</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorWebsite }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Currency Preference</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].currencyLabel }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Company Address</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].addressCompanyDetail }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-table border">
        <table class="table align-middle">
          <tbody>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Business Fields</td>
              <td class="text-sm font-bold text-gray-700">
                <ul>
                  <li
                    v-for="(bf, index) in administrasiStore.data[0].businessFieldName?.split(',')"
                    :key="bf"
                  >
                    {{ index + 1 }}.
                    {{ administrasiStore.data[0].businessFieldName }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
