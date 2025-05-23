<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
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
            <td class="text-sm text-gray-600 font-medium">Account No.</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].accountNo }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Account Holder Name</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].accountName }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium"></td>
            <td class="text-sm font-bold text-gray-500">
              <input type="checkbox" class="checkbox checkbox-sm" disabled /> Holder's name is
              different from the company name.
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Bank Account Declaration Letter</td>
            <td class="text-sm font-bold text-gray-700">
              <a
                :href="`${baseUrl}/${paymentStore.data[0].urlDoc}`"
                target="_blank"
                class="btn btn-primary btn-outline btn-sm"
              >
                <UiIcon name="cloud-download" variant="duotone" />
                <span>Download Bank Account Declaration Letter</span>
              </a>
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Currency</td>
            <td class="text-sm font-bold text-gray-700">
              {{ paymentStore.data[0].currencySymbol }}
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Bank Key</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankCode }}</td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium"></td>
            <td class="text-sm font-bold text-gray-500">
              <input type="checkbox" class="checkbox checkbox-sm" disabled /> Bank not Registered
            </td>
          </tr>
          <tr>
            <td class="text-sm text-gray-600 font-medium">Bank Address</td>
            <td class="text-sm font-bold text-gray-700">{{ paymentStore.data[0].bankAddress }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
