import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IBlacklist } from './types/blacklist'
import type { ApiResponse } from '@/core/type/api'
import vendorAPI from '@/core/utils/vendorAPI'

export const useBlacklistStore = defineStore('blacklist', () => {
  const loading = ref(false)
  const error = ref('')
  const blacklist = ref<IBlacklist>({
    items: [],
    page: 1,
    pageSize: 10,
    total: 0,
  })

  const getBlacklist = async (params: unknown) => {
    loading.value = true

    try {
      const response: ApiResponse<IBlacklist> = await vendorAPI.get(
        '/public/verifiedvendor/blacklist/vendor-list',
        { params },
      )
      if (response.data.statusCode === 200) {
        blacklist.value = response.data.result.content
      } else {
        error.value = response.data.result.message
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, blacklist, getBlacklist }
})
