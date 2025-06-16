import { ref } from 'vue'
import { defineStore } from 'pinia'
import vendorApi from '@/core/utils/vendorApi'
import generalApi from '@/core/utils/generalApi'

import type { ApiResponse } from '@/core/type/api'
import type {
  InvoicePoTypes,
  CurrencyTypes,
  CompanyCodeTypes,
  DpTypes,
  DocumentTypes,
  VendorTypes,
  ActivityTypes,
  TaxCodeTypes,
  PaymentMethodTypes,
  ProfitCenterTypes,
  WhtTypes,
  WhtCodeTypes,
  CostCenterTypes
} from './types/invoiceMasterData'

export const useInvoiceMasterDataStore = defineStore('invoiceMasterData', () => {
  const invoicePoType = ref<InvoicePoTypes[]>([])
  const currency = ref<CurrencyTypes[]>([])
  const companyCode = ref<CompanyCodeTypes[]>([])
  const dpType = ref<DpTypes[]>([])
  const documentType = ref<DocumentTypes[]>([])
  const vendorList = ref<VendorTypes[]>([])
  const activityList = ref<ActivityTypes[]>([])
  const taxList = ref<TaxCodeTypes[]>([])
  const paymentMethodList = ref<PaymentMethodTypes[]>([])
  const profilCenterList = ref<ProfitCenterTypes[]>([])
  const whtTypeList = ref<WhtTypes[]>([])
  const whtCodeList = ref<WhtCodeTypes[]>([])
  const costCenterList = ref<CostCenterTypes[]>([])

  const getInvoicePoType = async () => {
    const response: ApiResponse<InvoicePoTypes[]> = await generalApi.get(
      `/lookup/invoice-po-type`,
    )

    invoicePoType.value = response.data.result.content

    return response.data.result
  }

  const getCurrency = async (searchText?: string) => {
    const url = searchText ? `/lookup/currency?searchText=${searchText}` : `/lookup/currency`
    const response: ApiResponse<CurrencyTypes[]> = await generalApi.get(url)

    currency.value = response.data.result.content

    return response.data.result
  }

  const getCompanyCode = async (searchText?: string) => {
    const url = searchText ? `/lookup/company-code?searchText=${searchText}` : `/lookup/company-code`
    const response: ApiResponse<CompanyCodeTypes[]> = await generalApi.get(url)

    companyCode.value = response.data.result.content

    return response.data.result
  }

  const getDpTypes = async () => {
    const response: ApiResponse<DpTypes[]> = await generalApi.get(
      `/lookup/dp-type`,
    )

    dpType.value = response.data.result.content

    return response.data.result
  }

  const getDocumentTypes = async () => {
    const response: ApiResponse<DocumentTypes[]> = await generalApi.get(
      `/lookup/document-type`,
    )

    documentType.value = response.data.result.content

    return response.data.result
  }

  const getVendorList = async () => {
    const response: ApiResponse<VendorTypes[]> = await vendorApi.get(
      `/public/verifiedvendor/lookup/vendor-list`,
    )

    vendorList.value = response.data.result.content

    return response.data.result
  }

  const getActivity = async (companyCode: string, searchText?: string) => {
    const url = searchText ? `/lookup/activity?companyCode=${companyCode}&searchText=${searchText}` : `/lookup/activity?companyCode=${companyCode}`
    const response: ApiResponse<ActivityTypes[]> = await generalApi.get(url)

    activityList.value = response.data.result.content

    return response.data.result
  }

  const getTaxCode = async (searchText?: string) => {
    const url = searchText ? `/lookup/tax-code?searchText=${searchText}` : `/lookup/tax-code`
    const response: ApiResponse<TaxCodeTypes[]> = await generalApi.get(url)

    taxList.value = response.data.result.content

    return response.data.result
  }

  const getPaymentMethod = async (searchText?: string) => {
    const url = searchText ? `/lookup/payment-method?searchText=${searchText}` : `/lookup/payment-method`
    const response: ApiResponse<PaymentMethodTypes[]> = await generalApi.get(url)

    paymentMethodList.value = response.data.result.content

    return response.data.result
  }

  const getProfitCenter = async (searchText?: string) => {
    const url = searchText ? `/lookup/profit-center?searchText=${searchText}` : `/lookup/profit-center`
    const response: ApiResponse<ProfitCenterTypes[]> = await generalApi.get(url)

    profilCenterList.value = response.data.result.content

    return response.data.result
  }

  const getWhtType = async (searchText?: string) => {
    const url = searchText ? `/lookup/wht-type?searchText=${searchText}` : `/lookup/wht-type`
    const response: ApiResponse<WhtTypes[]> = await generalApi.get(url)

    whtTypeList.value = response.data.result.content

    return response.data.result
  }

  const getWhtCode = async (whtType: string, searchText?: string) => {
    const url = searchText ? `/lookup/wht-code?whtType=${whtType}&searchText=${searchText}` : `/lookup/wht-code?whtType=${whtType}`
    const response: ApiResponse<WhtCodeTypes[]> = await generalApi.get(url)

    whtCodeList.value = response.data.result.content

    return response.data.result
  }

  const getCostCenter = async (companyCode: string, profitCenter?: string, searchText?: string) => {
    const url = `/lookup/cost-center`
    const params = {
      companyCode,
      ...(profitCenter !== undefined && profitCenter !== '' && { profitCenter }),
      ...(searchText !== undefined && searchText !== '' && { searchText })
    }
    const response: ApiResponse<CostCenterTypes[]> = await generalApi.get(url, { params })

    costCenterList.value = response.data.result.content

    return response.data.result
  }

  return {
    invoicePoType,
    currency,
    companyCode,
    dpType,
    documentType,
    vendorList,
    activityList,
    taxList,
    paymentMethodList,
    profilCenterList,
    whtTypeList,
    whtCodeList,
    costCenterList,
    getInvoicePoType,
    getCurrency,
    getCompanyCode,
    getDpTypes,
    getDocumentTypes,
    getVendorList,
    getActivity,
    getTaxCode,
    getPaymentMethod,
    getProfitCenter,
    getWhtType,
    getWhtCode,
    getCostCenter
  }
})