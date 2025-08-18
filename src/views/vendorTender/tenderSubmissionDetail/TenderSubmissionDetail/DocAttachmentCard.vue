<template>
  <div class="card">
    <div class="card-body flex flex-col gap-[16px]">
      <div class="flex flex-col justify-between">
        <span class="text-gray-500">Tender Technical Proposal</span>
        <div class="file-status">
          <span
            v-if="!technicalFile"
            class="text-blue-500 cursor-pointer"
            @click="triggerFileUpload('technicalRef')"
          >
            Upload Document
          </span>
          <div v-else class="flex items-center gap-2">
            <!-- <img src="/path-to-pdf-icon.svg" alt="PDF Icon" class="w-5 h-5" /> -->

            <span class="text-gray-700">{{ technicalFile.name }}</span>
            <button @click="removeFile('technicalFile')" class="text-red-500 ml-auto">Hapus</button>
          </div>
        </div>
        <input
          type="file"
          ref="technicalRef"
          @change="handleFileChange($event, 'technicalFile')"
          class="hidden"
        />
      </div>

      <div class="flex flex-col justify-between">
        <span class="text-gray-500">Tender Comercial Proposal</span>
        <div class="file-status">
          <span
            v-if="!commercialFile"
            class="text-blue-500 cursor-pointer"
            @click="triggerFileUpload('commercialRef')"
          >
            Upload Document
          </span>
          <div v-else class="flex items-center gap-2">
            <!-- <img src="/path-to-pdf-icon.svg" alt="PDF Icon" class="w-5 h-5" /> -->
            <span class="text-gray-700">{{ commercialFile.name }}</span>
            <button @click="removeFile('commercialFile')" class="text-red-500 ml-auto">
              Hapus
            </button>
          </div>
        </div>
        <input
          type="file"
          ref="commercialRef"
          @change="handleFileChange($event, 'commercialFile')"
          class="hidden"
        />
      </div>

      <div class="flex flex-col justify-between">
        <span class="text-gray-500">Other Document</span>
        <div class="file-status">
          <span
            v-if="!otherFile"
            class="text-blue-500 cursor-pointer"
            @click="triggerFileUpload('otherRef')"
          >
            Upload Document
          </span>
          <div v-else class="flex items-center gap-2">
            <!-- <img src="/path-to-pdf-icon.svg" alt="PDF Icon" class="w-5 h-5" /> -->
            <span class="text-gray-700">{{ otherFile.name }}</span>
            <button @click="removeFile('otherFile')" class="text-red-500 ml-auto">Hapus</button>
          </div>
        </div>
        <input
          type="file"
          ref="otherRef"
          @change="handleFileChange($event, 'otherFile')"
          class="hidden"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// Definisikan refs untuk elemen input file
const technicalRef = ref<HTMLInputElement | null>(null)
const commercialRef = ref<HTMLInputElement | null>(null)
const otherRef = ref<HTMLInputElement | null>(null)

// Definisikan refs untuk menyimpan file yang diunggah
const technicalFile = ref<File | null>(null)
const commercialFile = ref<File | null>(null)
const otherFile = ref<File | null>(null)

/**
 * Memicu klik pada input file yang disembunyikan.
 */
const triggerFileUpload = (refName: string) => {
  let inputElement: HTMLInputElement | null = null

  // Menggunakan switch-case untuk kode yang lebih rapi
  switch (refName) {
    case 'technicalRef':
      inputElement = technicalRef.value
      break
    case 'commercialRef':
      inputElement = commercialRef.value
      break
    case 'otherRef':
      inputElement = otherRef.value
      break
  }

  if (inputElement) {
    inputElement.click()
  } else {
    console.error(`Ref dengan nama "${refName}" tidak ditemukan.`)
  }
}

/**
 * Menangani event perubahan pada input file dan menyimpan file.
 */
const handleFileChange = (event: Event, fileRefName: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    switch (fileRefName) {
      case 'technicalFile':
        technicalFile.value = file
        break
      case 'commercialFile':
        commercialFile.value = file
        break
      case 'otherFile':
        otherFile.value = file
        break
    }
  }
}

/**
 * Menghapus file yang sudah diunggah.
 */
const removeFile = (fileRefName: string) => {
  switch (fileRefName) {
    case 'technicalFile':
      technicalFile.value = null
      break
    case 'commercialFile':
      commercialFile.value = null
      break
    case 'otherFile':
      otherFile.value = null
      break
  }
}
</script>
