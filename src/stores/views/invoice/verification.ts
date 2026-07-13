import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import invoiceApi from '@/core/utils/invoiceApi'
import moment from 'moment'
import { getOcrApiUrlCandidatesAsync } from '@/composables/documentPreview'
import { normalizeTaxFakturScanResult } from '@/core/utils/taxFakturVendor'
import {
  applyPageWindow,
  extractInvoiceApiResultContent,
  parsePaginatedListResponse,
} from '@/core/utils/paginatedResponse'

import type { ApiResponse } from '@/core/type/api'
import type {
  ParamsSubmissionTypes,
  ListPoTypes,
  QueryParamsListPoTypes,
  DetailInvoiceEditTypes,
  PostVerificationTypes,
  ParamsRejectTypes,
  ListNonPoTypes,
  PostEditApprovalNonPoTypes,
  ParamsPph21Types,
  SapStatusParams,
  SapStatusResponse,
  UpdatePaymentStatusRequest,
  UpdatePaymentStatusResponse,
  SyncManualPayload,
  SyncManualResult,
  ResponsePph21Types,
} from './types/verification'
import type { invoiceOcrData } from '@/views/invoice/types/invoiceOcrData'
import type { invoiceQrData } from '@/views/invoice/types/invoiceQrdata'

const PAYMENT_STATUS_ENDPOINT = '/invoice/payment-status'
const PAYMENT_STATUS_NON_PO_ENDPOINT = '/invoice/payment-status-non-po'
const FINANCE_LIST_UI_PAGE_SIZE = 10
/** Fetch full matching dataset in one request (FTP-style); UI shows 10 rows per page via client windowing. */
const FINANCE_LIST_FETCH_ALL_SIZE = 1000
const REJECTED_STATUS_CODE = 5

interface FinanceListCacheEntry<T> {
  key: string
  items: T[]
  total: number
}

interface InvoiceWorkflowStep {
  profileId: number
  stateCode: number
  stateName: string
  profileName?: string
  category?: string
  step?: number
  actioner?: number
  actionerDate?: string
  actionerName?: string
}

interface FinanceListDetailContext {
  headerStatusCode: number | null
  workflow: InvoiceWorkflowStep[]
}

type OcrDocumentRef = string | { path?: string; previewPath?: string }

const toDocumentRef = (data: OcrDocumentRef): { path?: string; previewPath?: string } =>
  typeof data === 'string' ? { path: data, previewPath: data } : data

const postWithDocumentCandidates = async <T>(endpoint: string, data: OcrDocumentRef): Promise<T> => {
  const candidates = await getOcrApiUrlCandidatesAsync(toDocumentRef(data))
  if (!candidates.length) {
    throw new Error('Document URL is required for OCR')
  }

  let lastError: unknown
  for (const documentUrl of candidates) {
    try {
      const response: ApiResponse<T> = await invoiceApi.post(endpoint, { documentUrl })
      return normalizeTaxFakturScanResult(
        response.data.result.content as T & Record<string, unknown>,
      ) as T
    } catch (error) {
      lastError = error
      if (!isAxiosError(error) || error.response?.status !== 400) throw error
    }
  }

  throw lastError
}

const normalizeFinanceListItem = <T extends ListPoTypes | ListNonPoTypes>(item: T): T => {
  const raw = item as T & Record<string, unknown>

  return {
    ...item,
    invoiceUId: String(item.invoiceUId ?? raw.InvoiceUId ?? ''),
    statusCode: Number(item.statusCode ?? raw.StatusCode ?? 0),
    statusName: String(item.statusName ?? raw.StatusName ?? ''),
    pOs: item.pOs ?? [],
    isOpenChild: item.isOpenChild ?? false,
  }
}

const mapListItemDefaults = <T extends ListPoTypes | ListNonPoTypes>(item: T): T =>
  normalizeFinanceListItem({
    ...item,
    pOs: item.pOs ?? [],
    isOpenChild: item.isOpenChild ?? false,
  })

export const useInvoiceVerificationStore = defineStore('invoiceVerification', () => {
  const listPo = ref<ListPoTypes[]>([])
  const listNonPo = ref<ListNonPoTypes[]>([])
  const listPoTotal = ref(0)
  const listNonPoTotal = ref(0)
  const listPoCache = ref<FinanceListCacheEntry<ListPoTypes> | null>(null)
  const listNonPoCache = ref<FinanceListCacheEntry<ListNonPoTypes> | null>(null)
  const isListPoLoading = ref(false)
  const isListNonPoLoading = ref(false)
  const invoiceDetailContextCache = ref(new Map<string, FinanceListDetailContext>())
  const detailInvoice = ref<ParamsSubmissionTypes>()
  const isFromEdit = ref<boolean>(false)
  const detailInvoiceEdit = ref<DetailInvoiceEditTypes>()
  const additionalCostTempDelete = ref<number[]>([])
  const costExpenseTempDelete = ref<number[]>([])
  const isRejectLoading = ref<boolean>(false)
  const errorMessageSap = ref<string>('')
  const detailNonPoInvoice = ref<ParamsSubmissionTypes>()

  const normalizeWorkflowSteps = (raw: unknown): InvoiceWorkflowStep[] => {
    if (!Array.isArray(raw)) return []

    return raw.map((step) => {
      const row = step as Record<string, unknown>
      return {
        profileId: Number(row.profileId ?? row.ProfileId ?? 0),
        stateCode: Number(row.stateCode ?? row.StateCode ?? 0),
        stateName: String(row.stateName ?? row.StateName ?? ''),
        profileName: String(row.profileName ?? row.ProfileName ?? ''),
        category: String(row.category ?? row.Category ?? ''),
        step: Number(row.step ?? row.Step ?? 0),
        actioner: Number(row.actioner ?? row.Actioner ?? 0),
        actionerDate: String(row.actionerDate ?? row.ActionerDate ?? ''),
        actionerName: String(row.actionerName ?? row.ActionerName ?? ''),
      }
    })
  }

  const parseDetailContext = (content?: ParamsSubmissionTypes | Record<string, unknown>): FinanceListDetailContext => {
    if (!content || typeof content !== 'object') {
      return { headerStatusCode: null, workflow: [] }
    }

    const raw = content as Record<string, unknown>
    const header = (raw.header ?? raw.Header) as Record<string, unknown> | undefined

    return {
      headerStatusCode:
        header?.statusCode != null || header?.StatusCode != null
          ? Number(header.statusCode ?? header.StatusCode)
          : null,
      workflow: normalizeWorkflowSteps(raw.workflow ?? raw.Workflow),
    }
  }

  const cacheDetailContext = (invoiceUId: string, context: FinanceListDetailContext) => {
    if (!invoiceUId) return
    invoiceDetailContextCache.value.set(invoiceUId, context)
  }

  const fetchDetailContextFromEndpoints = async (
    invoiceUId: string,
    endpoints: string[],
  ): Promise<FinanceListDetailContext> => {
    let lastContext: FinanceListDetailContext = { headerStatusCode: null, workflow: [] }

    for (const endpoint of endpoints) {
      try {
        const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(endpoint)
        const context = parseDetailContext(response?.data?.result?.content)
        lastContext = context

        if (context.workflow.length > 0 || context.headerStatusCode != null) {
          return context
        }
      } catch {
        // Try the next detail endpoint.
      }
    }

    return lastContext
  }

  const fetchPoDetailContext = async (
    invoiceUId: string,
  ): Promise<FinanceListDetailContext> => {
    const normalizedId = String(invoiceUId ?? '').trim()
    if (!normalizedId) return { headerStatusCode: null, workflow: [] }

    const cached = invoiceDetailContextCache.value.get(normalizedId)
    if (cached?.workflow?.length) return cached

    const context = await fetchDetailContextFromEndpoints(normalizedId, [
      `/invoice/submission/${normalizedId}`,
      `/invoice/approval/${normalizedId}`,
    ])
    cacheDetailContext(normalizedId, context)
    return context
  }

  const fetchNonPoDetailContext = async (
    invoiceUId: string,
  ): Promise<FinanceListDetailContext> => {
    const normalizedId = String(invoiceUId ?? '').trim()
    if (!normalizedId) return { headerStatusCode: null, workflow: [] }

    const cached = invoiceDetailContextCache.value.get(normalizedId)
    if (cached?.workflow?.length) return cached

    const context = await fetchDetailContextFromEndpoints(normalizedId, [
      `/invoice/submission-non-po/${normalizedId}`,
    ])
    cacheDetailContext(normalizedId, context)
    return context
  }

  const resolveFinanceListItems = async <T extends (ListPoTypes | ListNonPoTypes) & { invoiceUId: string }>(
    items: T[],
    filterStatusCode: number | null | undefined,
    fetchDetailContext: (invoiceUId: string) => Promise<FinanceListDetailContext>,
    onProgress: (items: T[]) => void,
  ): Promise<T[]> => {
    try {
      const { enrichFinanceListItemsWithHeaderStatus } = await import('@/composables/useInvoiceWorkflow')
      return await enrichFinanceListItemsWithHeaderStatus(
        items,
        filterStatusCode,
        fetchDetailContext,
        {
          priorityStart: 0,
          priorityCount: items.length,
          onProgress,
        },
      )
    } catch (enrichErr) {
      console.error('resolveFinanceListItems - enrich unavailable:', enrichErr)
      return items
    }
  }

  const buildListQueryParams = (
    data: QueryParamsListPoTypes,
    options?: { page?: number; pageSize?: number },
  ) => ({
    page: options?.page ?? data.page ?? 1,
    pageSize: options?.pageSize ?? data.pageSize ?? FINANCE_LIST_UI_PAGE_SIZE,
    companyCode: data.companyCode || null,
    invoiceTypeCode: Number(data.invoiceTypeCode) || null,
    invoiceDate: data.invoiceDate || null,
    searchText: data.searchText || null,
    ...(data.statusCode != null ? { statuscode: Number(data.statusCode) } : {}),
  })

  const buildListCacheKey = (endpoint: string, data: QueryParamsListPoTypes) =>
    JSON.stringify({
      endpoint,
      statusCode: data.statusCode ?? null,
      companyCode: data.companyCode ?? '',
      invoiceDate: data.invoiceDate ?? '',
      searchText: data.searchText ?? '',
      invoiceTypeCode: data.invoiceTypeCode ?? null,
    })

  const loadFinanceListPage = async <T extends ListPoTypes | ListNonPoTypes>(options: {
    endpoint: string
    data: QueryParamsListPoTypes
    cache: { value: FinanceListCacheEntry<T> | null }
    setLoading: (value: boolean) => void
    setList: (items: T[]) => void
    setTotal: (total: number) => void
    mapItem: (item: T) => T
    fetchDetailContext: (invoiceUId: string) => Promise<FinanceListDetailContext>
    logLabel: string
  }): Promise<T[]> => {
    const page = options.data.page ?? 1
    const displayPageSize = options.data.pageSize ?? FINANCE_LIST_UI_PAGE_SIZE
    const cacheKey = buildListCacheKey(options.endpoint, options.data)
    const needsFetch = !options.cache.value || options.cache.value.key !== cacheKey

    if (needsFetch) {
      options.setLoading(true)
      options.setList([])
    }

    try {
      if (needsFetch) {
        const response: ApiResponse<unknown> = await invoiceApi.get(options.endpoint, {
          params: buildListQueryParams(options.data, {
            page: 1,
            pageSize: FINANCE_LIST_FETCH_ALL_SIZE,
          }),
        })

        const parsed = parsePaginatedListResponse<T>(
          resolveListContent(response),
          1,
          FINANCE_LIST_FETCH_ALL_SIZE,
        )
        let resultArray = parsed.items.map((item) => options.mapItem(item))
        const resolvedTotal = Math.max(parsed.total, resultArray.length)

        try {
          resultArray = await resolveFinanceListItems(
            resultArray,
            options.data.statusCode,
            options.fetchDetailContext,
            () => undefined,
          )
        } catch (enrichErr) {
          console.error(`${options.logLabel} - enrich error:`, enrichErr)
        }

        let finalItems = resultArray
        let finalTotal = Math.max(resolvedTotal, resultArray.length)

        if (Number(options.data.statusCode) === 3) {
          try {
            const { filterVerificationVerifiedListItems } = await import(
              '@/composables/useInvoiceWorkflow'
            )
            finalItems = filterVerificationVerifiedListItems(resultArray)
            finalTotal = finalItems.length
          } catch (filterErr) {
            console.error(`${options.logLabel} - verified filter error:`, filterErr)
          }
        }

        options.cache.value = {
          key: cacheKey,
          items: finalItems,
          total: finalTotal,
        }
      }

      const cached = options.cache.value
      if (!cached) {
        options.setList([])
        options.setTotal(0)
        return []
      }

      const { items, total } = applyPageWindow(cached.items, cached.total, page, displayPageSize)
      options.setTotal(total)
      options.setList(items)
      return items
    } catch (err) {
      console.error(`${options.logLabel} - error:`, err)
      options.cache.value = null
      options.setList([])
      options.setTotal(0)
      return []
    } finally {
      if (needsFetch) {
        options.setLoading(false)
      }
    }
  }

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
      casDateReceipt: '',
      proposalAmount: 0,
      picFinance: '',
      cashJournalCode: '',
      cashJournalName: '',
      pettyCashStartDate: '',
      pettyCashEndDate: '',
      npwpReportingName: '',
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

  const resolveListContent = (response: ApiResponse<unknown>) =>
    response?.data?.result?.content ?? extractInvoiceApiResultContent(response)

  const getListPo = async (data: QueryParamsListPoTypes) =>
    loadFinanceListPage<ListPoTypes>({
      endpoint: '/invoice/approval',
      data,
      cache: listPoCache,
      setLoading: (value) => {
        isListPoLoading.value = value
      },
      setList: (items) => {
        listPo.value = items
      },
      setTotal: (total) => {
        listPoTotal.value = total
      },
      mapItem: mapListItemDefaults,
      fetchDetailContext: fetchPoDetailContext,
      logLabel: 'getListPo',
    })

  const getListNonPo = async (data: QueryParamsListPoTypes) =>
    loadFinanceListPage<ListNonPoTypes>({
      endpoint: '/invoice/approval/non-po',
      data,
      cache: listNonPoCache,
      setLoading: (value) => {
        isListNonPoLoading.value = value
      },
      setList: (items) => {
        listNonPo.value = items
      },
      setTotal: (total) => {
        listNonPoTotal.value = total
      },
      mapItem: mapListItemDefaults,
      fetchDetailContext: fetchNonPoDetailContext,
      logLabel: 'getListNonPo',
    })

  const getListVerifNonPo = async (data: QueryParamsListPoTypes) =>
    loadFinanceListPage<ListNonPoTypes>({
      endpoint: '/invoice/verification/non-po',
      data,
      cache: listNonPoCache,
      setLoading: (value) => {
        isListNonPoLoading.value = value
      },
      setList: (items) => {
        listNonPo.value = items
      },
      setTotal: (total) => {
        listNonPoTotal.value = total
      },
      mapItem: mapListItemDefaults,
      fetchDetailContext: fetchNonPoDetailContext,
      logLabel: 'getListVerifNonPo',
    })

  const getInvoiceDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(
      `/invoice/approval/${uid}`,
    )

    detailInvoice.value = response.data.result.content
    const invoiceUId = response.data.result.content?.header?.invoiceUId
    if (invoiceUId) {
      cacheDetailContext(invoiceUId, parseDetailContext(response.data.result.content))
    }

    return response.data.result
  }

  const getInvoiceNonPoDetail = async (uid: string) => {
    const response: ApiResponse<ParamsSubmissionTypes> = await invoiceApi.get(
      `/invoice/submission-non-po/${uid}`,
    )

    detailNonPoInvoice.value = response.data.result.content
    const invoiceUId = response.data.result.content?.header?.invoiceUId
    if (invoiceUId) {
      cacheDetailContext(invoiceUId, parseDetailContext(response.data.result.content))
    }

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
    const cached = invoiceDetailContextCache.value.get(data.invoiceUId)
    cacheDetailContext(data.invoiceUId, {
      headerStatusCode: REJECTED_STATUS_CODE,
      workflow: cached?.workflow ?? [],
    })

    return response.data
  }

  const postRejectNonPo = async (data: ParamsRejectTypes) => {
    const response: ApiResponse<void> = await invoiceApi.post(`/invoice/reject-non-po`, data)
    const cached = invoiceDetailContextCache.value.get(data.invoiceUId)
    cacheDetailContext(data.invoiceUId, {
      headerStatusCode: REJECTED_STATUS_CODE,
      workflow: cached?.workflow ?? [],
    })

    return response.data
  }

  const postSap = async (invoiceUId: string) => {
    try {
      const response: ApiResponse<void> = await invoiceApi.post(`/invoice/sap/${invoiceUId}`)
      errorMessageSap.value = response.data.result.message

      return response.data.statusCode
    } catch (error: unknown) {
      const err = error as { response?: { data?: { result?: { message?: string }; message?: string } } }
      errorMessageSap.value =
        err.response?.data?.result?.message ||
        err.response?.data?.message ||
        'Failed to send invoice to SAP.'
      throw error
    }
  }

  const postSapNonPo = async (invoiceUId: string) => {
    try {
      const response: ApiResponse<void> = await invoiceApi.post(
        `/invoice/sap/non-po/${invoiceUId}`,
      )
      errorMessageSap.value = response.data.result.message

      return response.data.statusCode
    } catch (error: unknown) {
      const err = error as { response?: { data?: { result?: { message?: string }; message?: string } } }
      errorMessageSap.value =
        err.response?.data?.result?.message ||
        err.response?.data?.message ||
        'Failed to send invoice to SAP.'
      throw error
    }
  }

  const putSubmission = async (data: PostVerificationTypes) => {
    const response: ApiResponse<void> = await invoiceApi.put(`/invoice/approval`, data)

    return response.data
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

  const getpph21 = async (payload: ParamsPph21Types) => {
    const response: ApiResponse<ResponsePph21Types> = await invoiceApi.get(`/invoice/pph21`, {
      params: {
        ...payload,
      },
    })
    return response.data
  }

  const uploadFileQr = async (data: OcrDocumentRef) =>
    postWithDocumentCandidates<invoiceQrData>('/ocr/invoice/scan-qr-from-blob', data)

  const uploadFileOcr = async (data: OcrDocumentRef) =>
    postWithDocumentCandidates<invoiceOcrData>('/ocr/read-text-from-blob', data)

  const getSapStatus = async (params: SapStatusParams) => {
    const response: ApiResponse<SapStatusResponse> = await invoiceApi.get(`/invoice/status-sap`, {
      params: {
        fiscalYear: params.fiscalYear,
        companyCode: params.companyCode,
        DocumentNumber: params.documentNumber,
      },
    })
    return response.data
  }

  const updatePaymentStatus = async (data: UpdatePaymentStatusRequest) => {
    const response: ApiResponse<UpdatePaymentStatusResponse> = await invoiceApi.post(
      PAYMENT_STATUS_ENDPOINT,
      data,
    )
    return response.data
  }

  const getPaymentStatus = async (invoiceUId: string) => {
    const response: ApiResponse<UpdatePaymentStatusResponse> = await invoiceApi.get(
      `${PAYMENT_STATUS_ENDPOINT}/${invoiceUId}`,
    )
    return response.data
  }

  const updatePaymentStatusNonPo = async (data: UpdatePaymentStatusRequest) => {
    const response: ApiResponse<UpdatePaymentStatusResponse> = await invoiceApi.post(
      PAYMENT_STATUS_NON_PO_ENDPOINT,
      data,
    )
    return response.data
  }

  const getPaymentStatusNonPo = async (invoiceUId: string) => {
    // NOTE: Non-PO uses the same GET endpoint as PO for fetching payment status
    const response: ApiResponse<UpdatePaymentStatusResponse> = await invoiceApi.get(
      `${PAYMENT_STATUS_ENDPOINT}/${invoiceUId}`,
    )
    return response.data
  }

  const sync = async (data: SyncManualPayload): Promise<SyncManualResult> => {
    const response: any = await invoiceApi.post(`/TaxSync/sync-pjap`, data)
    return response.data?.result?.content
  }

  return {
    listPo,
    listNonPo,
    listPoTotal,
    listNonPoTotal,
    isListPoLoading,
    isListNonPoLoading,
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
    getpph21,
    uploadFileQr,
    uploadFileOcr,
    getSapStatus,
    updatePaymentStatus,
    getPaymentStatus,
    updatePaymentStatusNonPo,
    getPaymentStatusNonPo,

    sync,
  }
})
