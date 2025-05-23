import { ref } from 'vue'
import { defineStore } from 'pinia'
import vendorApi from '@/core/utils/vendorApi'
import vendorManagementApi from '@/core/utils/vendorManagementApi'

import type { ApiResponse } from '@/core/type/api'
import type {
  InvoicePoTypes,
  CurrencyTypes,
  CompanyCodeTypes,
  DpTypes,
  DocumentTypes,
  VendorTypes
} from './types/invoiceMasterData'

export const useInvoiceMasterDataStore = defineStore('invoiceMasterData', () => {
  const invoicePoType = ref<InvoicePoTypes[]>([])
  const currency = ref<CurrencyTypes[]>([])
  const companyCode = ref<CompanyCodeTypes[]>([])
  const dpType = ref<DpTypes[]>([])
  const documentType = ref<DocumentTypes[]>([])
  const vendorList = ref<VendorTypes[]>([])

  const getInvoicePoType = async () => {
    const response: ApiResponse<InvoicePoTypes[]> = await vendorApi.get(
      `/lookup/invoice-po-type`,
    )

    invoicePoType.value = response.data.result.content

    return response.data.result
  }

  const getCurrency = async (searchText?: string) => {
    const url = searchText ? `/lookup/currency?searchText=${searchText}` : `/lookup/currency`
    const response: ApiResponse<CurrencyTypes[]> = await vendorApi.get(url)

    currency.value = response.data.result.content

    return response.data.result
  }

  const getCompanyCode = async (searchText?: string) => {
    const url = searchText ? `/lookup/company-code?searchText=${searchText}` : `/lookup/company-code`
    const response: ApiResponse<CompanyCodeTypes[]> = await vendorApi.get(url)

    companyCode.value = response.data.result.content

    return response.data.result
  }

  const getDpTypes = async () => {
    const response: ApiResponse<DpTypes[]> = await vendorApi.get(
      `/lookup/dp-type`,
    )

    dpType.value = response.data.result.content

    return response.data.result
  }

  const getDocumentTypes = async () => {
    const response: ApiResponse<DocumentTypes[]> = await vendorApi.get(
      `/lookup/document-type`,
    )

    documentType.value = response.data.result.content

    return response.data.result
  }

  const getVendorList = async () => {
    const response: ApiResponse<VendorTypes[]> = await vendorManagementApi.get(
      `/public/verifiedvendor/lookup/vendor-list`,
    )

    vendorList.value = response.data.result.content

    return response.data.result
  }

  return {
    invoicePoType,
    currency,
    companyCode,
    dpType,
    documentType,
    vendorList,
    getInvoicePoType,
    getCurrency,
    getCompanyCode,
    getDpTypes,
    getDocumentTypes,
    getVendorList
  }
})