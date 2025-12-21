import { ref } from 'vue'
import { defineStore } from 'pinia'
import invoiceApi from '@/core/utils/invoiceApi'
import moment from 'moment'

import type { ApiResponse, ApiResponseData } from '@/core/type/api'
import type {
  SubmissionStatusTypes,
  DocumentTypes,
  TaxCalculationTypes,
  ParamsSubmissionTypes,
  PoGrItemTypes,
  ListPoTypes,
  ListNonPoTypes,
  QueryParamsListPoTypes,
  AvailableDpTypes,
  RemainingDpTypes,
  ParamsSubmissionNonPo,
  ParamsCheckBudgetType,
  ResponseCheckBudgetTypes,
} from './types/submission'

import type { CasNoTypes } from '@/stores/master-data/types/invoiceMasterData'

export const useInvoiceSubmissionStore = defineStore('invoiceSubmission', () => {
  const submissionStatus = ref<SubmissionStatusTypes[]>([])
  const documentTypeList = ref<DocumentTypes[]>([])
  const taxCalculationList = ref<TaxCalculationTypes[]>([])
  const poGrList = ref<PoGrItemTypes[]>([])
  const listPo = ref<ListPoTypes[]>([])
  const listNonPo = ref<ListNonPoTypes[]>()
  const detailPo = ref<ParamsSubmissionTypes>()
  const detailNonPo = ref<ParamsSubmissionTypes>()
  const responseCheckBudget = ref<ResponseCheckBudgetTypes>()
  const errorMessageSubmission = ref<string>('')
  const casNoCode = ref<CasNoTypes[]>([])

  const getSubmissionStatus = async () => {
    const response: ApiResponse<SubmissionStatusTypes[]> = await invoiceApi.get(
      `/lookup/invoice/submission/status`,
    )

    submissionStatus.value = response.data.result.content

    return response.data.result
  }

  const getDocumentType = async () => {
    const response: ApiResponse<DocumentTypes[]> = await invoiceApi.get(`/lookup/document-type`)

    documentTypeList.value = response.data.result.content

    return response.data.result
  }

  const getTaxCalculation = async () => {
    const response: ApiResponse<TaxCalculationTypes[]> =
      await invoiceApi.get(`/lookup/tax-calculation`)

    taxCalculationList.value = response.data.result.content

    return response.data.result
  }

  const getPoGr = async (poNumber: string, companyCode: string, vendorCode: string) => {
    const response: ApiResponse<PoGrItemTypes[]> = await invoiceApi.get(
      `/invoice/po-gr?poNumber=${poNumber}&companyCode=${companyCode}&vendorCode=${vendorCode}`,
    )

    poGrList.value = response.data.result.content

    return response.data.result
  }

  const getListPo = async (data: QueryParamsListPoTypes) => {
    listPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null,
    }
    const response: ApiResponse<ListPoTypes[]> = await invoiceApi.get(`/invoice/submission`, {
      params: {
        ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
        ...query,
      },
    })

    const newList = !response.data.result.content
      ? []
      : response.data.result.content.map((item) => {
          return {
            ...item,
            isOpenChild: false,
          }
        })

    listPo.value =
      newList.length !== 0
        ? newList.sort(
            (a, b) => moment(b.createdUtcDate).valueOf() - moment(a.createdUtcDate).valueOf(),
          )
        : []

    return newList
  }

  const getPoDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(
      `/invoice/submission/${uid}`,
    )

    detailPo.value = response.data.result.content

    return response.data.result
  }

  const getNonPoDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(
      `/invoice/submission-non-po/${uid}`,
    )

    detailNonPo.value = response.data.result.content

    return response.data.result
  }

  const postSubmission = async (data: ParamsSubmissionTypes) => {
    const requestBody = {
      ...data,
      vendor: {
        ...data.vendor,
        vendorId: data.vendor.vendorId ? Number(data.vendor.vendorId) : 0,
      },
    }

    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/submission`, requestBody)

    return response.data
  }

  const getAvailableDp = async (poNumber: string, vendorNumber: string, amount: number) => {
    const response: ApiResponse<AvailableDpTypes> = await invoiceApi.get(
      `/invoice/available-dp?poNumber=${poNumber}&vendorNo=${vendorNumber}&amount=${amount}`,
    )

    return response.data
  }

  const getRemainingDp = async (poNumber: string) => {
    const response: ApiResponse<RemainingDpTypes> = await invoiceApi.get(
      `/invoice/remaining-dp?poNumber=${poNumber}`,
    )

    return response.data
  }

  const postSubmissionNonPo = async (data: ParamsSubmissionNonPo) => {
    const requestBody = {
      ...data,
      vendor: {
        ...data.vendor,
        vendorId: data.vendor.vendorId ? Number(data.vendor.vendorId) : 0,
      },
    }

    const response: ApiResponse<void> = await invoiceApi.post(
      `/invoice/submission-non-po`,
      requestBody,
    )

    return response.data
  }

  const getCasNo = async (vendorId: string, companyCode: string) => {
    try {
      const requestBody = {
        REQUEST: {
          SUPPLIER_FROM_PORTAL: vendorId,
          COMPANY_CODE: companyCode,
        },
      }

      const response = await invoiceApi.post<{
        response: CasNoTypes[]
        zMessage?: {
          TYPE: string
          ID: string
          NUMBER: number
          MESSAGE: string
        }
      }>('/invoice/invoice/check-cas', requestBody, {
        validateStatus: (status) => {
          return status === 200 || status === 422
        },
      })

      if (response.data.zMessage && response.data.zMessage.TYPE === 'E') {
        casNoCode.value = []
        return []
      }

      const mappedData = (response.data.response || []).filter(
        (item) => item.casNo && item.casNo.trim() !== '',
      )
      casNoCode.value = mappedData
      return mappedData
    } catch (error) {
      console.error('getCasNo Error:', error)
      casNoCode.value = []
      return []
    }
  }

  const getListNonPo = async (data: QueryParamsListPoTypes) => {
    listNonPo.value = []
    const query = {
      companyCode: data.companyCode || null,
      invoiceTypeCode: Number(data.invoiceTypeCode) || null,
      invoiceDate: data.invoiceDate || null,
      searchText: data.searchText || null,
    }
    const response: ApiResponse<ListPoTypes[]> = await invoiceApi.get(
      `/invoice/submission/non-po`,
      {
        params: {
          ...(data.statusCode !== null ? { statuscode: Number(data.statusCode) } : {}),
          ...query,
        },
      },
    )

    const newList = !response.data.result.content
      ? []
      : response.data.result.content.map((item) => {
          return {
            ...item,
            isOpenChild: false,
          }
        })
    listNonPo.value =
      newList.length !== 0
        ? newList.sort(
            (a, b) => moment(b.createdUtcDate).valueOf() - moment(a.createdUtcDate).valueOf(),
          )
        : []

    return newList
  }

  const postCheckBudget = async (data: ParamsCheckBudgetType) => {
    try {
      const response: ApiResponse<ResponseCheckBudgetTypes> = await invoiceApi.post(
        `/invoice/invoice/check-budget`,
        data,
      )

      if (response?.data?.result?.content) {
        responseCheckBudget.value = response.data.result.content
      } else {
        responseCheckBudget.value = {} as ResponseCheckBudgetTypes
      }

      return response.data
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number
          data?: ApiResponseData<ResponseCheckBudgetTypes>
        }
        message?: string
      }

      const errorData = axiosErr.response?.data

      if (errorData) {
        if (errorData.result?.content) {
          responseCheckBudget.value = errorData.result.content
        }
        return errorData
      }

      throw new Error(`Budget check failed: ${axiosErr.message || 'Unknown error'}`)
    }
  }
  const syncInvoicFromEmail = async () => {
    const payload = {
      isActive: false,
    }

    const response: ApiResponse<void> = await invoiceApi.post(
      `/invoice/submission-invoice-email`,
      payload,
    )

    return response.data
  }

  return {
    submissionStatus,
    documentTypeList,
    taxCalculationList,
    poGrList,
    listPo,
    detailPo,
    detailNonPo,
    listNonPo,
    responseCheckBudget,
    errorMessageSubmission,
    casNoCode,
    getSubmissionStatus,
    getDocumentType,
    getTaxCalculation,
    getPoGr,
    postSubmission,
    getListPo,
    getPoDetail,
    getNonPoDetail,
    getAvailableDp,
    getRemainingDp,
    getListNonPo,
    postSubmissionNonPo,
    getCasNo,
    postCheckBudget,
    syncInvoicFromEmail,
  }
})
