import { ref } from 'vue'
import { defineStore } from 'pinia'
import invoiceApi from '@/core/utils/invoiceApi'
import type { ApiResponse } from '@/core/type/api'

import type {
  SubmissionStatusTypes,
  DocumentTypes,
  TaxCalculationTypes,
  ParamsSubmissionInitiateTypes,
  ParamsSubmissionTypes
} from './types/submission'

export const useInvoiceSubmissionStore = defineStore('invoiceSubmission', () => {
  const submissionStatus = ref<SubmissionStatusTypes[]>([])
  const documentTypeList = ref<DocumentTypes[]>([])
  const taxCalculationList = ref<TaxCalculationTypes[]>([])

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

  const postSubmissionInitiate = async (data: ParamsSubmissionInitiateTypes) => {
    const response: ApiResponse<TaxCalculationTypes[]> = await invoiceApi.post(`/invoice/submission/initiate`, data)

    return response.data.result
  }

  const postSubmission = async (data: ParamsSubmissionTypes) => {
    const response: ApiResponse<TaxCalculationTypes[]> = await invoiceApi.post(`/invoice/submission/initiate`, data)

    return response.data.result
  }

  return {
    submissionStatus,
    documentTypeList,
    taxCalculationList,
    getSubmissionStatus,
    getDocumentType,
    getTaxCalculation,
    postSubmissionInitiate,
    postSubmission
  }
})