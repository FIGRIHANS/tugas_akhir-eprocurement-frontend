import { defineStore } from 'pinia'
import generalApi from '@/core/utils/generalApi'

import type { ApiResponse } from '@/core/type/api'
import type { UploadFileResponse } from './types/upload'

export const usePreviewFileStore = defineStore('previewFile', () => {
  const getPreview = async (path: string) => {
    const params = new URLSearchParams(`fullFilePath=${path}`)
    const response: ApiResponse<UploadFileResponse> = await generalApi.get(
      `/api/file/preview`,
      {
        params
      }
    )

    return response.data.result.content
  }

  return {
    getPreview,
  }
})
