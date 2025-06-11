import { ref } from 'vue'
import { defineStore } from 'pinia'
import invoiceApi from '@/core/utils/invoiceApi'
import moment from 'moment'

import type { ApiResponse } from '@/core/type/api'
import type {
  ParamsSubmissionTypes,
  ListPoTypes,
  QueryParamsListPoTypes
} from './types/verification'

export const useInvoiceVerificationStore = defineStore('invoiceVerification', () => {
  const listPo = ref<ListPoTypes[]>([])
  const detailInvoice = ref<ParamsSubmissionTypes>()

  const getListPo = async (data: QueryParamsListPoTypes) => {
    listPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null
    }
    const response: ApiResponse<ListPoTypes[]> = await invoiceApi.get(`/invoice/verify`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query
      }
    })
  
    listPo.value = response.data.result.content.sort((a, b) => moment(b.invoiceDate).valueOf() - moment(a.invoiceDate).valueOf())
  
    return response.data.result.content
  }

  const getInvoiceDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(`/invoice/verify/${uid}`)
  
    detailInvoice.value = response.data.result.content
  
    return response.data.result
  }

  const postSubmission = async (data: ParamsSubmissionTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/verify`, data)

    return response.data.result
  }

  return {
    listPo,
    detailInvoice,
    postSubmission,
    getListPo,
    getInvoiceDetail
  }
})