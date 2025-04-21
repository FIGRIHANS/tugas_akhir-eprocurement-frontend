import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IReferenceList } from './types/reference'
import vendorAPI from '@/core/utils/vendorAPI'
import type { ApiResponse } from '@/core/type/api'

export const useReferenceStore = defineStore('reference', () => {
  const loading = ref(false)
  const error = ref('')
  const referenceList = ref<IReferenceList[]>([])

  const getReference = async (
    type: 'BLACKLIST' | 'APPROVAL_STATUS' | 'APPROVAL_TYPE' | 'BLACKLIST_TYPE',
  ) => {
    loading.value = true
    error.value = ''

    try {
      const response: ApiResponse<IReferenceList[]> = await vendorAPI.get(
        '/public/vendor/registration/reference',
        { params: { type } },
      )
      referenceList.value = response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, referenceList, getReference }
})
