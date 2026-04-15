import invoiceApi from '@/core/utils/invoiceApi'

// Interface untuk Mock SAP Detail Item
export interface MockSapDetailItem {
  id: number
  poNumber: string
  sku: string
  itemName: string
  uom: string
  qtyOrdered: number
  unitPrice: number | null
  qtyInTransit: number
  qtyDelivered: number
}

// Interface untuk Mock SAP Header Data
export interface MockSapHeaderData {
  poNumber: string
  vendorCode: string
  vendorName: string
  poDate: string
  totalAmount: number | null
  status: string
  createdBy: string
  updatedBy: string
  createdUtcDate: string
  updatedUtcDate: string
  items?: MockSapDetailItem[]
}

// Interface untuk response dari API backend
export interface ApiResponse<T> {
  title: string
  statusCode: number
  result: {
    message: string
    isError: boolean
    content: T
  }
}

// Interface untuk parameter filter/query list
export interface MockSapListQueryParams {
  searchText?: string
  poNumber?: string
  vendorCode?: string
  vendorName?: string
  poDateFrom?: string
  poDateTo?: string
}

const MockSapService = {
  /**
   * Get list of Mock SAP PO Headers
   * Endpoint: api/mock-sap/list
   */
  async getList(params?: MockSapListQueryParams): Promise<MockSapHeaderData[]> {
    try {
      const response = await invoiceApi.get<ApiResponse<MockSapHeaderData[]>>(
        '/mock-sap/list',
        {
          params: params,
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return []
    } catch (error) {
      console.error('Error fetching mock SAP list:', error)
      throw error
    }
  },

  /**
   * Get detail of a Mock SAP PO by PO Number (All Status)
   * Endpoint: api/mock-sap/detail-all-status
   */
  async getDetail(poNumber: string): Promise<MockSapHeaderData | null> {
    try {
      const response = await invoiceApi.get<ApiResponse<MockSapHeaderData>>(
        '/mock-sap/detail-all-status',
        {
          params: { poNumber },
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return null
    } catch (error) {
      console.error('Error fetching mock SAP detail:', error)
      throw error
    }
  },
}

export default MockSapService

