import { ref } from 'vue'
import { defineStore } from 'pinia'
import generalApi from '@/core/utils/generalApi'

import type { ApiResponse } from '@/core/type/api'
import type { UploadFileResponse } from './types/upload'
import invoiceApi from '@/core/utils/invoiceApi'

export const useUploadStore = defineStore('upload', () => {
  const errorMessageUpload = ref<string>('')

  const uploadFile = async (FormFile: File, Actioner: number) => {
    const formData = new FormData()
    formData.append('FormFile', FormFile)
    formData.append('Actioner', String(Actioner))
    try {
      const response: ApiResponse<UploadFileResponse> = await generalApi.post(
        '/api/file/upload',
        formData,
      )

      // Hanya set error jika API melaporkan error, bukan saat sukses
      if (response.data.result.isError) {
        errorMessageUpload.value = response.data.result.message
        throw new Error(response.data.result.message)
      }

      errorMessageUpload.value = ''
      return response.data.result.content
    } catch (err: any) {
      // Handle axios / network errors and provide a friendly message
      const status = err?.response?.status
      const data = err?.response?.data

      if (status === 403 && typeof data === 'string' && data.includes('The specified account is disabled')) {
        errorMessageUpload.value = 'Upload gagal: storage account dinonaktifkan. Hubungi admin.'
      } else if (status === 403 && data?.error && typeof data.error === 'string') {
        errorMessageUpload.value = `Upload gagal: ${data.error}`
      } else if (err?.message) {
        errorMessageUpload.value = `Upload gagal: ${err.message}`
      } else {
        errorMessageUpload.value = 'Upload gagal: terjadi kesalahan jaringan.'
      }

      throw err
    }
  }

  const previewFile = async (fullFilePath: string) => {
    try {
      const response = await generalApi.get('/api/file/preview', {
        params: { fullFilePath },
        responseType: 'blob',
      })

      const link = URL.createObjectURL(response.data)
      window.open(link, '_blank')
    } catch (error) {
      console.error(error)
    }
  }

  return {
    errorMessageUpload,
    uploadFile,
    previewFile,
  }
})
