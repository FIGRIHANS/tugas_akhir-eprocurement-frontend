import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  IApproval,
  IApprove,
  IMatrixBody,
  IMatrixResponse,
  ISendSAPBody,
  IVendorDetail,
} from './types/approval'
import type { ApiResponse } from '@/core/type/api'
import vendorAPI from '@/core/utils/vendorApi'
import { useLoginStore } from '../views/login'

const userStore = useLoginStore()

export const useApprovalStore = defineStore('approval', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IApproval>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  })
  const matrixData = ref<IMatrixResponse[]>([])
  const userData = computed(() => userStore.userData)
  const vendorDetail = ref<IVendorDetail[]>([])

  const getApproval = async (params: unknown) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IApproval> = await vendorAPI.get(
        `/public/verifiedvendor/approval/vendor-list?EmployeeId=${userData.value?.profile.employeeId}`,
        { params },
      )

      if (response.data.result.isError) {
        error.value = response.data.result.message
        return
      }

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

  const approve = async (params: IApprove) => {
    const response: ApiResponse = await vendorAPI.put(
      '/public/verifiedvendor/approve',
      {},
      { params },
    )
    return response.data
  }

  const sendSAP = async (body: ISendSAPBody) => {
    const response: ApiResponse = await vendorAPI.post('/public/verifiedvendor/sent-sap', body)
    return response.data
  }

  const getMatrix = async (params: IMatrixBody) => {
    const response: ApiResponse<IMatrixResponse[]> = await vendorAPI.get(
      '/public/verifiedvendor/approval/vendor-detail',
      { params },
    )

    if (!response.data.result.isError) {
      matrixData.value = response.data.result.content
    }

    return response.data
  }

  const getVendorById = async (vendorId: number) => {
    try {
      const response: ApiResponse<IVendorDetail[]> = await vendorAPI.get(
        '/public/verifiedvendor/getvendor',
        {
          params: { vendorId },
        },
      )
      if (response.data.result.isError) {
        throw new Error(response.data.result.message)
      }
      vendorDetail.value = response.data.result.content
      return vendorDetail.value
    } catch (error) {
      console.error('Error fetching vendor by ID:', error)
      throw error
    }
  }

  return {
    loading,
    error,
    data,
    getApproval,
    approve,
    sendSAP,
    getMatrix,
    matrixData,
    getVendorById,
    vendorDetail,
  }
})
