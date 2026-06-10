<template>
  <div class="modal" data-modal="true" id="ftp_upload_modal">
    <div class="modal-content max-w-[900px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold text-gray-700">Upload FTP Invoice Files</h3>
        <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>

          <div class="modal-body p-4">
            <div class="space-y-4">
              <div>
                <label class="font-medium">Invoice Document <span class="text-red-500 ml-[4px]">*</span></label>
                <div class="file-upload mt-2">
                  <input type="file" ref="invoiceInput" class="hidden" @change="onFileChange($event, 'invoice')" accept="*/*" />
                  <div class="flex items-center cursor-pointer relative upload" @click="triggerFileInput('invoice')">
                    <div class="upload__left"><IconUpload /></div>
                    <div class="upload__right">{{ invoiceName ? invoiceName : 'Select file - Pdf (Max 16 mb)' }}</div>
                  </div>
                  <div v-if="invoiceName" class="text-sm text-gray-500 mt-2">Selected: {{ invoiceName }}</div>
                </div>
              </div>

              <div>
                <label class="font-medium">Tax Document <span class="text-red-500 ml-[4px]">*</span></label>
                <div class="file-upload mt-2">
                  <input type="file" ref="taxInput" class="hidden" @change="onFileChange($event, 'tax')" accept="*/*" />
                  <div class="flex items-center cursor-pointer relative upload" @click="triggerFileInput('tax')">
                    <div class="upload__left"><IconUpload /></div>
                    <div class="upload__right">{{ taxName ? taxName : 'Select file - Pdf (Max 16 mb)' }}</div>
                  </div>
                  <div v-if="taxName" class="text-sm text-gray-500 mt-2">Selected: {{ taxName }}</div>
                </div>
              </div>

              <div>
                <label class="font-medium">Reference Document <span class="text-gray-500 ml-[4px] text-sm"></span></label>
                <div class="file-upload mt-2">
                  <input type="file" ref="referenceInput" class="hidden" @change="onFileChange($event, 'reference')" accept="*/*" />
                  <div class="flex items-center cursor-pointer relative upload" @click="triggerFileInput('reference')">
                    <div class="upload__left"><IconUpload /></div>
                    <div class="upload__right">{{ referenceName ? referenceName : 'Select file - Pdf (Max 16 mb)' }}</div>
                  </div>
                  <div v-if="referenceName" class="text-sm text-gray-500 mt-2">Selected: {{ referenceName }}</div>
                </div>
              </div>

          <div v-if="preview && Object.keys(preview).length" class="border p-3 rounded">
            <div class="font-semibold mb-2">Parsed Preview</div>
            <table class="table text-sm w-full">
              <tbody>
                <tr>
                  <td class="font-medium">Invoice No</td>
                  <td>{{ preview.invoiceNo || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-medium">Vendor</td>
                  <td>{{ preview.vendorName || preview.vendor || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-medium">Total Amount</td>
                  <td>{{ preview.totalAmount || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-medium">Tax Amount</td>
                  <td>{{ preview.taxAmount || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-medium">Reference</td>
                  <td>{{ preview.reference || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-footer flex gap-2 justify-end p-4">
        <button class="btn btn-light" data-modal-dismiss="true">Cancel</button>
        <button class="btn btn-primary" :disabled="isLoading || !invoiceFile || !taxFile" @click="upload">
          <span v-if="isLoading">Uploading...</span>
          <span v-else>Upload</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import invoiceApi from '@/core/utils/invoiceApi'
import { KTModal } from '@/metronic/core'
import IconUpload from '@/components/ui/pdfUpload/PdfUpload/IconUpload.vue'
import type { FtpUploadOriginalFileNames } from './types/ftpUpload'
import { GENERIC_STORED_FILE_NAMES } from './types/ftpUpload'

const emits = defineEmits<{
  (
    e: 'uploaded',
    payload: {
      uid: string | null
      preview?: Record<string, unknown>
      originalFileNames?: FtpUploadOriginalFileNames
    },
  ): void
}>()

const invoiceFile = ref<File | null>(null)
const taxFile = ref<File | null>(null)
const referenceFile = ref<File | null>(null)
const invoiceName = ref<string>('')
const taxName = ref<string>('')
const referenceName = ref<string>('')
const isLoading = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preview = ref<Record<string, any>>({})

const onFileChange = (e: Event, which: 'invoice' | 'tax' | 'reference') => {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0] ? input.files[0] : null

  if (which === 'invoice') {
    invoiceFile.value = file
    invoiceName.value = file ? file.name : ''
  } else if (which === 'tax') {
    taxFile.value = file
    taxName.value = file ? file.name : ''
  } else {
    referenceFile.value = file
    referenceName.value = file ? file.name : ''
  }

  // Clear preview - backend will provide parsed preview after upload
  preview.value = {}
}

const invoiceInput = ref<HTMLInputElement | null>(null)
const taxInput = ref<HTMLInputElement | null>(null)
const referenceInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = (which: 'invoice' | 'tax' | 'reference') => {
  if (which === 'invoice') invoiceInput.value?.click()
  else if (which === 'tax') taxInput.value?.click()
  else referenceInput.value?.click()
}

const GENERIC_STORED_NAMES = GENERIC_STORED_FILE_NAMES

const pickDisplayFileName = (apiName: string | null | undefined, localName: string) => {
  if (apiName && !GENERIC_STORED_NAMES.has(apiName.toLowerCase())) return apiName
  return localName || apiName || null
}

const upload = async () => {
  if (!invoiceFile.value || !taxFile.value) return

  isLoading.value = true
  const localFileNames = {
    invoice: invoiceName.value,
    tax: taxName.value,
    reference: referenceName.value || null,
  }

  try {
    const form = new FormData()
    form.append('invoiceFile', invoiceFile.value)
    form.append('taxFile', taxFile.value)
    if (referenceFile.value) form.append('referenceFile', referenceFile.value)

    const metadata = {
      status: 'Uploaded',
      source: 'ftp',
      invoiceFileName: localFileNames.invoice,
      taxFileName: localFileNames.tax,
      referenceFileName: localFileNames.reference,
    }
    form.append('metadata', JSON.stringify(metadata))
    form.append('invoiceOriginalFileName', localFileNames.invoice)
    form.append('taxOriginalFileName', localFileNames.tax)
    if (localFileNames.reference) form.append('referenceOriginalFileName', localFileNames.reference)

    const response = await invoiceApi.post('/invoice/upload-invoice-ftp', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const content = response?.data?.result?.content || response?.data?.result || {}
    const uid = content?.invoiceUId || content?.invoiceUid || content?.invoiceId || null

    // If backend returns parsed preview and file info, use it for display briefly
    if (content) {
      preview.value = {
        companyCode: content.companyCode || null,
        invoiceNo: content.invoiceNo || content.invoiceNumber || null,
        vendorName: content.vendorName || content.vendor || null,
        totalAmount: content.totalAmount || content.totalGrossAmount || null,
        taxAmount: content.taxAmount || content.totalTaxAmount || null,
        reference: content.reference || content.referenceNo || null,
      }

      if (content.files) {
        preview.value.invoiceFileName = pickDisplayFileName(
          content.files.invoice?.fileName ||
            content.files.invoice?.originalFileName ||
            content.files.invoice?.uploadedFileName ||
            content.files.invoice?.name,
          localFileNames.invoice,
        )
        preview.value.taxFileName = pickDisplayFileName(
          content.files.tax?.fileName ||
            content.files.tax?.originalFileName ||
            content.files.tax?.uploadedFileName ||
            content.files.tax?.name,
          localFileNames.tax,
        )
        preview.value.referenceFileName = localFileNames.reference
          ? pickDisplayFileName(
              content.files.reference?.originalFileName ||
                content.files.reference?.uploadedFileName ||
                content.files.reference?.fileName ||
                content.files.reference?.name,
              localFileNames.reference,
            )
          : null
        preview.value.invoiceFileUrl = content.files.invoice?.url || null
        preview.value.taxFileUrl = content.files.tax?.url || null
        preview.value.referenceFileUrl = content.files.reference?.url || null
        preview.value.invoiceBlobPath = content.files.invoice?.blobPath || null
        preview.value.taxBlobPath = content.files.tax?.blobPath || null
        preview.value.referenceBlobPath = content.files.reference?.blobPath || null
      } else {
        preview.value.invoiceFileName = localFileNames.invoice
        preview.value.taxFileName = localFileNames.tax
        preview.value.referenceFileName = localFileNames.reference
      }
    }

    emits('uploaded', { uid, preview: preview.value, originalFileNames: localFileNames })

    // hide modal
    const el = document.querySelector('#ftp_upload_modal') as HTMLElement
    const modal = KTModal.getInstance(el)
    if (modal) modal.hide()
  } catch (err) {
    console.error('Upload failed', err)
    // show simple alert for now
    alert('Upload failed. Please check the files and try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '../../components/ui/pdfUpload/styles/upload.scss';

.modal-body input[type='file'] {
  display: none;
}

.file-upload {
  inline-size: 100%;
}

</style>
