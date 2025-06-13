import type { ApiResponse } from '@/core/type/api'
import generalApi from '@/core/utils/generalApi'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UploadFileResponse } from '../general/types/upload'

export interface IUploadResponse {
  name: string
  url: string
  urlWithToken: string
}

export const useVendorUploadStore = defineStore('vendor-upload', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const upload = async (formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<UploadFileResponse> = await generalApi.post(
        '/api/file/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      if (response.data.statusCode !== 200) {
        error.value = response.data.result.message
        return
      }
      return response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.result.content
        }
      }
    } finally {
      loading.value = false
    }
  }

  const preview = async (path: string) => {
    const response = await generalApi.get('/api/file/preview', {
      params: { fullFilePath: path },
      responseType: 'blob',
    })
    return response.data
  }

  return { upload, preview, loading, error }
})
