import { ref } from 'vue'
import { defineStore } from 'pinia'
import invoiceApi from '@/core/utils/invoiceApi'
import moment from 'moment'

import type { ApiResponse } from '@/core/type/api'
import type {
  SubmissionStatusTypes,
  DocumentTypes,
  TaxCalculationTypes,
  ParamsSubmissionTypes,
  PoGrItemTypes,
  ListPoTypes,
  QueryParamsListPoTypes
} from './types/submission'

export const useInvoiceSubmissionStore = defineStore('invoiceSubmission', () => {
  const submissionStatus = ref<SubmissionStatusTypes[]>([])
  const documentTypeList = ref<DocumentTypes[]>([])
  const taxCalculationList = ref<TaxCalculationTypes[]>([])
  const poGrList = ref<PoGrItemTypes[]>([])
  const listPo = ref<ListPoTypes[]>([])
  const detailPo = ref<ParamsSubmissionTypes>()

  const getSubmissionStatus = async () => {
    const response: ApiResponse<SubmissionStatusTypes[]> = await invoiceApi.get(`/lookup/invoice/submission/status`)

    submissionStatus.value = response.data.result.content

    return response.data.result
  }

  const getDocumentType = async () => {
    const response: ApiResponse<DocumentTypes[]> = await invoiceApi.get(`/lookup/document-type`)
  
    documentTypeList.value = response.data.result.content
  
    return response.data.result
  }

  const getTaxCalculation = async () => {
    const response: ApiResponse<TaxCalculationTypes[]> = await invoiceApi.get(`/lookup/tax-calculation`)
  
    taxCalculationList.value = response.data.result.content
  
    return response.data.result
  }

  const getPoGr = async (poNumber: string, companyCode: string, vendorCode: string) => {
    const response: ApiResponse<PoGrItemTypes[]> = await invoiceApi.get(`/invoice/po-gr?poNumber=${poNumber}&companyCode=${companyCode}&vendorCode=${vendorCode}`)
  
    poGrList.value = response.data.result.content
  
    return response.data.result
  }

  const getListPo = async (data: QueryParamsListPoTypes) => {
    listPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null
    }
    const response: ApiResponse<ListPoTypes[]> = await invoiceApi.get(`/invoice/submission`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query
      }
    })

    const newList = response.data.result.content.map((item) => {
      return {
        ...item,
        isOpenChild: false
      }
    })

    console.log(newList)
  
    listPo.value = newList.sort((a, b) => moment(b.invoiceDate).valueOf() - moment(a.invoiceDate).valueOf())
  
    return newList
  }

  const getPoDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(`/invoice/submission/${uid}`)
  
    detailPo.value = response.data.result.content
  
    return response.data.result
  }

  const postSubmission = async (data: ParamsSubmissionTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/submission`, data)

    return response.data.result
  }

  return {
    submissionStatus,
    documentTypeList,
    taxCalculationList,
    poGrList,
    listPo,
    detailPo,
    getSubmissionStatus,
    getDocumentType,
    getTaxCalculation,
    getPoGr,
    postSubmission,
    getListPo,
    getPoDetail
  }
})