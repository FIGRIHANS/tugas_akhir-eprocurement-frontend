<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useVendorPaymentStore } from '@/stores/vendor/vendor'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const paymentStore = useVendorPaymentStore()
const route = useRoute()
const baseUrl = import.meta.env.VITE_API_VENDOR_BASE_URL
watch(
  () => route.params.id,
  (id) => {
    paymentStore.getData(id as string)
  },
  { immediate: true },
)
</script>
<template>
  <div class="card card-grid">
    <div class="card-header">
      <div class="card-title">Payment Information</div>
    </div>
    <div class="card-body">
      <div v-if="paymentStore.loading" class="flex items-center justify-center py-5">
        <span class="text-xl text-primary">
          <UiIcon name="abstract-33" variant="duotone" class="animate-spin" />
        </span>
      </div>

      <div v-else-if="paymentStore.error" class="flex items-center justify-center py-5">
        <span class="text-red-500 font-medium">
          {{ paymentStore.error }}
        </span>
      </div>

      <div v-else-if="!paymentStore.data.length" class="flex items-center justify-center py-5">
        <span class="text-gray-700 font-medium"> Oops! Data tidak ditemukan </span>
      </div>

      <table class="table align-middle" v-else>
        <tbody>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Account Number</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].accountNo }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Pemilik Akun</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].accountName }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Surat Pembayaran Perbedaan Rekening</td>
            <td class="text-sm font-bold text-gray-700">-</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Halaman Pertama Buku Tabungan</td>
            <td class="text-sm font-bold text-gray-700">
              <a
                :href="`${baseUrl}/${paymentStore.data[0].urlDoc}`"
                target="_blank"
                class="underline decoration-dashed text-primary font-medium"
              >
                See Detail
              </a>
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Mata Uang</td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].currencySymbol }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Nama Bank</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankName }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Alamat Bank</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankAddress }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Negara</td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].countryName }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Bank Key</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankCode }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">BI Code</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].biCode }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Swift Code</td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].bankSwiftCode }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
