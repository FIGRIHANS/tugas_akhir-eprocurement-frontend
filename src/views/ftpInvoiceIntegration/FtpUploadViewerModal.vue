<template>
  <div class="modal" data-modal="true" id="ftp_view_modal">
    <div class="modal-content ftp-modal modal-center-y">
      <div class="modal-header ftp-modal__header">
        <div>
          <h3 class="modal-title ftp-modal__title">View Uploaded Files</h3>
          <p class="ftp-modal__subtitle">Detail dokumen yang diunggah melalui FTP integration</p>
        </div>
        <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>

      <div class="modal-body ftp-modal__body">
        <div class="ftp-modal__summary">
          <div class="ftp-modal__summary-item">
            <span class="ftp-modal__label">Vendor Name</span>
            <span class="ftp-modal__value">{{ data.vendorName || '-' }}</span>
          </div>
          <div class="ftp-modal__summary-item">
            <span class="ftp-modal__label">Created At</span>
            <span class="ftp-modal__value">{{ formattedCreatedAt }}</span>
          </div>
          <div class="ftp-modal__summary-item ftp-modal__summary-item--status">
            <span class="ftp-modal__label">Status</span>
            <span
              v-if="data.status"
              class="badge badge-outline"
              :class="data.status === 'Done' ? 'badge-success' : 'badge-primary'"
            >
              {{ data.status }}
            </span>
            <span v-else class="ftp-modal__value">-</span>
          </div>
        </div>

        <div class="ftp-modal__section-title">Documents</div>
        <div class="ftp-modal__file-list">
          <div
            v-for="file in fileSections"
            :key="file.key"
            class="ftp-modal__file-row"
            :class="{ 'ftp-modal__file-row--empty': !file.hasFile }"
          >
            <div class="ftp-modal__file-icon" :class="file.iconClass">
              <i :class="file.icon"></i>
            </div>

            <div class="ftp-modal__file-content">
              <div class="ftp-modal__file-type">{{ file.label }}</div>
              <div class="ftp-modal__file-name" :title="file.displayName">
                {{ file.displayName }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer ftp-modal__footer">
        <button class="btn btn-light" data-modal-dismiss="true">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import moment from 'moment'

export interface FtpUploadFileInfo {
  fileName: string | null
  storedFileName?: string | null
  blobPath: string | null
  url: string | null
}

export interface FtpUploadViewerData {
  invoiceUId?: string | null
  invoiceNo?: string | null
  vendorName?: string | null
  status?: string | null
  createdAt?: string | null
  parsedPreview?: Record<string, unknown> | null
  invoice?: FtpUploadFileInfo
  tax?: FtpUploadFileInfo
  reference?: FtpUploadFileInfo | null
}

const props = defineProps<{ data: FtpUploadViewerData }>()

const data = computed(() => props.data)

const formattedCreatedAt = computed(() => {
  if (!data.value.createdAt) return '-'
  const parsed = moment(data.value.createdAt)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD HH:mm:ss') : data.value.createdAt
})

const getDisplayName = (fileName: string | null | undefined, emptyLabel: string) => {
  if (fileName && fileName.trim() !== '') return fileName
  return emptyLabel
}

const fileSections = computed(() => [
  {
    key: 'invoice',
    label: 'Invoice Document',
    icon: 'ki-duotone ki-document',
    iconClass: 'ftp-modal__file-icon--invoice',
    displayName: getDisplayName(data.value.invoice?.fileName, 'No file uploaded'),
    hasFile: !!data.value.invoice?.fileName,
  },
  {
    key: 'tax',
    label: 'Tax Document',
    icon: 'ki-duotone ki-bill',
    iconClass: 'ftp-modal__file-icon--tax',
    displayName: getDisplayName(data.value.tax?.fileName, 'No file uploaded'),
    hasFile: !!data.value.tax?.fileName,
  },
  {
    key: 'reference',
    label: 'Reference Document',
    icon: 'ki-duotone ki-folder',
    iconClass: 'ftp-modal__file-icon--reference',
    displayName: getDisplayName(data.value.reference?.fileName, 'No file uploaded'),
    hasFile: !!data.value.reference?.fileName,
  },
])
</script>

<style scoped lang="scss">
.ftp-modal {
  max-width: 560px;

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
    padding: 8px 24px 20px;
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #f9fafb;
    margin-bottom: 20px;
  }

  &__summary-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;

    &--status {
      align-items: flex-start;
    }
  }

  &__label {
    font-size: 12px;
    color: #6b7280;
  }

  &__value {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    word-break: break-word;
  }

  &__section-title {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 10px;
  }

  &__file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__file-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;

    &--empty {
      background: #fafafa;

      .ftp-modal__file-name {
        color: #9ca3af;
        font-weight: 400;
        font-style: italic;
      }
    }
  }

  &__file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    flex-shrink: 0;

    i {
      font-size: 18px;
    }

    &--invoice,
    &--tax,
    &--reference {
      background: #ecfdf5;
      color: #0d9488;
    }
  }

  &__file-content {
    flex: 1;
    min-width: 0;
  }

  &__file-type {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #9ca3af;
    margin-bottom: 2px;
  }

  &__file-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__footer {
    padding: 12px 24px 20px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .ftp-modal__summary {
    grid-template-columns: 1fr;
  }
}
</style>
