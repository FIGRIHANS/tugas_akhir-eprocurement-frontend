import { defineStore } from 'pinia'
import generalApi from '@/core/utils/generalApi'

import type { ApiResponse } from '@/core/type/api'

export const usePreviewFileStore = defineStore('previewFile', () => {
  const getPreview = async (path: string) => {
    const response: ApiResponse<Blob> = await generalApi.get(`/api/file/preview`, {
      params: { fullFilePath: path },
      responseType: 'blob',
    })
    return response
  }

  return {
    getPreview,
  }
})
