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
  QueryParamsListPoTypes,
  AvailableDpTypes,
  RemainingDpTypes,
  ParamsSubmissionNonPo
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

    const newList = !response.data.result.content ? [] : response.data.result.content.map((item) => {
      return {
        ...item,
        isOpenChild: false
      }
    })
  
    listPo.value = newList.length !== 0 ? newList.sort((a, b) => moment(b.createdUtcDate).valueOf() - moment(a.createdUtcDate).valueOf()) : []
  
    return newList
  }

  const getPoDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(`/invoice/submission/${uid}`)
  
    detailPo.value = response.data.result.content
  
    return response.data.result
  }

  const postSubmission = async (data: ParamsSubmissionTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/submission`, data)

    return response.data
  }

  const getAvailableDp = async (poNumber: string, vendorNumber: string, amount: number) => {
    const response: ApiResponse<AvailableDpTypes> = await invoiceApi.get(`/invoice/available-dp?poNumber=${poNumber}&vendorNo=${vendorNumber}&amount=${amount}`)
  
    return response.data
  }

  const getRemainingDp = async (poNumber: string) => {
    const response: ApiResponse<RemainingDpTypes> = await invoiceApi.get(`/invoice/remaining-dp?poNumber=${poNumber}`)
  
    return response.data
  }

  const postSubmissionNonPo = async (data: ParamsSubmissionNonPo) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/submission-non-po`, data)

    return response.data
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
    getPoDetail,
    getAvailableDp,
    getRemainingDp,
    postSubmissionNonPo
  }
})