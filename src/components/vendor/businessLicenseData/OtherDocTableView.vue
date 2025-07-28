<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IOtherDocument } from '@/stores/vendor/types/vendor'

const props = defineProps({
  otherDocuments: {
    type: Array as PropType<IOtherDocument[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:otherDocuments'])

const localOtherDocuments = computed({
  get: () => props.otherDocuments,
  set: (newValue) => {
    emit('update:otherDocuments', newValue)
  },
})

const newDocument = ref<IOtherDocument>({
  documentName: '',
  documentNo: '',
  uploadUrl: '',
  description: '',
  issuedDate: null,
  expiredDate: null,
})

const showAddForm = ref(false)
const editingDocIndex = ref<number | null>(null)

const addDocument = () => {
  if (newDocument.value.documentName && newDocument.value.documentNo) {
    const updatedArray = [...localOtherDocuments.value, { ...newDocument.value }]
    emit('update:otherDocuments', updatedArray)

    newDocument.value = {
      documentName: '',
      documentNo: '',
      uploadUrl: '',
      description: '',
      issuedDate: null,
      expiredDate: null,
    }
    showAddForm.value = false
  } else {
    console.warn('Nama Dokumen dan Nomor Dokumen tidak boleh kosong!')
  }
}

const updateDocument = (doc: IOtherDocument, index: number) => {
  console.log('Updating other document:', doc)
  const updatedArray = [...localOtherDocuments.value]
  updatedArray[index] = { ...doc }
  emit('update:otherDocuments', updatedArray)
  editingDocIndex.value = null
}

const deleteDocument = (index: number) => {
  const deletedDoc = localOtherDocuments.value[index]
  console.log(`Attempting to delete document "${deletedDoc.documentName}"`)
  const updatedArray = localOtherDocuments.value.filter((_, i) => i !== index)
  emit('update:otherDocuments', updatedArray)
  editingDocIndex.value = null
}

const startEditing = (index: number) => {
  editingDocIndex.value = index
}

const cancelEditing = () => {
  editingDocIndex.value = null
}
</script>

<template>
  <div class="my-6">
    <div class="card">
      <div class="card-body">
        <h2 class="text-lg font-semibold text-slate-700 mb-4">Other Document</h2>

        <button class="btn btn-primary" data-tooltip="#custom_popover" data-tooltip-trigger="click">
          Toggle Popover
        </button>
        <div class="popover max-w-72" id="custom_popover">
          <div class="popover-header">Popover Title</div>
          <div class="popover-body">
            Behold this captivating popover content. It's quite engaging, wouldn't you say ?
          </div>
        </div>

        <UiButton outline @click="showAddForm = !showAddForm">
          <UiIcon variant="duotone" name="plus-circle"></UiIcon>
          {{ showAddForm ? 'Cancel Add Document' : 'Add Document' }}</UiButton
        >

        <div v-if="showAddForm" class="mt-4 p-4 border rounded-md bg-gray-50">
          <h3 class="text-md font-semibold mb-3">Add New Document</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="newDocName" class="block text-sm font-medium text-gray-700"
                >Document Name</label
              >
              <UiInput
                id="newDocName"
                v-model="newDocument.documentName"
                placeholder="Document Name"
              />
            </div>
            <div>
              <label for="newDocNo" class="block text-sm font-medium text-gray-700"
                >License Number / Description</label
              >
              <UiInput
                id="newDocNo"
                v-model="newDocument.documentNo"
                placeholder="License Number / Description"
              />
            </div>
            <div>
              <label for="newDocIssuedDate" class="block text-sm font-medium text-gray-700"
                >Valid From (Start Date)</label
              >
              <DatePicker
                id="newDocIssuedDate"
                v-model="newDocument.issuedDate as string | Date | null"
                format="dd MM yyyy"
                placeholder="Pilih Tanggal"
              />
            </div>
            <div>
              <label for="newDocExpiredDate" class="block text-sm font-medium text-gray-700"
                >Valid Until (End Date)</label
              >
              <DatePicker
                id="newDocExpiredDate"
                v-model="newDocument.expiredDate as string | Date | null"
                format="dd MM yyyy"
                placeholder="Pilih Tanggal"
              />
            </div>
            <div class="col-span-full">
              <label for="newDocUpload" class="block text-sm font-medium text-gray-700"
                >Document File</label
              >
              <UiFileUpload
                id="newDocUpload"
                name="otherDocumentFile"
                accepted-files=".jpg,.jpeg,.png,.pdf"
                v-model="newDocument.uploadUrl"
                placeholder="Upload file"
              />
            </div>
            <div class="col-span-full">
              <label for="newDocDescription" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <UiInput
                id="newDocDescription"
                v-model="newDocument.description"
                placeholder="Description"
              />
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <UiButton @click="addDocument">
              <UiIcon variant="duotone" name="save"></UiIcon>
              Save Document
            </UiButton>
          </div>
        </div>

        <div class="mt-6">
          <table class="table align-middle border">
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
              <!-- Use localOtherDocuments for iteration -->
              <tr v-for="(item, index) in localOtherDocuments" :key="index">
                <td>
                  <UiInput
                    v-model="item.documentName"
                    placeholder="Document Name"
                    :disabled="editingDocIndex !== index"
                  />
                </td>
                <td>
                  <UiInput
                    v-model="item.documentNo"
                    placeholder="License Number / Description"
                    :disabled="editingDocIndex !== index"
                  />
                </td>
                <td>
                  <DatePicker
                    v-model="item.issuedDate as string | Date | null"
                    format="dd MM yyyy"
                    placeholder="Pilih Tanggal"
                    :disabled="editingDocIndex !== index"
                  />
                </td>
                <td>
                  <DatePicker
                    v-model="item.expiredDate as string | Date | null"
                    format="dd MM yyyy"
                    placeholder="Pilih Tanggal"
                    :disabled="editingDocIndex !== index"
                  />
                </td>
                <td>
                  <UiFileUpload
                    name="otherDocFile"
                    accepted-files=".jpg,.jpeg,.png,.pdf"
                    v-model="item.uploadUrl"
                    placeholder="Upload file"
                    :disabled="editingDocIndex !== index"
                  />
                </td>
                <td>
                  <div class="flex gap-2">
                    <template v-if="editingDocIndex === index">
                      <UiButton
                        variant="primary"
                        @click="updateDocument(item, index)"
                        size="sm"
                        class="me-2"
                      >
                        <UiIcon variant="duotone" name="check-circle"></UiIcon>
                      </UiButton>
                      <UiButton variant="danger" @click="deleteDocument(index)" size="sm">
                        <UiIcon variant="duotone" name="trash"></UiIcon>
                      </UiButton>
                      <UiButton outline @click="cancelEditing()" size="sm" class="ms-2">
                        <UiIcon variant="duotone" name="times-circle"></UiIcon>
                      </UiButton>
                    </template>
                    <template v-else>
                      <UiButton outline @click="startEditing(index)" size="sm">
                        <UiIcon variant="duotone" name="pencil"></UiIcon>
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
</template>
