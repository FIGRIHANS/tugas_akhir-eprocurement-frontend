<script setup lang="ts">
import { type PropType, ref, computed, watch, onMounted } from 'vue'
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

const uploadStore = useUploadStore()
const adminStore = useVendorAdministrationStore()

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

type FileStatus = 'notUpload' | 'loading' | 'success'
type FileSlot = { file: File; status: FileStatus }
const fileList = ref<FileSlot[]>([])
const modalUploadFailed = ref(false)

const ensureFileListLength = () => {
  const need = localLicenses.value.length
  while (fileList.value.length < need) {
    fileList.value.push({ file: new File([''], 'placeholder.txt'), status: 'notUpload' })
  }
  if (fileList.value.length > need) fileList.value.splice(need)
}

onMounted(() => {
  adminStore.getData(route.params.id as string)
  ensureFileListLength()
})
watch(() => localLicenses.value.length, ensureFileListLength)

const startEditing = (licenseId: string) => {
  editingLicenseId.value = licenseId
}

const updateLicense = (license: ILicense) => {
  const idx = localLicenses.value.findIndex((i) => i.licenseId === license.licenseId)
  if (idx !== -1) {
    const updated = [...localLicenses.value]
    updated[idx] = { ...license }
    emit('update:licenses', updated)
  }
  editingLicenseId.value = null
}

const deleteLicense = (licenseId: string) => {
  const updated = localLicenses.value.filter((i) => String(i.licenseId) !== licenseId)
  emit('update:licenses', updated)
  editingLicenseId.value = null
}

const onPickFile = (file: File, index: number) => {
  fileList.value.splice(index, 1, { file, status: 'notUpload' })
}

const uploadPickedFile = async (index: number) => {
  const slot = fileList.value[index]
  if (!slot || slot.file.name === 'placeholder.txt') return
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
          Business License Data - {{ adminStore.data?.companyCategoryName }}
        </h2>

        <div class="mt-6">
          <div class="card min-w-full">
            <div class="card-table">
              <table class="table table-border align-middle text-gray-700 font-medium text-sm">
                <thead>
                  <tr>
                    <th class="text-nowrap">Business License</th>
                    <th class="text-nowrap">License Number / Description</th>
                    <th class="text-nowrap">Valid From (Start Date)</th>
                    <th class="text-nowrap">Valid Until (End Date)</th>
                    <th class="text-nowrap">Document</th>
                    <th class="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in localLicenses" :key="item.licenseId">
                    <td class="align-top">{{ item?.licenseName }}</td>

                    <td class="align-top">
                      <UiInput
                        placeholder="License Number / Description"
                        v-model="item.licenseNo"
                        :disabled="editingLicenseId !== String(item.licenseId)"
                      />
                    </td>

                    <td class="align-top">
                      <DatePicker
                        v-model="item.issuedUTCDate"
                        format="dd MM yyyy"
                        placeholder="Pilih Tanggal"
                        :disabled="editingLicenseId !== String(item.licenseId)"
                        class="!w-48"
                      />
                    </td>

                    <td class="align-top">
                      <DatePicker
                        v-model="item.expiredUTCDate"
                        format="dd MM yyyy"
                        placeholder="Pilih Tanggal"
                        :disabled="
                          editingLicenseId !== String(item.licenseId) || !item.issuedUTCDate
                        "
                        :min-date="item.issuedUTCDate"
                        class="!w-48"
                      />
                    </td>

                    <td class="align-top">
                      <UiFileUpload
                        :name="String(item.licenseId)"
                        :text-length="15"
                        :max-size="16000000"
                        :placeholder="
                          fileList[index]?.file.name === 'placeholder.txt'
                            ? ''
                            : fileList[index]?.file.name
                        "
                        accepted-files=".jpg,.jpeg,.png,.pdf,application/zip"
                        class="w-48"
                        :disabled="editingLicenseId !== String(item.licenseId)"
                        @addedFile="(file) => onPickFile(file, index)"
                        @upload-failed="() => (modalUploadFailed = true)"
                      />
                      <span class="text-danger text-[10px]"
                        >*jpg, jpeg, png, pdf, zip / max : 16 MB</span
                      >
                    </td>

                    <td class="flex flex-row items-center gap-2">
                      <!-- status upload -->
                      <div
                        v-if="fileList?.[index]?.status === 'loading'"
                        class="rounded-full border-2 size-8 border-primary border-t-primary-light animate-spin text-xs"
                      ></div>
                      <UiIcon
                        v-else-if="fileList?.[index]?.status === 'success'"
                        name="check-circle"
                        variant="filled"
                        class="text-success text-4xl"
                      />

                      <!-- actions -->
                      <template v-if="editingLicenseId === String(item.licenseId)">
                        <UiButton
                          v-if="!['loading', 'success'].includes(fileList?.[index]?.status)"
                          icon
                          outline
                          @click="uploadPickedFile(index)"
                          class="me-2"
                        >
                          <i class="ki-filled ki-exit-up"></i>
                        </UiButton>

                        <UiButton outline @click="updateLicense(item)" icon class="me-2">
                          <UiIcon variant="duotone" name="check-circle"></UiIcon>
                        </UiButton>

                        <UiButton
                          variant="danger"
                          outline
                          @click="deleteLicense(String(item.licenseId))"
                          icon
                        >
                          <UiIcon variant="duotone" name="trash"></UiIcon>
                        </UiButton>
                      </template>

                      <template v-else>
                        <UiButton outline @click="startEditing(String(item.licenseId))" icon>
                          <UiIcon variant="duotone" name="notepad-edit"></UiIcon>
                        </UiButton>
                      </template>
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
            title="Upload Failed"
            text="File size exceeds the maximum limit of 16 MB. Please choose a smaller file."
            no-submit
            static
            :cancel="() => (modalUploadFailed = false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
