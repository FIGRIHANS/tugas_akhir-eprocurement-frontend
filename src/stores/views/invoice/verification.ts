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

  const resetDetailInvoiceEdit = () => {
    detailInvoiceEdit.value = {
      invoiceUId: '',
      invoiceTypeCode: 0,
      invoiceTypeName: '',
      invoiceDPCode: 0,
      invoiceDPName: '',
      companyCode: '',
      companyName: '',
      invoiceNo: '',
      documentNo: '',
      invoiceDate: '',
      taxNo: '',
      currCode: '',
      notes: '',
      statusCode: 0,
      statusName: '',
      postingDate: '',
      invoicingParty: '',
      estimatedPaymentDate: '',
      paymentMethodCode: '',
      paymentMethodName: '',
      assigment: '',
      transferNews: '',
      npwpReporting: '',
      bankKey: '',
      bankName: '',
      beneficiaryName: '',
      bankAccountNo: '',
      vendorId: '',
      vendorName: '',
      npwp: '',
      vendorAddress: '',
      subtotal: 0,
      vatAmount: 0,
      whtAmount: 0,
      additionalCost: 0,
      totalGrossAmount: 0,
      totalNetAmount: 0,
      invoicePoGr: [],
      additionalCosts: [],
      invoiceDocument: null,
      tax: null,
      referenceDocument: null,
      otherDocument: null
    }
  }

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

  const postSap = async (invoiceUId: string) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/sap/${invoiceUId}`)

    return response.data.statusCode
  }

  return {
    listPo,
    detailInvoice,
    isFromEdit,
    detailInvoiceEdit,
    isRejectLoading,
    resetDetailInvoiceEdit,
    postSubmission,
    getListPo,
    getInvoiceDetail,
    postReject,
    postSap
  }
})