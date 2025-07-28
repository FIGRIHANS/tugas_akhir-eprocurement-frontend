<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IOtherDocument } from '@/stores/vendor/types/vendor'

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
  {
    documentName: 'Sertifikat ISO 9001',
    documentNo: 'ISO-456/2023',
    uploadUrl: 'path/to/iso.pdf',
    description: 'Sertifikasi Sistem Manajemen Mutu',
    issuedDate: '2023-03-01',
    expiredDate: '2026-03-01',
  },
  // Anda bisa menambahkan data dummy lainnya di sini
])

const showAddForm = ref(false) // State untuk menampilkan/menyembunyikan form
const editingDocIndex = ref<number | null>(null) // State untuk melacak indeks dokumen yang sedang diedit

const emit = defineEmits(['add:otherDocument', 'update:otherDocument', 'delete:otherDocument'])

// Fungsi untuk menambahkan dokumen baru
const addDocument = () => {
  if (newDocument.value.documentName && newDocument.value.documentNo) {
    // Tambahkan dokumen baru ke array lokal untuk demo
    // Di aplikasi nyata, Anda akan menunggu respons API sebelum menambahkan ke array
    otherDocuments.value.push({ ...newDocument.value })

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
  editingDocIndex.value = null // Keluar dari mode edit setelah update
}

// Fungsi untuk menghapus dokumen
const deleteDocument = (index: number) => {
  const deletedDoc = otherDocuments.value[index]
  if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${deletedDoc.documentName}"?`)) {
    // Di aplikasi nyata, Anda akan memanggil API delete berdasarkan ID
    // Kemudian, jika berhasil, hapus dari array lokal
    // emit('delete:otherDocument', deletedDoc.id); // Asumsi ada ID
    otherDocuments.value.splice(index, 1)
    editingDocIndex.value = null // Pastikan keluar dari mode edit jika yang dihapus sedang diedit
  }
}

// Fungsi untuk memulai mode edit
const startEditing = (index: number) => {
  editingDocIndex.value = index
}

// Fungsi untuk membatalkan mode edit
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
              <tr v-if="otherDocuments.length === 0">
                <td colspan="6" class="text-center text-gray-500 py-4">
                  No other documents available.
                </td>
              </tr>
              <tr v-for="(item, index) in otherDocuments" :key="index">
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
                        @click="updateDocument(item)"
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
