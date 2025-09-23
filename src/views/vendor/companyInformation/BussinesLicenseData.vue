<template>
  <div>
    <PKPTableView v-model:licenses="vendorLicensesPayload" />
    <OtherDocTableView v-model:other-documents="otherDocumentsPayload" />

    <div class="card bg-primary-light border border-primary">
      <div class="card-body p-4 flex flex-row items-center gap-4 text-primary">
        <UiIcon variant="duotone" name="information" class="text-4xl" />
        <ul class="list-disc list-inside font-medium text-sm">
          <li>Make sure to click the upload button after selecting the document.</li>
          <li>Fields marked (*) with an asterisk are required.</li>
        </ul>
      </div>
    </div>

    <div class="flex items-center justify-end mt-4 gap-2">
      <UiButton outline>
        <UiIcon variant="duotone" name="black-left" />
        Back
      </UiButton>
      <UiButton variant="primary" @click="openModalConfirm">
        <UiIcon variant="duotone" name="file-added" />
        Save
      </UiButton>
    </div>

    <!-- modal confirm -->
    <ModalConfirmation
      :open="isOpenModalConfirmSave"
      id="license-save"
      type="confirm"
      title="Save"
      text="You are about to Save to this data. Please review your input before continuing"
      static
      :loading="isLoadingSubmit"
      cancel-button-text="Cancel"
      submit-button-text="Save"
      :cancel="() => (isOpenModalConfirmSave = false)"
      :submit="onConfirmSave"
    />

    <!-- modal success -->
    <ModalConfirmation
      :open="isOpenModalSuccess"
      id="license-save-success"
      type="success"
      title="Business License Data Sucessfully Updated"
      text="The data has been successfully updated in the admin system"
      no-cancel
      static
      submit-button-text="Close"
      :submit="() => (isOpenModalSuccess = false)"
    />
    <!-- modal error -->
    <ModalConfirmation
      :open="isOpenModalError"
      type="danger"
      id="license-save-error"
      title="Error Updated Data"
      text="An error occurred while updating the data. Please try again later."
      no-cancel
      static
      submit-button-text="Close"
      :submit="() => (isOpenModalError = false)"
    />
  </div>
</template>

<script setup lang="ts">
import OtherDocTableView from '@/components/vendor/businessLicenseData/OtherDocTableView.vue'
import PKPTableView from '@/components/vendor/businessLicenseData/PKPTableView.vue'
import { useVendorAdministrationStore, useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { ILicense, IOtherDocument } from '@/stores/vendor/types/vendor'
import { useLoginStore } from '@/stores/views/login'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { IPayloadRequestUpdateLicense } from '@/stores/vendor/types/bussines-license'
// import { useChangeDataEmailStore } from '@/stores/vendor/email-change-data'

const adminStore = useVendorAdministrationStore()
// const changeDataEmailStore = useChangeDataEmailStore()

interface IRowItem {
  vendorId?: number
  licenseId?: number | null
  licenseName?: string | null
  licenseNo?: string | null
  documentUrl?: string | null
  description?: string | null
  issuedUTCDate?: string | null
  expiredUTCDate?: string | null
  issuedBy?: string | null
  issuedLocation?: string | null
  remark?: string | null
  action?: string | null
  isTemporary?: string | null
  seq?: number | null
  companyCategoryId?: number | null
  documentName?: string | null
  documentNo?: string | null
  uploadUrl?: string | null
  issuedDate?: string | null
  expiredDate?: string | null
}

// modal confirm state
const isOpenModalConfirmSave = ref(false)
const isOpenModalSuccess = ref(false)
const isOpenModalError = ref(false)
const isLoadingSubmit = ref(false)

const loginApi = useLoginStore()
const vendorLicenseData = useVendorIzinUsahaStore()
const route = useRoute()

const userData = computed(() => loginApi.userData)

const vendorLicensesPayload = ref<ILicense[]>([])
const otherDocumentsPayload = ref<IOtherDocument[]>([])

watch(
  () => vendorLicenseData.data,
  (newData) => {
    if (!Array.isArray(newData)) {
      vendorLicensesPayload.value = []
      otherDocumentsPayload.value = []
      return
    }

    const licenses: ILicense[] = []
    const others: IOtherDocument[] = []

    newData.forEach((row: IRowItem) => {
      if (row?.licenseId != null) {
        licenses.push({
          licenseId: row.licenseId,
          licenseName: row.licenseName ?? '',
          licenseNo: row.licenseNo ?? '',
          documentUrl: row.documentUrl ?? '',
          description: row.description ?? '',
          issuedUTCDate: row.issuedUTCDate ?? null,
          expiredUTCDate: row.expiredUTCDate ?? null,
          seq: row.seq ?? null,
        } as unknown as ILicense)
      } else {
        others.push({
          documentName: row.licenseName ?? row.documentName ?? '',
          documentNo: row.documentNo ?? row.licenseNo ?? '',
          uploadUrl: row.uploadUrl ?? row.documentUrl ?? '',
          description: row.description ?? '',
          issuedDate: row.issuedDate ?? row.issuedUTCDate ?? null,
          expiredDate: row.expiredDate ?? row.expiredUTCDate ?? null,
          seq: row.seq ?? null,
        } as IOtherDocument)
      }
    })

    const toNum = (v: unknown) => {
      if (v === null || v === undefined || v === '') return Number.POSITIVE_INFINITY
      const n = Number(v)
      return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    licenses.sort((a: any, b: any) => {
      const sa = toNum(a.seq)
      const sb = toNum(b.seq)
      if (sa !== sb) return sa - sb
      return (a.licenseName || '').localeCompare(b.licenseName || '')
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    others.sort((a: any, b: any) => {
      const sa = toNum(a.seq)
      const sb = toNum(b.seq)
      if (sa !== sb) return sa - sb
      return (a.documentName || '').localeCompare(b.documentName || '')
    })

    vendorLicensesPayload.value = licenses
    otherDocumentsPayload.value = others
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

const openModalConfirm = () => {
  isOpenModalConfirmSave.value = true
}

const onConfirmSave = async () => {
  if (isLoadingSubmit.value) return

  isLoadingSubmit.value = true

  try {
    await saveData()
    isOpenModalConfirmSave.value = false
  } catch (err: unknown) {
    console.log('Error saving data:', err)
    isOpenModalConfirmSave.value = false
  } finally {
    isLoadingSubmit.value = false
  }
}

const saveData = async () => {
  const vendorId = route.params.id as string
  const updatedBy = userData.value?.profile.userName

  const formattedVendorLicenses = vendorLicensesPayload.value.map((license: IRowItem) => ({
    licenseId: license.licenseId,
    licenseNo: license.licenseNo || '',
    uploadUrl: license.documentUrl || '',
    description: license.description || '',
    issuedDate: formatToISOString(license.issuedUTCDate),
    expiredDate: formatToISOString(license.expiredUTCDate),
  }))

  const formattedOtherDocuments = (otherDocumentsPayload.value as IOtherDocument[]).map(
    (doc: IOtherDocument) => ({
      documentName: doc.documentName || 'string',
      documentNo: doc.documentNo || 'string',
      uploadUrl: doc.uploadUrl || 'string',
      description: doc.description || 'string',
      issuedDate: formatToISOString(doc.issuedDate as string | Date | null),
      expiredDate: formatToISOString(doc.expiredDate as string | Date | null),
    }),
  )

  const payload: IPayloadRequestUpdateLicense = {
    request: {
      vendorLicenses: formattedVendorLicenses,
      otherDocumentVendor: formattedOtherDocuments,
      vendorId: parseInt(vendorId),
      updatedBy: updatedBy,
    },
  }

  try {
    await vendorLicenseData.updateData(payload)

    // await changeDataEmailStore.sendEmail({
    //   recepientName: adminStore.data?.vendorName,
    //   recepients: {
    //     emailTo: adminStore.data?.vendorEmail || '',
    //     emailCc: '',
    //     emailBcc: '',
    //   },
    // })

    isOpenModalSuccess.value = true
  } catch (error: unknown) {
    console.log(error)
    isOpenModalError.value = true
  }
}

onMounted(() => {
  vendorLicenseData.getData(route.params.id as string)
})
</script>
