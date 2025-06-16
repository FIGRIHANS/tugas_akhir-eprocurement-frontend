import { ref } from 'vue'
import { defineStore } from 'pinia'
import invoiceApi from '@/core/utils/invoiceApi'
import moment from 'moment'

import type { ApiResponse } from '@/core/type/api'
import type {
  ParamsSubmissionTypes,
  ListPoTypes,
  QueryParamsListPoTypes,
  DetailInvoiceEditTypes,
  PostVerificationTypes,
  ParamsRejectTypes
} from './types/verification'

export const useInvoiceVerificationStore = defineStore('invoiceVerification', () => {
  const listPo = ref<ListPoTypes[]>([])
  const detailInvoice = ref<ParamsSubmissionTypes>()
  const isFromEdit = ref<boolean>(false)
  const detailInvoiceEdit = ref<DetailInvoiceEditTypes>()
  const isRejectLoading = ref<boolean>(false)

  const getListPo = async (data: QueryParamsListPoTypes) => {
    listPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null
    }
    const response: ApiResponse<ListPoTypes[]> = await invoiceApi.get(`/invoice/approval`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query
      }
    })
  
    listPo.value = response.data.result.content.sort((a, b) => moment(b.invoiceDate).valueOf() - moment(a.invoiceDate).valueOf())
  
    return response.data.result.content
  }

  const getInvoiceDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(`/invoice/approval/${uid}`)
  
    detailInvoice.value = response.data.result.content
  
    return response.data.result
  }

  const postSubmission = async (data: PostVerificationTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/approval`, data)

    return response.data.result
  }

  const postReject = async (data: ParamsRejectTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/reject`, data)

    return response.data.result
  }

  return {
    listPo,
    detailInvoice,
    isFromEdit,
    detailInvoiceEdit,
    isRejectLoading,
    postSubmission,
    getListPo,
    getInvoiceDetail,
    postReject
  }
})