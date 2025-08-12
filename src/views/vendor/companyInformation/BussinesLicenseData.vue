<template>
  <div>
    <PKPTableView v-model:licenses="vendorLicensesPayload" />
    <OtherDocTableView v-model:other-documents="otherDocumentsPayload" />

    <div
      class="w-full p-4 rounded-lg bg-primary-light border border-primary flex items-center gap-3"
    >
      <div>
        <img :src="informationIcon" alt="" />
      </div>
      <div>
        <ul class="list-disc list-inside text-sm text-primary font-medium">
          <li>Make sure to click the upload button after selecting the document.</li>
          <li>Fields marked(*) with an asterisk are required</li>
        </ul>
      </div>
    </div>

    <div class="flex items-center justify-end mt-4 gap-2">
      <UiButton outline>
        <UiIcon variant="duotone" name="black-left" />
        Back</UiButton
      >
      <UiButton variant="primary" @click="saveData">
        Save
        <UiIcon variant="duotone" name="arrow-right" />
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import OtherDocTableView from '@/components/vendor/businessLicenseData/OtherDocTableView.vue'
import PKPTableView from '@/components/vendor/businessLicenseData/PKPTableView.vue'
import { useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import informationIcon from '@/assets/svg/ic_info_alert.svg'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { ILicense, IOtherDocument } from '@/stores/vendor/types/vendor'
import { useLoginStore } from '@/stores/views/login'

const loginApi = useLoginStore()
const vendorLicenseData = useVendorIzinUsahaStore()
const route = useRoute()

const userData = computed(() => loginApi.userData)

const vendorLicensesPayload = ref<ILicense[]>([])
const otherDocumentsPayload = ref<IOtherDocument[]>([])

watch(
  () => vendorLicenseData.data,
  (newData) => {
    if (newData) {
      vendorLicensesPayload.value = JSON.parse(JSON.stringify(newData))
    }
  },
  { immediate: true },
)

const formatToISOString = (date: Date | string | null): string | null => {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    console.warn('Invalid date provided for ISO string conversion:', date)
    return null
  }
  return d.toISOString()
}

const saveData = async () => {
  const vendorId = route.params.id as string
  const updatedBy = userData.value?.profile.userName

  const formattedVendorLicenses = vendorLicensesPayload.value.map((license) => ({
    licenseId: license.licenseId,
    licenseNo: license.licenseNo || 'string',
    uploadUrl: license.documentUrl || 'string',
    description: license.description || 'string',
    issuedDate: formatToISOString(license.issuedUTCDate),
    expiredDate: formatToISOString(license.expiredUTCDate),
  }))

  const formattedOtherDocuments = otherDocumentsPayload.value.map((doc) => ({
    documentName: doc.documentName || 'string',
    documentNo: doc.documentNo || 'string',
    uploadUrl: doc.uploadUrl || 'string',
    description: doc.description || 'string',
    issuedDate: formatToISOString(doc.issuedDate),
    expiredDate: formatToISOString(doc.expiredDate),
  }))

  const payload = {
    request: {
      vendorLicenses: formattedVendorLicenses,
      otherDocumentVendor: formattedOtherDocuments,
      vendorId: parseInt(vendorId),
      updatedBy: updatedBy,
    },
  }

  try {
    const response = await vendorLicenseData.updateData(payload)

  } catch (error) {
    console.error('Error sending data:', error)
    alert('An error occurred while sending data.')
  }
}

onMounted(() => {
  vendorLicenseData.getData(route.params.id as string)
})
</script>
