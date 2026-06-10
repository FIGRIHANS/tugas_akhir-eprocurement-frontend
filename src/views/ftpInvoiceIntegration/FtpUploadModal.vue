<template>
  <div class="modal" data-modal="true" id="ftp_upload_modal">
    <div class="modal-content ftp-modal modal-center-y">
      <div class="modal-header ftp-modal__header">
        <div>
          <h3 class="modal-title ftp-modal__title">Upload Invoice & Tax Document</h3>
          <p class="ftp-modal__subtitle">
            Unggah dokumen invoice dan faktur pajak. Reference document bersifat opsional.
          </p>
        </div>
        <button
          class="btn btn-xs btn-icon btn-light btn-clear"
          data-modal-dismiss="true"
          :disabled="isLoading"
        >
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>

      <div class="modal-body ftp-modal__body">
        <div class="ftp-modal__upload-field">
          <label class="ftp-modal__upload-label">
            Vendor Name <span class="text-danger">*</span>
          </label>
          <input
            v-if="loginStore.isVendor"
            :value="selectedVendorName"
            class="input w-full"
            disabled
          />
          <v-select
            v-else
            v-model="selectedVendorSapCode"
            class="customSelect w-full"
            label="vendorName"
            placeholder="Select vendor"
            :reduce="(option: VendorOption) => option.sapCode"
            :options="vendorList"
            :disabled="isLoading"
          />
        </div>

        <div class="ftp-modal__file-list">
          <div class="ftp-modal__upload-field">
            <label class="ftp-modal__upload-label">
              Invoice Document <span class="text-danger">*</span>
            </label>
            <input
              type="file"
              ref="invoiceInput"
              class="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="onFileChange($event, 'invoice')"
            />
            <div
              class="ftp-modal__picker"
              :class="{ 'ftp-modal__picker--filled': invoiceName }"
              @click="!isLoading && triggerFileInput('invoice')"
            >
              <div class="ftp-modal__picker-icon"><IconUpload /></div>
              <div class="ftp-modal__picker-content">
                <div v-if="invoiceName" class="ftp-modal__picker-name" :title="invoiceName">
                  {{ invoiceName }}
                </div>
                <div v-else class="ftp-modal__picker-placeholder">
                  Select file — PDF, JPG, PNG (Max 16 MB)
                </div>
              </div>
              <button
                v-if="invoiceName"
                type="button"
                class="btn btn-icon btn-sm btn-light ftp-modal__clear-btn"
                title="Remove file"
                :disabled="isLoading"
                @click.stop="clearFile('invoice')"
              >
                <i class="ki-duotone ki-cross"></i>
              </button>
            </div>
          </div>

          <div class="ftp-modal__upload-field">
            <label class="ftp-modal__upload-label">
              Tax Document <span class="text-danger">*</span>
            </label>
            <input
              type="file"
              ref="taxInput"
              class="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="onFileChange($event, 'tax')"
            />
            <div
              class="ftp-modal__picker"
              :class="{ 'ftp-modal__picker--filled': taxName }"
              @click="!isLoading && triggerFileInput('tax')"
            >
              <div class="ftp-modal__picker-icon"><IconUpload /></div>
              <div class="ftp-modal__picker-content">
                <div v-if="taxName" class="ftp-modal__picker-name" :title="taxName">
                  {{ taxName }}
                </div>
                <div v-else class="ftp-modal__picker-placeholder">
                  Select file — PDF, JPG, PNG (Max 16 MB)
                </div>
              </div>
              <button
                v-if="taxName"
                type="button"
                class="btn btn-icon btn-sm btn-light ftp-modal__clear-btn"
                title="Remove file"
                :disabled="isLoading"
                @click.stop="clearFile('tax')"
              >
                <i class="ki-duotone ki-cross"></i>
              </button>
            </div>
          </div>

          <div class="ftp-modal__upload-field">
            <label class="ftp-modal__upload-label">
              Reference Document
              <span class="ftp-modal__optional">(Optional)</span>
            </label>
            <input
              type="file"
              ref="referenceInput"
              class="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="onFileChange($event, 'reference')"
            />
            <div
              class="ftp-modal__picker"
              :class="{ 'ftp-modal__picker--filled': referenceName }"
              @click="!isLoading && triggerFileInput('reference')"
            >
              <div class="ftp-modal__picker-icon"><IconUpload /></div>
              <div class="ftp-modal__picker-content">
                <div v-if="referenceName" class="ftp-modal__picker-name" :title="referenceName">
                  {{ referenceName }}
                </div>
                <div v-else class="ftp-modal__picker-placeholder">
                  Select file — PDF, JPG, PNG (Max 16 MB)
                </div>
              </div>
              <button
                v-if="referenceName"
                type="button"
                class="btn btn-icon btn-sm btn-light ftp-modal__clear-btn"
                title="Remove file"
                :disabled="isLoading"
                @click.stop="clearFile('reference')"
              >
                <i class="ki-duotone ki-cross"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="ftp-modal__hint">
          <i class="ki-duotone ki-information-2"></i>
          <span>
            Pilih vendor terlebih dahulu, lalu unggah dokumen invoice dan faktur pajak. Proses OCR
            otomatis berjalan di backend (30–60 detik).
          </span>
        </div>
      </div>

      <div class="modal-footer ftp-modal__footer">
        <button class="btn btn-light" data-modal-dismiss="true" :disabled="isLoading">Cancel</button>
        <button
          class="btn btn-primary inline-flex items-center gap-2"
          :disabled="isLoading || !invoiceFile || !taxFile || !selectedVendorName"
          @click="upload"
        >
          <svg
            v-if="isLoading"
            class="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{{ isLoading ? 'Memproses upload & OCR...' : 'Upload' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import invoiceApi from '@/core/utils/invoiceApi'
import { KTModal } from '@/metronic/core'
import IconUpload from '@/components/ui/pdfUpload/PdfUpload/IconUpload.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useLoginStore } from '@/stores/views/login'
import type { VendorTypes } from '@/stores/master-data/types/invoiceMasterData'
import type { FtpUploadOriginalFileNames } from './types/ftpUpload'
import { buildFtpUploadMetadata, parseFtpUploadCreateResponse } from './types/ftpUploadService'
import {
  resolveFtpInvoiceFileName,
  resolveFtpTaxFileName,
  resolveFtpReferenceFileName,
} from './types/ftpUpload'

const invoiceMasterApi = useInvoiceMasterDataStore()
const loginStore = useLoginStore()

type VendorOption = VendorTypes

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

type UploadFieldKey = 'invoice' | 'tax' | 'reference'

const invoiceFile = ref<File | null>(null)
const taxFile = ref<File | null>(null)
const referenceFile = ref<File | null>(null)
const invoiceName = ref<string>('')
const taxName = ref<string>('')
const referenceName = ref<string>('')
const isLoading = ref(false)
const selectedVendorSapCode = ref<string>('')

const vendorList = computed(() => invoiceMasterApi.vendorList)

const selectedVendor = computed(() =>
  vendorList.value.find((item) => item.sapCode === selectedVendorSapCode.value),
)

const selectedVendorName = computed(() => {
  if (loginStore.isVendor) {
    return loginStore.userData?.profile?.vendorName || ''
  }
  return selectedVendor.value?.vendorName || ''
})

watch(
  () => loginStore.isVendor,
  () => {
    if (loginStore.isVendor) {
      selectedVendorSapCode.value = loginStore.userData?.profile?.sapCode || ''
    }
  },
  { immediate: true },
)

onMounted(async () => {
  if (!invoiceMasterApi.vendorList.length) {
    await invoiceMasterApi.getVendorList()
  }
  if (loginStore.isVendor) {
    selectedVendorSapCode.value = loginStore.userData?.profile?.sapCode || ''
  }
})

const invoiceInput = ref<HTMLInputElement | null>(null)
const taxInput = ref<HTMLInputElement | null>(null)
const referenceInput = ref<HTMLInputElement | null>(null)

const MAX_FILE_SIZE = 16 * 1024 * 1024

const resetForm = () => {
  invoiceFile.value = null
  taxFile.value = null
  referenceFile.value = null
  invoiceName.value = ''
  taxName.value = ''
  referenceName.value = ''
  if (!loginStore.isVendor) {
    selectedVendorSapCode.value = ''
  }
  if (invoiceInput.value) invoiceInput.value.value = ''
  if (taxInput.value) taxInput.value.value = ''
  if (referenceInput.value) referenceInput.value.value = ''
}

const onFileChange = (e: Event, which: UploadFieldKey) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  if (file && file.size > MAX_FILE_SIZE) {
    alert('File size exceeds 16 MB limit.')
    input.value = ''
    return
  }

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
}

const triggerFileInput = (which: UploadFieldKey) => {
  if (which === 'invoice') invoiceInput.value?.click()
  else if (which === 'tax') taxInput.value?.click()
  else referenceInput.value?.click()
}

const clearFile = (which: UploadFieldKey) => {
  if (which === 'invoice') {
    invoiceFile.value = null
    invoiceName.value = ''
    if (invoiceInput.value) invoiceInput.value.value = ''
  } else if (which === 'tax') {
    taxFile.value = null
    taxName.value = ''
    if (taxInput.value) taxInput.value.value = ''
  } else {
    referenceFile.value = null
    referenceName.value = ''
    if (referenceInput.value) referenceInput.value.value = ''
  }
}

const upload = async () => {
  if (!invoiceFile.value || !taxFile.value || !selectedVendorName.value) return

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

    const metadata = buildFtpUploadMetadata(selectedVendorName.value)
    form.append('metadata', JSON.stringify(metadata))

    const response = await invoiceApi.post('/invoice/upload-invoice-ftp', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })

    const parsed = parseFtpUploadCreateResponse(response?.data?.result ?? response?.data ?? {})
    const uid = parsed.invoiceUId || null

    const preview: Record<string, unknown> = {
      vendorName: parsed.vendorName || selectedVendorName.value,
      invoiceNo: parsed.invoiceNo || null,
      totalAmount: parsed.parsedPreview?.totalAmount || null,
      taxAmount: parsed.parsedPreview?.taxAmount || null,
      reference: parsed.parsedPreview?.reference || null,
      invoiceFileName: resolveFtpInvoiceFileName(parsed, localFileNames),
      taxFileName: resolveFtpTaxFileName(parsed, localFileNames),
      referenceFileName:
        resolveFtpReferenceFileName(parsed, localFileNames) === '-'
          ? null
          : resolveFtpReferenceFileName(parsed, localFileNames),
    }

    if (parsed.files?.invoice) {
      preview.invoiceFileUrl = parsed.files.invoice.url || null
      preview.invoiceBlobPath = parsed.files.invoice.blobPath || null
    }
    if (parsed.files?.tax) {
      preview.taxFileUrl = parsed.files.tax.url || null
      preview.taxBlobPath = parsed.files.tax.blobPath || null
    }
    if (parsed.files?.reference) {
      preview.referenceFileUrl = parsed.files.reference.url || null
      preview.referenceBlobPath = parsed.files.reference.blobPath || null
    }

    emits('uploaded', { uid, preview, originalFileNames: localFileNames })
    alert('Upload berhasil, sedang memproses OCR…')

    resetForm()
    const el = document.querySelector('#ftp_upload_modal') as HTMLElement
    const modal = KTModal.getInstance(el)
    if (modal) modal.hide()
  } catch (err: unknown) {
    console.error('Upload failed', err)
    const error = err as { response?: { data?: { result?: { message?: string } } }; message?: string }
    const message =
      error.response?.data?.result?.message ||
      error.message ||
      'Upload failed. Please check vendor and files, then try again.'
    alert(message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.ftp-modal {
  max-width: 640px;

  &__header {
    align-items: flex-start;
    gap: 12px;
    padding: 20px 24px 12px;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  &__subtitle {
    margin: 4px 0 0;
    font-size: 13px;
    color: #6b7280;
  }

  &__body {
    padding: 8px 24px 16px;
  }

  &__file-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__upload-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  &__optional {
    margin-left: 6px;
    font-size: 12px;
    font-weight: 400;
    color: #9ca3af;
  }

  &__picker {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px dashed #99f6e4;
    border-radius: 12px;
    background: #f0fdfa;
    cursor: pointer;
    transition: border-color 0.15s ease, background-color 0.15s ease;

    &:hover {
      border-color: #14b8a6;
      background: #ecfeff;
    }

    &--filled {
      border-style: solid;
      border-color: #5eead4;
      background: #fff;
    }
  }

  &__picker-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(20, 184, 166, 0.15);
    flex-shrink: 0;
  }

  &__picker-content {
    flex: 1;
    min-width: 0;
  }

  &__picker-placeholder {
    font-size: 13px;
    color: #0d9488;
  }

  &__picker-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__clear-btn {
    flex-shrink: 0;
  }

  &__hint {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    font-size: 12px;
    color: #6b7280;

    i {
      color: #14b8a6;
      margin-top: 1px;
    }
  }

  &__footer {
    padding: 12px 24px 20px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.hidden {
  display: none;
}
</style>
