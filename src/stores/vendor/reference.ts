import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IReferenceList } from './types/reference'
import vendorAPI from '@/core/utils/vendorApi'
import type { ApiResponse } from '@/core/type/api'
import axios from 'axios'

const getReference = async (
  type: 'BLACKLIST' | 'APPROVAL_STATUS' | 'APPROVAL_TYPE' | 'BLACKLIST_TYPE' | 'VERIFY_STATUS',
) => {
  const response: ApiResponse<IReferenceList[]> = await vendorAPI.get(
    '/public/vendor/registration/reference',
    { params: { type } },
  )
  return response.data.result.content
}

export const useVerificationStatus = defineStore('verificationStatus', () => {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const data = ref<IReferenceList[]>([])

  const get = async () => {
    loading.value = true
    error.value = null

    try {
      data.value = await getReference('VERIFY_STATUS')
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.result.message || 'Failed to get data'
        }
      }
    }
  }

  return { data, get }
})

export const useApprovalStatusStore = defineStore('approvalStatus', () => {
  const loading = ref(false)
  const error = ref('')
  const approvalStatus = ref<IReferenceList[]>([])

  const getStatus = async () => {
    loading.value = true
    error.value = ''

    try {
      approvalStatus.value = await getReference('APPROVAL_STATUS')
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    }
  }

  return { loading, error, approvalStatus, getStatus }
})

export const useApprovalTypeStore = defineStore('approvalType', () => {
  const loading = ref(false)
  const error = ref('')
  const approvalType = ref<IReferenceList[]>([])

  const getType = async () => {
    loading.value = true
    error.value = ''

    try {
      approvalType.value = await getReference('APPROVAL_TYPE')
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    }
  }

  return { loading, error, approvalType, getType }
})

export const useBlacklistPeriodStore = defineStore('blacklistPeriod', () => {
  const loading = ref(false)
  const error = ref('')
  const period = ref<IReferenceList[]>([])

  const getPeriod = async () => {
    loading.value = true
    error.value = ''

    try {
      period.value = await getReference('BLACKLIST')
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    }
  }

  return { loading, error, period, getPeriod }
})

export const useBlacklistTypeStore = defineStore('blacklistPeriod', () => {
  const loading = ref(false)
  const error = ref('')
  const type = ref<IReferenceList[]>([])

  const getType = async () => {
    loading.value = true
    error.value = ''

    try {
      type.value = await getReference('APPROVAL_TYPE')
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    }
  }

  return { loading, error, type, getType }
})
