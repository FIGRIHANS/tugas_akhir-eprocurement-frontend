import type { ApiResponse } from '@/core/type/api'
import vendorApi from '@/core/utils/vendorApi'
import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IExperienceData, IExperiencePayload } from './types/experience'

const useExperienceStore = defineStore('experience-data', () => {
  const data = ref<IExperienceData[]>([])
  const loading = ref(false)
  const error = ref('')

  const getData = async (vendorId: number) => {
    loading.value = true
    error.value = ''

    try {
      const response: ApiResponse<IExperienceData[]> = await vendorApi.get(
        `/public/vendorchangedata/vendorexperience?vendorId=${vendorId}`,
      )

      if (response.data.result.isError) {
        error.value = response.data.result.message
        return
      }

      data.value = response.data.result.content
      return response.data
    } catch (err) {
      if (err instanceof Error) {
        error.value = isAxiosError(err) ? err.response?.data : 'Failed to Get data'
      }
    } finally {
      loading.value = false
    }
  }

  const update = async (payload: IExperiencePayload) => {
    const response: ApiResponse = await vendorApi.post(
      '/public/vendorchangedata/post/vendorexperience',
      payload,
    )
    return response.data
  }

  return { loading, error, data, getData, update }
})

export default useExperienceStore
