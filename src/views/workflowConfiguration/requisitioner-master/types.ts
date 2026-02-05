export interface Requisitioner {
  id?: string
  companyCode: string
  companyName: string
  department: string
  requisitionerCode: string
  requisitionerName: string
  status: 'Active' | 'Inactive'
}

export interface RequisitionerListParams {
  page: number
  pageSize: number
  search?: string
  department?: string
}
