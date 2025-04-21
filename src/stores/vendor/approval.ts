import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IApproval } from './types/approval'
import type { ApiResponse } from '@/core/type/api'
import vendorAPI from '@/core/utils/vendorAPI'

export const useApprovalStore = defineStore('approval', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IApproval>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  })

  const getApproval = async (params: unknown) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IApproval> = await vendorAPI.get(
        '/public/verifiedvendor/approval/vendor-list',
        { params },
      )
      data.value = response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get approval data'
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, getApproval }
})
