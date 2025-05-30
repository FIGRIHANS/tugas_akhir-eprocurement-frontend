// import { ref } from 'vue'
import { defineStore } from 'pinia'
import generalApi from '@/core/utils/generalApi'

import type { ApiResponse } from '@/core/type/api'
import type {
  UploadFileResponse
} from './types/generalMasterData'

export const useGeneralMasterDataStore = defineStore('generalMasterData', () => {
  const uploadFile = async ({
    Actioner,
    FileName,
  }: {
    Actioner: string
    FileName: string
  }) => {
    const formData = new FormData()
    formData.append('Actioner', Actioner)
    formData.append('FileName', FileName)

    const response: ApiResponse<UploadFileResponse> = await generalApi.post(
      '/api/file/upload',
      formData,
    )

    return response.data.result.content
  }

  return {
    uploadFile
  }
})