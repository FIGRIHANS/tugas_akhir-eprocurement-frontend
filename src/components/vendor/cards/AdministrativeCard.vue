<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
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
      <div class="card-title">{{ $t('vendorVerification.administration.administration') }}</div>
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
    <div v-else-if="!administrasiStore.data" class="flex items-center justify-center py-5">
      <span class="text-sm font-medium"> Oops! No data </span>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="card-table border">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.username') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.userName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.useremail') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.userEmail }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.companyname') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.vendorName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.companycategory') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.companyCategoryName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.companygroup') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.groupCompany }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.npwpnumber') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.npwp }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.npwpdoc') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  <UiButton
                    :outline="true"
                    size="sm"
                    @click="download(administrasiStore.data.npwpUrl)"
                    :disabled="loading"
                  >
                    <span v-if="loading">
                      <UiLoading />
                    </span>
                    <template v-else>
                      <UiIcon name="cloud-download" variant="duotone" />
                      <span>
                        {{
                          $t('general.download', {
                            field: $t('vendorVerification.administration.npwpdoc'),
                          })
                        }}</span
                      >
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
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.country') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.countryName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.province') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.stateName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.city') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.cityName }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.telephone') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.vendorPhone }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.vendoremail') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.vendorEmail }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.website') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.vendorWebsite }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.currencyPref') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.currencyLabel }}
                </td>
              </tr>
              <tr>
                <td class="text-sm text-gray-600 font-medium w-[182px]">
                  {{ $t('vendorVerification.administration.companyaddress') }}
                </td>
                <td class="text-sm font-bold text-gray-700">
                  {{ administrasiStore.data.addressCompanyDetail }}
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
              <td class="text-sm text-gray-600 font-medium w-[182px]">
                {{ $t('vendorVerification.administration.bussinessfield') }}
              </td>
              <td class="text-sm text-gray-700">
                <ul>
                  <li
                    v-for="(bf, index) in administrasiStore.data.businessFieldName?.split(',')"
                    :key="bf"
                  >
                    <strong> {{ index + 1 }}. {{ bf.split('(')[0]?.trim() ?? bf }}, </strong>
                    <span>{{ bf.split('(')[1]?.trim()?.replace(')', '') ?? '' }}</span>
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
