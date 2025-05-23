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
  TaxCodeTypes
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

  const getActivity = async (searchText?: string) => {
    const url = searchText ? `/lookup/activity?searchText=${searchText}` : `/lookup/activity`
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

  return {
    invoicePoType,
    currency,
    companyCode,
    dpType,
    documentType,
    vendorList,
    activityList,
    taxList,
    getInvoicePoType,
    getCurrency,
    getCompanyCode,
    getDpTypes,
    getDocumentTypes,
    getVendorList,
    getActivity,
    getTaxCode
  }
})