import { defineStore } from 'pinia'
import generalApi from '@/core/utils/generalApi'

import type { ApiResponse } from '@/core/type/api'
import type { UploadFileResponse } from './types/upload'

export const useUploadStore = defineStore('upload', () => {
  const uploadFile = async (FormFile: File, Actioner: number) => {
    const formData = new FormData()
    formData.append('FormFile', FormFile)
    formData.append('Actioner', String(Actioner))

    const response: ApiResponse<UploadFileResponse> = await generalApi.post(
      '/api/file/upload',
      formData,
    )

    return response.data.result.content
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
    uploadFile,
    previewFile,
  }
})
