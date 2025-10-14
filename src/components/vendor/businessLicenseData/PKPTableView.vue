<script setup lang="ts">
import { type PropType, ref, computed, watch, onMounted } from 'vue'
import { useRegistrationVendorStore } from '@/stores/views/registration'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { ILicense } from '@/stores/vendor/types/vendor'
import { useUploadStore } from '@/stores/general/upload'
import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useRoute } from 'vue-router'
import { useVendorUploadStore } from '@/stores/vendor/upload'
import tr from '@/composables/translator'

const uploadStore = useUploadStore()
const adminStore = useVendorAdministrationStore()
const uploadVendorStore = useVendorUploadStore()

// Required document logic
const registrationVendorStore = useRegistrationVendorStore()
const requiredDocumentFields = registrationVendorStore.requiredDocumentFields
const selectedCategory = computed(() => adminStore.data?.companyCategoryId ?? 0)

const checkIsRequired = (licenseId) => {
  return requiredDocumentFields[selectedCategory.value]?.includes(licenseId) ?? false
}

// Error state for required fields
const requiredError = ref(false)

const route = useRoute()

const props = defineProps({
  licenses: {
    type: Array as PropType<ILicense[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:licenses'])

const editingLicenseId = ref<string | null>(null)

const localLicenses = computed<ILicense[]>({
  get: () => props.licenses,
  set: (newValue) => emit('update:licenses', newValue),
})

const downloadLoading = ref<boolean>(false)

type FileStatus = 'notUpload' | 'loading' | 'success'
type FileSlot = { file: File; status: FileStatus }
const fileList = ref<FileSlot[]>([])
const modalUploadFailed = ref(false)
const fileSizeErrorModal = ref(false)

const originalMap = ref<Record<string, ILicense>>({})

const isEditing = (id: string | number) => editingLicenseId.value === String(id)

const ensureFileListLength = () => {
  const need = localLicenses.value.length
  while (fileList.value.length < need) {
    fileList.value.push({ file: new File([''], 'placeholder.txt'), status: 'notUpload' })
  }
  if (fileList.value.length > need) fileList.value.splice(need)
}

const resetPickedFile = (index: number) => {
  if (index >= 0 && index < fileList.value.length) {
    fileList.value[index] = { file: new File([''], 'placeholder.txt'), status: 'notUpload' }
  }
}

onMounted(() => {
  adminStore.getData(route.params.id as string)
  ensureFileListLength()
})
watch(() => localLicenses.value.length, ensureFileListLength)

const startEditing = (licenseId: string) => {
  editingLicenseId.value = licenseId
  const idx = localLicenses.value.findIndex((i) => String(i.licenseId) === licenseId)
  if (idx !== -1) {
    originalMap.value[licenseId] = JSON.parse(JSON.stringify(localLicenses.value[idx]))
    resetPickedFile(idx)
  }
}

const updateLicense = (license: ILicense) => {
  const idx = localLicenses.value.findIndex((i) => i.licenseId === license.licenseId)
  if (idx !== -1) {
    const updated = [...localLicenses.value]
    updated[idx] = { ...license }
    emit('update:licenses', updated)
  }
  delete originalMap.value[String(license.licenseId)]
  editingLicenseId.value = null
}

// const deleteLicense = (licenseId: string) => {
//   const updated = localLicenses.value.filter((i) => String(i.licenseId) !== licenseId)
//   emit('update:licenses', updated)
//   delete originalMap.value[licenseId]
//   editingLicenseId.value = null
// }

const cancelEditing = (licenseId: string) => {
  const idx = localLicenses.value.findIndex((i) => String(i.licenseId) === licenseId)
  const original = originalMap.value[licenseId]
  if (idx !== -1 && original) {
    const updated = [...localLicenses.value]
    updated[idx] = { ...original }
    emit('update:licenses', updated)
  }
  delete originalMap.value[licenseId]
  if (idx !== -1) resetPickedFile(idx)
  editingLicenseId.value = null
}

const onPickFile = (file: File, index: number) => {
  fileList.value.splice(index, 1, { file, status: 'notUpload' })
}

const uploadPickedFile = async (index: number) => {
  const slot = fileList.value[index]
  if (!slot || slot.file.name === 'placeholder.txt') return

  // Validate file size (16 MB = 16 * 1024 * 1024 bytes)
  const maxSizeInBytes = 16 * 1024 * 1024
  if (slot.file.size > maxSizeInBytes) {
    fileSizeErrorModal.value = true
    fileList.value[index].status = 'notUpload'
    return
  }

  try {
    fileList.value[index].status = 'loading'
    const response = await uploadStore.uploadFile(slot.file, 0)
    if (response?.path) {
      const updated = [...localLicenses.value]
      updated[index] = { ...updated[index], documentUrl: response.path }
      emit('update:licenses', updated)
      fileList.value[index].status = 'success'
    } else {
      fileList.value[index].status = 'notUpload'
      modalUploadFailed.value = true
      console.error('Upload failed: empty response')
    }
  } catch (e) {
    console.error(e)
    fileList.value[index].status = 'notUpload'
    modalUploadFailed.value = true
  }
}

const downloadFile = async (path: string) => {
  downloadLoading.value = true
  try {
    const file = await uploadVendorStore.preview(path)
    const link = URL.createObjectURL(file)
    window.open(link, '_blank')
    setTimeout(() => URL.revokeObjectURL(link), 1000)
  } catch (error) {
    console.log(error)
    alert(
      this.$t
        ? this.$t('businessLicense.errors.downloadFailed')
        : 'Failed to download document. Please try again later.',
    )
  } finally {
    downloadLoading.value = false
  }
}

watch(
  () => localLicenses.value,
  (rows) => {
    rows.forEach((row, i) => {
      const issued = row.issuedUTCDate ? new Date(row.issuedUTCDate as string) : null
      const expired = row.expiredUTCDate ? new Date(row.expiredUTCDate as string) : null
      if (issued && expired && expired < issued) {
        const updated = [...rows]
        updated[i] = { ...updated[i], expiredUTCDate: '' as string }
        emit('update:licenses', updated)
      }
    })
  },
  { deep: true },
)
</script>

<template>
  <div class="my-6">
    <div class="card">
      <div class="card-body">
        <h2 class="text-lg font-semibold text-slate-700">
          {{ $t('businessLicense.pkpTable.title') }} -
          {{ tr(adminStore.data?.companyCategoryName) }}
        </h2>

        <div class="mt-6">
          <div class="card min-w-full">
            <div class="card-table">
              <table class="table table-border align-middle text-gray-700 font-medium text-sm">
                <thead>
                  <tr>
                    <th class="text-nowrap">
                      {{ $t('businessLicense.pkpTable.headers.businessLicense') }}
                    </th>
                    <th class="text-nowrap">
                      {{ $t('businessLicense.pkpTable.headers.licenseNumber') }}
                    </th>
                    <th class="text-nowrap">
                      {{ $t('businessLicense.pkpTable.headers.validFrom') }}
                    </th>
                    <th class="text-nowrap">
                      {{ $t('businessLicense.pkpTable.headers.validUntil') }}
                    </th>
                    <th class="text-nowrap">
                      {{ $t('businessLicense.pkpTable.headers.document') }}
                    </th>
                    <th class="text-nowrap">{{ $t('businessLicense.pkpTable.headers.action') }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in localLicenses" :key="item.licenseId ?? index">
                    <!-- Business License -->
                    <td class="p-2 align-middle">
                      <div class="h-14 flex items-center whitespace-nowrap truncate max-w-[240px]">
                        {{ tr(item?.licenseName) }}
                        <span v-if="checkIsRequired(item.licenseId)" class="text-danger">*</span>
                      </div>
                    </td>

                    <!-- License Number / Description -->
                    <td class="p-2 align-middle">
                      <div class="h-14 flex items-center">
                        <UiInput
                          :placeholder="$t('businessLicense.pkpTable.placeholders.licenseNumber')"
                          v-model="item.licenseNo"
                          :disabled="!isEditing(item.licenseId)"
                          class="w-full"
                        />
                      </div>
                    </td>

                    <!-- Valid From -->
                    <td class="p-2 align-middle">
                      <div class="h-14 flex items-center">
                        <DatePicker
                          v-model="item.issuedUTCDate"
                          format="MMM dd, yyyy"
                          :placeholder="$t('businessLicense.pkpTable.placeholders.selectDate')"
                          :disabled="!isEditing(item.licenseId)"
                          class="!w-48"
                        />
                      </div>
                    </td>

                    <!-- Valid Until -->
                    <td class="p-2 align-middle">
                      <div class="h-14 flex items-center">
                        <DatePicker
                          v-model="item.expiredUTCDate"
                          format="MMM dd, yyyy"
                          :placeholder="$t('businessLicense.pkpTable.placeholders.selectDate')"
                          :disabled="!isEditing(item.licenseId) || !item.issuedUTCDate"
                          :min-date="item.issuedUTCDate"
                          class="!w-48"
                        />
                      </div>
                    </td>

                    <td class="p-2 align-middle">
                      <div v-if="isEditing(item.licenseId)" class="h-14 flex items-center gap-2">
                        <UiFileUpload
                          :name="String(item.licenseId)"
                          :text-length="15"
                          :max-size="16000000"
                          :placeholder="
                            fileList[index]?.file.name === 'placeholder.txt'
                              ? $t('businessLicense.pkpTable.placeholders.chooseFile')
                              : fileList[index]?.file.name
                          "
                          accepted-files=".jpg,.jpeg,.png,.pdf,application/zip"
                          class="w-48"
                          :disabled="false"
                          @addedFile="(file) => onPickFile(file, index)"
                          @upload-failed="() => (modalUploadFailed = true)"
                        />

                        <div class="min-w-8 flex items-center justify-center">
                          <div
                            v-if="fileList?.[index]?.status === 'loading'"
                            class="rounded-full border-2 size-6 border-primary border-t-primary-light animate-spin"
                          />
                          <UiIcon
                            v-else-if="fileList?.[index]?.status === 'success'"
                            name="check-circle"
                            variant="filled"
                            class="text-success text-xl"
                          />
                          <UiButton
                            v-else
                            icon
                            outline
                            size="sm"
                            @click="uploadPickedFile(index)"
                            :disabled="fileList?.[index]?.file?.name === 'placeholder.txt'"
                            aria-label="Upload document"
                          >
                            <i class="ki-filled ki-exit-up"></i>
                          </UiButton>
                        </div>
                      </div>

                      <div v-else class="h-14 flex items-center">
                        <template v-if="item.documentUrl">
                          <UiButton
                            outline
                            size="sm"
                            @click="downloadFile(item.documentUrl)"
                            :disabled="downloadLoading"
                          >
                            <UiIcon name="cloud-download" variant="duotone" />
                            <span>{{
                              $t('businessLicense.pkpTable.buttons.downloadDocument')
                            }}</span>
                          </UiButton>
                        </template>
                        <span v-else class="text-slate-400">–</span>
                      </div>
                    </td>

                    <td class="p-2 align-middle">
                      <div class="h-14 flex items-center justify-center gap-2">
                        <template v-if="isEditing(item.licenseId)">
                          <UiButton
                            outline
                            icon
                            size="sm"
                            @click="updateLicense(item)"
                            aria-label="Save"
                            title="Save"
                          >
                            <UiIcon variant="duotone" name="check-circle" />
                          </UiButton>
                          <UiButton
                            outline
                            icon
                            variant="danger"
                            size="sm"
                            @click="cancelEditing(String(item.licenseId))"
                            aria-label="Cancel edit"
                            title="Cancel edit"
                          >
                            <UiIcon variant="duotone" name="cross-circle" />
                          </UiButton>
                        </template>
                        <template v-else>
                          <UiButton
                            outline
                            icon
                            size="sm"
                            @click="startEditing(String(item.licenseId))"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <UiIcon variant="duotone" name="notepad-edit" />
                          </UiButton>
                        </template>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Modal error upload -->
          <ModalConfirmation
            :open="modalUploadFailed"
            id="license-upload-error"
            type="danger"
            :title="$t('businessLicense.uploadErrorModal.title')"
            :text="$t('businessLicense.uploadErrorModal.message')"
            no-submit
            static
            :cancel="() => (modalUploadFailed = false)"
          />

          <!-- Modal error required fields -->
          <ModalConfirmation
            :open="requiredError"
            id="license-required-error"
            type="danger"
            :title="$t('businessLicense.requiredFieldsModal.title')"
            :text="$t('businessLicense.requiredFieldsModal.message')"
            no-cancel
            static
            :submit-button-text="$t('businessLicense.buttons.close')"
            :submit="() => (requiredError = false)"
          />

          <!-- Modal file size error -->
          <ModalConfirmation
            :open="fileSizeErrorModal"
            id="file-size-error"
            type="danger"
            :title="$t('businessLicense.fileSizeErrorModal.title')"
            :text="$t('businessLicense.fileSizeErrorModal.message')"
            no-cancel
            static
            :submit-button-text="$t('businessLicense.buttons.close')"
            :submit="() => (fileSizeErrorModal = false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
