import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IBlacklist, IBlacklistApprovalPayload } from './types/blacklist'
import type { ApiResponse } from '@/core/type/api'
import vendorAPI from '@/core/utils/vendorApi'
import { isAxiosError } from 'axios'

export const useBlacklistStore = defineStore('blacklist', () => {
  const loading = ref(false)
  const error = ref('')
  const blacklist = ref<IBlacklist>({
    items: [],
    page: 1,
    pageSize: 10,
    total: 0,
  })

  const getBlacklist = async (params: Record<string, unknown>, isApproval: number) => {
    loading.value = true

    try {
      const response: ApiResponse<IBlacklist> = await vendorAPI.get(
        '/public/verifiedvendor/blacklist/vendor-list',
        {
          params: {
            ...params,
            isApproval,
          },
        },
      )
      if (response.data.result.isError) {
        error.value = response.data.result.message
        return
      }

      blacklist.value = response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = isAxiosError(err) ? err.response?.data.result.message : 'Failed to get data!'
      }
    } finally {
      loading.value = false
    }
  }

  const approval = async (payload: IBlacklistApprovalPayload) => {
    const response: ApiResponse = await vendorAPI.post(
      '/public/verifiedvendor/blacklist/approval',
      {},
      {
        params: payload,
      },
    )
    return response.data
  }

  return { loading, error, blacklist, getBlacklist, approval }
})
