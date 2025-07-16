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
      '/file/upload',
      formData,
    )

    return response.data.result.content
  }

  const previewFile = async (fullFilePath: string) => {
    const response: ApiResponse = await generalApi.post('/file/preview', { fullFilePath })

    return response.data.result.content
  }

  return {
    uploadFile,
    previewFile,
  }
})
