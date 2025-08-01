import type { ApiResponse } from '@/core/type/api'
import vendorApi from '@/core/utils/vendorApi'
import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IOtherDocumentData } from './types/otherDocument'

const useOtherDocStore = defineStore('other-documents', () => {
  const data = ref<IOtherDocumentData[]>([])
  const loading = ref(false)
  const error = ref('')

  const get = async (vendorId: number) => {
    loading.value = true
    error.value = ''

    try {
      const response: ApiResponse<IOtherDocumentData[]> = await vendorApi.get(
        `/public/vendorchangedata/otherdocuments?vendorId=${vendorId}`,
      )

      if (response.data.result.isError) {
        error.value = response.data.result.message
        return
      }

      data.value = response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        error.value = isAxiosError(err) ? err.response?.data.result.message : 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  const update = async (payload: Record<string, unknown>) => {
    const response: ApiResponse = await vendorApi.post(
      '/public/vendorchangedata/post/otherdocument',
      payload,
    )
    return response.data
  }

  return { data, loading, error, get, update }
})

export default useOtherDocStore
