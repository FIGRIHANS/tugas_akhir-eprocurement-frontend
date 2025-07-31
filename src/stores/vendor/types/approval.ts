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
  approvalByPosition: string
  approvalNote: string
}

export interface ISendSAPBody {
  vendorId: number
}

export interface IMatrixBody {
  vendorId: number
}

export interface IMatrixResponse {
  id: number
  vendorId: number
  approvalStatus: number
  approvalName: string
  approvalById: string
  approvalByName: string
  approvalByPosition: string
  approvalNote: string
  createdUtcDate: string
}

export interface IVendorDetail {
  id: number
  vendorId: number
  userId: number
  vendorName: string
  addressCompanyDetail: string
  addressCompanyInfo: string | null
  addressOfficeId: number
  cityId: number
  districtId: number
  postalCode: string
  stateId: number
  companyCategoryId: number
  groupCompany: string
  vendorEmail: string
  vendorPhone: string
  vendorWebsite: string
  npwp: string
  npwpUrl: string
  foundedDate: string
  companyScale: string | null
  verificationRemark: string | null
  isActive: boolean
  isActived: boolean | null
  isVerified: number
  activedUTCDate: string
  verifiedUTCDate: string
  verifiedSendUTCDate: string
  description: string
  activedRejectedUTCDate: string | null
  verifiedRejectedUTCDate: string | null
  isTemporary: boolean | null
  action: string | null
  approvalStatus: number
  sendApprovalDate: string
  sendApprovalBy: string
  activedBy: string | null
  verifiedBy: string | null
  top: string | null
  isSentSAP: number
  tradingPartner: string | null
}
