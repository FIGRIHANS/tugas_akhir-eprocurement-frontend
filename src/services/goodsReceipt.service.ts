import invoiceApi from '@/core/utils/invoiceApi'

export interface ApiResponse<T> {
  title: string
  statusCode: number
  result: {
    message: string
    isError: boolean
    content: T
  }
}

export interface GoodsReceiptHeaderDto {
  grId: number
  receivingConfirmationId: number
  poNumber?: string
  grDocumentNo?: string
  grDocumentDate: string
  deliveryOrderNumber?: string
  vendorId?: number
  vendorCode?: string
  vendorName?: string
  tripID?: string
  poDate?: string
  totalAmount?: number | null
  currency?: string
  hasDiscrepancy: boolean
  supervisorApprovedBy: number
  approvedUtcDate: string
  notes?: string
}

export interface GoodsReceiptDetailItemDto {
  id: number
  poNumber?: string
  grDocumentNo?: string
  grDocumentItem: number
  grDocumentDate: string
  sku?: string
  itemName?: string
  uom?: string
  qtyReceivedGood: number
  qtyDamaged: number
  qtyRepack: number
  unitPrice?: number | null
  lineAmount?: number | null
  lotNo?: string
  noPickSlip?: string
  receivingConfirmationDetailId?: number | null
}

export interface GoodsReceiptDetailContentDto extends GoodsReceiptHeaderDto {
  status: string
  createdBy: string
  updatedBy: string
  createdUtcDate: string
  updatedUtcDate: string
  vendorID?: number | null
  items: GoodsReceiptDetailItemDto[]
}

export interface GoodsReceiptListParams {
  searchText?: string
  poNumber?: string
  grDocumentNo?: string
  deliveryOrderNumber?: string
  vendorId?: number
  vendorCode?: string
  grDocumentDateFrom?: string
  grDocumentDateTo?: string
}

export interface GoodsReceiptDetailParams {
  grId?: number
  grDocumentNo?: string
  receivingConfirmationId?: number
  poNumber?: string
  accessVendorId?: number
  accessVendorCode?: string
}

async function unwrapContent<T>(response: { data: ApiResponse<T> }): Promise<T> {
  const body = response.data?.result
  if (!body || body.isError) {
    throw new Error(body?.message || response.data?.title || 'Request failed')
  }
  return body.content
}

const GoodsReceiptService = {
  async getList(params: GoodsReceiptListParams): Promise<GoodsReceiptHeaderDto[]> {
    const response = await invoiceApi.get<ApiResponse<GoodsReceiptHeaderDto[]>>(
      '/goods-receipt/list',
      { params },
    )
    return unwrapContent(response)
  },

  async getDetail(params: GoodsReceiptDetailParams): Promise<GoodsReceiptDetailContentDto> {
    const response = await invoiceApi.get<ApiResponse<GoodsReceiptDetailContentDto>>(
      '/goods-receipt/detail',
      { params },
    )
    return unwrapContent(response)
  },
}

export default GoodsReceiptService
