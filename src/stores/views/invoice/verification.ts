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
  ParamsRejectTypes,
  ListNonPoTypes,
  PostEditApprovalNonPoTypes
} from './types/verification'

export const useInvoiceVerificationStore = defineStore('invoiceVerification', () => {
  const listPo = ref<ListPoTypes[]>([])
  const listNonPo = ref<ListNonPoTypes[]>([])
  const detailInvoice = ref<ParamsSubmissionTypes>()
  const isFromEdit = ref<boolean>(false)
  const detailInvoiceEdit = ref<DetailInvoiceEditTypes>()
  const additionalCostTempDelete = ref<number[]>([])
  const costExpenseTempDelete = ref<number[]>([])
  const isRejectLoading = ref<boolean>(false)
  const errorMessageSap = ref<string>('')
  const detailNonPoInvoice = ref<ParamsSubmissionTypes>()

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
      department: '',
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
      remainingDpAmount: 0,
      dpAmountDeduction: 0,
      creditCardBillingId: '',
      paymentId: 0,
      bankKey: '',
      bankName: '',
      beneficiaryName: '',
      bankAccountNo: '',
      bankCountryCode: '',
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
      idAlternative: 0,
      name: '',
      name2: '',
      street: '',
      city: '',
      country: '',
      bankAccountNumber: '',
      bankKeyAlternative: '',
      bankCountry: '',
      npwpAlternative: '',
      ktp: '',
      email: '',
      isAlternativePayee: false,
      isOneTimeVendor: false,
      invoicePoGr: [],
      additionalCosts: [],
      costExpenses: [],
      invoiceDocument: null,
      tax: null,
      referenceDocument: null,
      otherDocument: null,
    }
  }

  const getListPo = async (data: QueryParamsListPoTypes) => {
    listPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null,
    }
    const response: ApiResponse<ListPoTypes[]> = await invoiceApi.get(`/invoice/approval`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query,
      },
    })

    listPo.value =
      response.data.result.content.length !== 0
        ? response.data.result.content.sort(
            (a, b) => moment(b.invoiceDate).valueOf() - moment(a.invoiceDate).valueOf(),
          )
        : []

    return response.data.result.content
  }

  const getListNonPo = async (data: QueryParamsListPoTypes) => {
    listNonPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null,
    }
    const response: ApiResponse<ListNonPoTypes[]> = await invoiceApi.get(`/invoice/approval/non-po`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query,
      },
    })
    listNonPo.value =
      response.data.result.content.length !== 0
        ? response.data.result.content.sort(
            (a, b) => moment(b.invoiceDate).valueOf() - moment(a.invoiceDate).valueOf(),
          )
        : []

    return response.data.result.content
  }

  const getListVerifNonPo = async (data: QueryParamsListPoTypes) => {
    listNonPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null,
    }
    const response: ApiResponse<ListNonPoTypes[]> = await invoiceApi.get(`/invoice/verification/non-po`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query,
      },
    })
    listNonPo.value =
      response.data.result.content.length !== 0
        ? response.data.result.content.sort(
            (a, b) => moment(b.invoiceDate).valueOf() - moment(a.invoiceDate).valueOf(),
          )
        : []

    return response.data.result.content
  }

  const getInvoiceDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(
      `/invoice/approval/${uid}`,
    )

    detailInvoice.value = response.data.result.content

    return response.data.result
  }

  const getInvoiceNonPoDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(
      `/invoice/submission-non-po/${uid}`,
    )

    detailNonPoInvoice.value = response.data.result.content

    return response.data.result
  }

  const postSubmission = async (data: PostVerificationTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/approval`, data)

    return response.data
  }

  const postSubmissionNonPo = async (data: PostVerificationTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/approval-non-po`, data)

    return response.data
  }

  const postReject = async (data: ParamsRejectTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/reject`, data)

    return response.data
  }

  const postRejectNonPo = async (data: ParamsRejectTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/reject-non-po`, data)

    return response.data
  }

  const postSap = async (invoiceUId: string) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/sap/${invoiceUId}`)
    errorMessageSap.value = response.data.result.message

    return response.data.statusCode
  }

  const postSapNonPo = async (invoiceUId: string) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/sap/non-po/${invoiceUId}`)
    errorMessageSap.value = response.data.result.message

    return response.data.statusCode
  }

  const putSubmission = async (data: PostVerificationTypes) => {
    const response: ApiResponse<void> = await invoiceApi.put(`/invoice/approval`, data)

    return response.data.result
  }

  const putSubmissionNonPo = async (data: PostEditApprovalNonPoTypes) => {
    const response: ApiResponse<void> = await invoiceApi.put(`/invoice/edit-non-po`, data)

    return response.data.result
  }

  const putEditInvoice = async (data: PostVerificationTypes) => {
    const response: ApiResponse<void> = await invoiceApi.put(`/invoice/edit`, data)

    return response.data.result
  }

  const deleteAdditionalCost = async (invoiceUid: string, additionaCostId: number) => {
    const response: ApiResponse<void> = await invoiceApi.delete(
      `/invoice/${invoiceUid}/additional-cost/${additionaCostId}`,
    )

    return response.data.result
  }

  const deleteCostExpense = async (invoiceUid: string, costExpensesId: number) => {
    const response: ApiResponse<void> = await invoiceApi.delete(
      `/invoice/${invoiceUid}/cost-expenses/${costExpensesId}`,
    )

    return response.data.result
  }

  const verifyInvoiceNonPo = async (invoiceUid: string) => {
    const response: ApiResponse<void> = await invoiceApi.post(
      `/invoice/non-po/verificator/${invoiceUid}`,
    )
    return response.data
  }

  return {
    listPo,
    listNonPo,
    detailInvoice,
    isFromEdit,
    detailInvoiceEdit,
    additionalCostTempDelete,
    costExpenseTempDelete,
    isRejectLoading,
    errorMessageSap,
    detailNonPoInvoice,
    resetDetailInvoiceEdit,
    postSubmission,
    postSubmissionNonPo,
    getListPo,
    getListNonPo,
    getListVerifNonPo,
    getInvoiceDetail,
    postReject,
    postRejectNonPo,
    postSap,
    postSapNonPo,
    putSubmission,
    deleteAdditionalCost,
    deleteCostExpense,
    getInvoiceNonPoDetail,
    verifyInvoiceNonPo,
    putEditInvoice,
    putSubmissionNonPo,
  }
})
