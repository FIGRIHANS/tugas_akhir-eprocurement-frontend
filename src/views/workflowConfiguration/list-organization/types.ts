export interface Organization {
  id?: string
  companyCode: string
  companyName: string
  status: 'Active' | 'Inactive'
  createdDate: string
  createdBy: string
}

export interface OrganizationListParams {
  page: number
  pageSize: number
  search: string
  status?: string
}
