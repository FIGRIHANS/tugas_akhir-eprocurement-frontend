import invoiceApi from '@/core/utils/invoiceApi'

// Interface untuk Detail Item Payload - untuk POST
export interface ReceivingConfirmationDetailPayload {
  sku: string
  deskripsi: string
  noPickSlip: string
  lotNo: string
  qtySuratJalan: number
  qtyActual: number
  repackQty: number
  damageQty: number
  rejectReason?: string
}

// Interface untuk Create Payload - untuk POST ke backend
export interface ReceivingConfirmationCreatePayload {
  poNumber: string
  tripID?: string
  orderNumber?: string
  status?: string
  rejectReason?: string
  hasDiscrepancy?: boolean
  receivedDate: string
  pickup?: string
  destination?: string
  transporter?: string
  truckType?: string
  licensePlate?: string
  whCheckerName: string
  driverName: string
  digitalSignaturePath?: string
  items: ReceivingConfirmationDetailPayload[]
}

export interface ReceivingConfirmationUpdatePayload {
  reportID: number
  status: number
  generalRejectReason?: string
}

// Interface untuk data Receiving Confirmation
export interface ReceivingConfirmationData {
  reportID: number
  tripID: string
  orderNumber: string
  status: string
  rejectReason: string | null
  receivedDate: string
  hasDiscrepancy: boolean
  pickup: string
  destination: string
  transporter: string
  truckType: string
  licensePlate: string
  whCheckerName: string
  driverName: string
  digitalSignaturePath: string
  driverSignature?: string | null
  createdBy: string
  updatedBy: string
  createdUtcDate: string
  updatedUtcDate: string
  items: ReceivingConfirmationDetailResponse[]
}

// Interface untuk Detail Response
export interface ReceivingConfirmationDetailResponse {
  id: number
  reportID: number
  sku: string
  deskripsi: string
  noPickSlip: string
  lotNo: string
  qtySuratJalan: number
  qtyActual: number
  qtySelisih: number
  repackQty: number
  damageQty: number
  rejectReason?: string
  createdBy: string
  createdUtcDate: string
  updatedBy: string
  updatedUtcDate: string
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

// Interface untuk parameter filter/query
export interface ReceivingConfirmationQueryParams {
  searchText?: string
  orderNumber?: string
  whCheckerName?: string
  driverName?: string
  status?: string
  receivedDateFrom?: string
  receivedDateTo?: string
  destination?: string
  hasDiscrepancy?: boolean
}

/**
 * Service untuk mengelola API Receiving Confirmation
 */
const ReceivingConfirmationService = {
  /**
   * Get list of receiving confirmations
   * Endpoint: api/receiving-confirmation/list
   */
  async getList(params?: ReceivingConfirmationQueryParams): Promise<ReceivingConfirmationData[]> {
    try {
      const response = await invoiceApi.get<ApiResponse<ReceivingConfirmationData[]>>(
        '/receiving-confirmation/list',
        {
          params: params,
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return []
    } catch (error) {
      console.error('Error fetching receiving confirmation list:', error)
      throw error
    }
  },

  /**
   * Get detail of a receiving confirmation by ID
   * Endpoint: api/receiving-confirmation/{id}
   */
  async getDetail(reportID: number): Promise<ReceivingConfirmationData | null> {
    try {
      const response = await invoiceApi.get<ApiResponse<ReceivingConfirmationData>>(
        `/receiving-confirmation/detail`,
        {
          params: {
            reportID: reportID,
          },
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return null
    } catch (error) {
      console.error('Error fetching receiving confirmation detail:', error)
      throw error
    }
  },

  /**
   * Create new receiving confirmation
   * Endpoint: POST api/receiving-confirmation/create
   */
  async create(data: ReceivingConfirmationCreatePayload): Promise<ReceivingConfirmationData> {
    try {
      const response = await invoiceApi.post<ApiResponse<ReceivingConfirmationData>>(
        '/receiving-confirmation/create',
        data,
      )
      return response.data.result.content
    } catch (error) {
      console.error('Error creating receiving confirmation:', error)
      throw error
    }
  },

  async updateStatus(
    reportID: number,
    data: ReceivingConfirmationUpdatePayload,
  ): Promise<ReceivingConfirmationData> {
    try {
      // Axios PUT signature: put(url, data, config)
      const response = await invoiceApi.put<ApiResponse<ReceivingConfirmationData>>(
        '/receiving-confirmation/update-status',
        data, // Request body
        {
          params: {
            reportID: reportID,
          },
        },
      )
      return response.data.result.content
    } catch (error) {
      console.error('Error approving/rejecting receiving confirmation:', error)
      throw error
    }
  },

  /**
   * Export receiving confirmation data
   * Endpoint: api/receiving-confirmation/export
   */
  async exportData(params?: ReceivingConfirmationQueryParams): Promise<Blob> {
    try {
      const response = await invoiceApi.get('/receiving-confirmation/export', {
        params: params,
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Error exporting receiving confirmation:', error)
      throw error
    }
  },
}

export default ReceivingConfirmationService
