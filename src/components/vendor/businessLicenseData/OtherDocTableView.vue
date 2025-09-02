<script setup lang="ts">
import { ref, computed, type PropType, watch, onMounted } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { IOtherDocument } from '@/stores/vendor/types/vendor'
import { useUploadStore } from '@/stores/general/upload'

const uploadStore = useUploadStore()

const props = defineProps({
  otherDocuments: {
    type: Array as PropType<IOtherDocument[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:otherDocuments'])

const localOtherDocuments = computed<IOtherDocument[]>({
  get: () => props.otherDocuments,
  set: (newValue) => emit('update:otherDocuments', newValue),
})

type FileStatus = 'notUpload' | 'loading' | 'success'
type FileSlot = { file: File; status: FileStatus }
const fileOtherDocumentList = ref<FileSlot[]>([])
const modalUploadFailed = ref(false)

const editingIndex = ref<number | null>(null)
const originalMap = ref<Record<string, IOtherDocument>>({})

const isEditing = (idx: number) => editingIndex.value === idx

const ensureFileListLength = () => {
  const need = localOtherDocuments.value.length
  while (fileOtherDocumentList.value.length < need) {
    fileOtherDocumentList.value.push({
      file: new File([''], 'placeholder.txt'),
      status: 'notUpload',
    })
  }
  if (fileOtherDocumentList.value.length > need) {
    fileOtherDocumentList.value.splice(need)
  }
}
onMounted(ensureFileListLength)
watch(() => localOtherDocuments.value.length, ensureFileListLength)

const resetPickedFile = (index: number) => {
  if (index >= 0 && index < fileOtherDocumentList.value.length) {
    fileOtherDocumentList.value[index] = {
      file: new File([''], 'placeholder.txt'),
      status: 'notUpload',
    }
  }
}

const startEditing = (index: number) => {
  editingIndex.value = index
  originalMap.value[String(index)] = JSON.parse(JSON.stringify(localOtherDocuments.value[index]))
  resetPickedFile(index)
}

const cancelEditing = (index: number) => {
  const snapshot = originalMap.value[String(index)]
  if (snapshot) {
    const updated = [...localOtherDocuments.value]
    updated[index] = { ...snapshot }
    emit('update:otherDocuments', updated)
  }
  delete originalMap.value[String(index)]
  resetPickedFile(index)
  editingIndex.value = null
}

const saveRow = (index: number) => {
  delete originalMap.value[String(index)]
  editingIndex.value = null
}

const addAnotherDocument = () => {
  if (localOtherDocuments.value.length >= 5) return
  const updated = [...localOtherDocuments.value]
  updated.push({
    documentName: '',
    documentNo: '',
    description: '',
    issuedDate: '',
    expiredDate: '',
    uploadUrl: '',
  })
  emit('update:otherDocuments', updated)
  const newIndex = updated.length - 1
  startEditing(newIndex)
}

const deleteRow = (index: number) => {
  const updated = localOtherDocuments.value.filter((_, i) => i !== index)
  emit('update:otherDocuments', updated)
  fileOtherDocumentList.value.splice(index, 1)
  delete originalMap.value[String(index)]
  if (editingIndex.value !== null) {
    if (index === editingIndex.value) editingIndex.value = null
    else if (index < editingIndex.value) editingIndex.value = editingIndex.value - 1
  }
}

const onPickFile = (file: File, index: number) => {
  fileOtherDocumentList.value.splice(index, 1, {
    file,
    status: 'notUpload',
  })
}

const uploadPickedFile = async (index: number) => {
  const slot = fileOtherDocumentList.value[index]
  if (!slot || slot.file.name === 'placeholder.txt') return

  try {
    fileOtherDocumentList.value[index].status = 'loading'
    const response = await uploadStore.uploadFile(slot.file, 0)

    if (response?.path) {
      const updated = [...localOtherDocuments.value]
      updated[index] = { ...updated[index], uploadUrl: response.path }
      emit('update:otherDocuments', updated)
      fileOtherDocumentList.value[index].status = 'success'
    } else {
      fileOtherDocumentList.value[index].status = 'notUpload'
      modalUploadFailed.value = true
      console.error('Upload gagal: response kosong')
    }
  } catch (e) {
    console.error(e)
    fileOtherDocumentList.value[index].status = 'notUpload'
    modalUploadFailed.value = true
  }
}

const downloadFile = (url: string) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

watch(
  () => localOtherDocuments.value,
  (docs) => {
    docs.forEach((doc, i) => {
      const issued = doc.issuedDate ? new Date(doc.issuedDate as string) : null
      const expired = doc.expiredDate ? new Date(doc.expiredDate as string) : null
      if (issued && expired && expired < issued) {
        const updated = [...docs]
        updated[i] = { ...updated[i], expiredDate: '' as string }
        emit('update:otherDocuments', updated)
      }
    })
  },
  { deep: true },
)
</script>

<template>
  <div class="my-6">
    <div class="card">
      <div class="card-body overflow-auto">
        <div class="flex items-center gap-2 mb-2">
          <h2 class="text-lg font-semibold text-slate-700">Other Documents</h2>
          <div class="relative">
            <UiIcon name="information-1" variant="outline" class="text-primary text-xl peer" />
            <div
              class="tooltip absolute bg-primary font-medium w-44 p-3 left-1/2 -translate-x-1/2 -top-14 text-[13px] text-center text-white peer-hover:block"
            >
              Maximum of 5 Documents Allowed
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1 mb-4">
          <UiButton
            icon
            outline
            class="w-fit px-4 py-2 flex flex-row gap-2 items-center"
            :disabled="localOtherDocuments.length >= 5"
            @click="addAnotherDocument"
          >
            <i class="ki-filled ki-plus-circle"></i> Add Document
          </UiButton>
          <span class="text-danger text-xs">
            Must upload Account Statement. Without this document, data will be rejected.
          </span>
        </div>

        <div class="mt-2">
          <table class="table table-border align-middle border text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th class="text-nowrap">Document Name</th>
                <th class="text-nowrap">License Number / Description</th>
                <th class="text-nowrap">Valid From (Start Date)</th>
                <th class="text-nowrap">Valid Until (End Date)</th>
                <th class="text-nowrap">Document</th>
                <th class="text-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="localOtherDocuments.length === 0">
                <td colspan="6" class="text-center text-gray-500 py-4">
                  No other documents available.
                </td>
              </tr>

              <tr v-for="(_, index) in localOtherDocuments" :key="index">
                <td class="align-top">
                  <UiInput
                    v-model="localOtherDocuments[index].documentName"
                    placeholder="Document Name"
                    :disabled="!isEditing(index)"
                  />
                </td>

                <td class="align-top">
                  <UiInput
                    v-model="localOtherDocuments[index].documentNo"
                    placeholder="License Number / Description"
                    :disabled="!isEditing(index)"
                  />
                </td>

                <td class="align-top">
                  <DatePicker
                    v-model="localOtherDocuments[index].issuedDate as string | Date | null"
                    format="dd MM yyyy"
                    class="!w-48"
                    :disabled="!isEditing(index)"
                  />
                </td>

                <td class="align-top">
                  <DatePicker
                    v-model="localOtherDocuments[index].expiredDate as string | Date | null"
                    format="dd MM yyyy"
                    class="!w-48"
                    :disabled="!isEditing(index) || !localOtherDocuments[index]?.issuedDate"
                    :min-date="localOtherDocuments[index]?.issuedDate"
                  />
                </td>

                <td class="align-top">
                  <div v-if="isEditing(index)" class="flex items-center gap-2">
                    <UiFileUpload
                      :name="`${index}`"
                      :text-length="15"
                      :max-size="16000000"
                      :placeholder="
                        fileOtherDocumentList[index]?.file.name === 'placeholder.txt'
                          ? 'Choose file...'
                          : fileOtherDocumentList[index]?.file.name
                      "
                      accepted-files=".jpg,.jpeg,.png,.pdf,application/zip"
                      class="w-48"
                      :disabled="false"
                      @addedFile="(file) => onPickFile(file, index)"
                      @upload-failed="() => (modalUploadFailed = true)"
                    />

                    <div class="min-w-8 flex items-center justify-center">
                      <div
                        v-if="fileOtherDocumentList?.[index]?.status === 'loading'"
                        class="rounded-full border-2 size-6 border-primary border-t-primary-light animate-spin"
                      />
                      <UiIcon
                        v-else-if="fileOtherDocumentList?.[index]?.status === 'success'"
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
                        :disabled="fileOtherDocumentList?.[index]?.file?.name === 'placeholder.txt'"
                        aria-label="Upload document"
                      >
                        <i class="ki-filled ki-exit-up"></i>
                      </UiButton>
                    </div>
                  </div>

                  <div v-else class="flex items-center">
                    <template v-if="localOtherDocuments[index].uploadUrl">
                      <UiButton
                        outline
                        size="sm"
                        @click="downloadFile(localOtherDocuments[index].uploadUrl as string)"
                      >
                        <UiIcon name="cloud-download" variant="duotone" />
                        <span>Download Document</span>
                      </UiButton>
                    </template>
                    <span v-else class="text-slate-400">–</span>
                  </div>
                </td>

                <td class="align-middle">
                  <div class="flex items-center justify-center gap-2">
                    <template v-if="isEditing(index)">
                      <UiButton
                        outline
                        icon
                        size="sm"
                        @click="saveRow(index)"
                        aria-label="Save"
                        title="Save"
                      >
                        <UiIcon variant="duotone" name="check-circle" />
                      </UiButton>
                      <UiButton
                        outline
                        icon
                        size="sm"
                        @click="cancelEditing(index)"
                        aria-label="Cancel edit"
                        title="Cancel edit"
                        variant="danger"
                      >
                        <UiIcon variant="duotone" name="cross-circle" />
                      </UiButton>
                    </template>
                    <template v-else>
                      <UiButton
                        outline
                        icon
                        size="sm"
                        @click="startEditing(index)"
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
    </div>
  </div>

  <ModalConfirmation
    :open="modalUploadFailed"
    id="other-doc-upload-error"
    type="danger"
    title="Upload Failed"
    text="File size exceeds the maximum limit of 16 MB. Please choose a smaller file."
    no-submit
    static
    :cancel="() => (modalUploadFailed = false)"
  />
</template>
