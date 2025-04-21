export interface IVendorList {
  vendorId: string
  vendorName: string
  addressCompanyInfo: string
  companyCategoryName: string
  activedUTCDate: string
  sendApprovalDate: null | string
  approvalStatus: null | string
  approvalStatusName: null | string
  approvalTypeName: null | string
  businessFieldName: null | string
}

export interface IVendorContent {
  items: IVendorList[]
  total: number,
  page: number
  pageSize:number
}
