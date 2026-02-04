<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import { useVendorPaymentStore } from '@/stores/vendor/vendor'
import { ref, watch } from 'vue'
// import { useRoute } from 'vue-router'

const paymentStore = useVendorPaymentStore()
const uploadStore = useVendorUploadStore()
// const route = useRoute()

const loading = ref<boolean>(false)
const error = ref<string>('')

const props = defineProps<{
  vendorId: string
}>()

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
  () => props.vendorId,
  (id) => {
    paymentStore.getData(id as string)
  },
  { immediate: true },
)
</script>
<template>
  <div class="card card-grid">
    <div class="card-header">
      <div class="card-title">{{ $t('vendorVerification.paymentinfo.paymentinfo') }}</div>
    </div>
    <div class="card-body">
      <div v-if="paymentStore.loading" class="flex items-center justify-center py-5">
        <UiLoading size="md" />
      </div>

      <div v-else-if="paymentStore.error" class="flex items-center justify-center py-5">
        <span class="text-red-500 font-medium">
          {{ paymentStore.error }}
        </span>
      </div>

      <div v-else-if="!paymentStore.data.length" class="flex items-center justify-center py-5">
        <span class="text-gray-700 font-medium"> Oops! No Data </span>
      </div>

      <table class="table align-middle" v-else>
        <tbody>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.accountno') }}
            </td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].accountNo }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.accountholdername') }}
            </td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].accountName }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium"></td>
            <td class="text-sm font-bold text-gray-500">
              <input type="checkbox" class="checkbox checkbox-sm mr-1"
                :checked="paymentStore.data[0].isHolderNameDifferent" disabled />
              {{ $t('vendorVerification.paymentinfo.holdernamedifferent') }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.accountdiscrepancystatement') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              <UiButton :disabled="loading || !paymentStore.data[0].urlAccountDifferences" :outline="true" size="sm"
                @click="download(paymentStore.data[0].urlAccountDifferences as string)">
                <UiIcon name="cloud-download" variant="duotone" />
                <span>{{
                  $t('general.download', {
                    field: $t('vendorVerification.paymentinfo.accountdiscrepancystatement'),
                  })
                }}</span>
              </UiButton>
            </td>
          </tr>

          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.accountcover') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              <UiButton :disabled="loading || !paymentStore.data[0].urlFirstPage" :outline="true" size="sm"
                @click="download(paymentStore.data[0].urlFirstPage as string)">
                <UiIcon name="cloud-download" variant="duotone" />
                <span>{{
                  $t('general.download', {
                    field: $t('vendorVerification.paymentinfo.accountcover'),
                  })
                }}</span>
              </UiButton>
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.currency') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].currencySymbol }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.bankkey') }}
            </td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankCode }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium"></td>
            <td class="text-sm font-bold text-gray-500">
              <input type="checkbox" class="checkbox checkbox-sm mr-1" :checked="!paymentStore.data[0].isBankRegistered"
                disabled />
              {{ $t('vendorVerification.paymentinfo.banknotregistered') }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.bankcountry') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].countryName ?? '-' }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.bankname') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].bankName ?? '-' }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.bankbrach') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].branch ?? '-' }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.swiftcode') }}
            </td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].bankSwiftCode ?? '-' }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">
              {{ $t('vendorVerification.paymentinfo.bankaddress') }}
            </td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankAddress }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
