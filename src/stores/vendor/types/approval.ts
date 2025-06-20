export interface IApprovalItem {
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

export interface IApproval {
  items: IApprovalItem[]
  total: number
  page: number
  pageSize: number
}

export interface IApprove {
  vendorId: string
  approvalStatus: number
  approvalById: string
  approvalByName: string
  approvalNote: string
}

export interface ISendSAPBody {
  vendorId: number
}
