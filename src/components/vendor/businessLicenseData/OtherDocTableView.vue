<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IOtherDocument } from '@/stores/vendor/types/vendor' // Asumsi Anda punya type ini

// State untuk form penambahan dokumen baru
const newDocument = ref<IOtherDocument>({
  documentName: '',
  documentNo: '',
  uploadUrl: '',
  description: '',
  issuedDate: null,
  expiredDate: null,
})

// Contoh data dokumen lain (akan diisi dari API nanti)
const otherDocuments = ref<IOtherDocument[]>([
  {
    documentName: 'Surat Keterangan Domisili',
    documentNo: 'SKD-123/2024',
    uploadUrl: 'path/to/skd.pdf',
    description: 'Surat Keterangan Domisili Perusahaan',
    issuedDate: '2023-01-15',
    expiredDate: '2025-01-15',
  },
  // Anda bisa menambahkan data dummy lainnya di sini
])

const showAddForm = ref(false) // State untuk menampilkan/menyembunyikan form

const emit = defineEmits(['add:otherDocument', 'update:otherDocument', 'delete:otherDocument'])

// Fungsi untuk menambahkan dokumen baru
const addDocument = () => {
  if (newDocument.value.documentName && newDocument.value.documentNo) {
    emit('add:otherDocument', { ...newDocument.value })
    // Reset form setelah ditambahkan
    newDocument.value = {
      documentName: '',
      documentNo: '',
      uploadUrl: '',
      description: '',
      issuedDate: null,
      expiredDate: null,
    }
    showAddForm.value = false // Sembunyikan form setelah submit
  } else {
    alert('Nama Dokumen dan Nomor Dokumen tidak boleh kosong!')
  }
}

// Fungsi untuk memperbarui dokumen
const updateDocument = (doc: IOtherDocument) => {
  console.log('Updating other document:', doc)
  emit('update:otherDocument', doc)
}

// Fungsi untuk menghapus dokumen
const deleteDocument = (index: number) => {
  // Biasanya Anda akan menghapus berdasarkan ID dari backend, ini contoh sederhana
  const deletedDoc = otherDocuments.value[index]
  if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${deletedDoc.documentName}"?`)) {
    emit('delete:otherDocument', deletedDoc.id) // Asumsi ada ID
    otherDocuments.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="my-6">
    <div class="card">
      <div class="card-body">
        <h2 class="text-lg font-semibold text-slate-700 mb-4">Other Document</h2>

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
                v-model="newDocument.issuedDate"
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
                v-model="newDocument.expiredDate"
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
              <tr v-if="otherDocuments.length === 0">
                <td colspan="6" class="text-center text-gray-500 py-4">
                  No other documents available.
                </td>
              </tr>
              <tr v-for="(item, index) in otherDocuments" :key="index">
                <td>
                  <UiInput v-model="item.documentName" placeholder="Document Name" />
                </td>
                <td>
                  <UiInput v-model="item.documentNo" placeholder="License Number / Description" />
                </td>
                <td>
                  <DatePicker
                    v-model="item.issuedDate"
                    format="dd MM yyyy"
                    placeholder="Pilih Tanggal"
                  />
                </td>
                <td>
                  <DatePicker
                    v-model="item.expiredDate"
                    format="dd MM yyyy"
                    placeholder="Pilih Tanggal"
                  />
                </td>
                <td>
                  <UiFileUpload
                    name="otherDocFile"
                    accepted-files=".jpg,.jpeg,.png,.pdf"
                    v-model="item.uploadUrl"
                    placeholder="Upload file"
                  />
                </td>
                <td>
                  <div class="flex gap-2">
                    <UiButton outline @click="updateDocument(item)">
                      <UiIcon variant="duotone" name="pencil"></UiIcon>
                      Update
                    </UiButton>
                    <UiButton outline color="danger" @click="deleteDocument(index)">
                      <UiIcon variant="duotone" name="trash"></UiIcon>
                      Delete
                    </UiButton>
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
