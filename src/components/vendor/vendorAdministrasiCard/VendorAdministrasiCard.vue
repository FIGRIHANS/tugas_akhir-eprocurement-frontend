<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IVendorAdministrasiCardProps } from './types/vendorAdministrasiCard'
import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const administrasiStore = useVendorAdministrationStore()
const route = useRoute()

withDefaults(defineProps<IVendorAdministrasiCardProps>(), {
  allowExport: false,
})

const baseUrl = import.meta.env.VITE_API_VENDOR_BASE_URL

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
      <div class="card-title">Administrasi</div>
      <UiButton :outline="true" v-if="allowExport">
        <UiIcon name="printer" variant="duotone" />
        <span>Export Data</span>
      </UiButton>
    </div>
    <div v-if="administrasiStore.loading" class="flex items-center justify-center">
      <UiIcon name="spinner" variant="duotone" class="animate-spin" />
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
                <td class="text-sm text-gray-600 font-medium w-[182px]">Email User</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorEmail }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Nama Perusahaan</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Kategori Perusahaan</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].companyCategoryName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Bisnis Unit</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].businessUnitName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Grup Perusahaan</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].groupCompany }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Nomor NPWP</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].npwp }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Berkas NPWP</td>
                <td class="text-sm font-bold text-gray-700">
                  <a :href="`${baseUrl}/${administrasiStore.data[0].npwpUrl}`" target="_blank">
                    <UiButton :outline="true" size="sm">
                      <UiIcon name="cloud-download" variant="duotone" />
                      <span>Download Dokumen NPWP</span>
                    </UiButton>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-table border">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Provinsi</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].stateName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Kota</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].cityName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Telepon</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].vendorPhone }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Fax</td>
                <td class="text-sm font-bold text-gray-700">-</td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Email Vendor</td>
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
                <td class="text-sm text-gray-600 font-medium w-[182px]">Preferensi Mata Uang</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].currencyLabel }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">Bidang Usaha</td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data[0].businessFieldName }}
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
              <td class="text-sm text-gray-600 font-medium w-[182px]">Alamat Perusahaan</td>
              <td class="text-sm font-bold text-gray-700">
                {{ administrasiStore.data[0].addressCompanyDetail }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
