export interface IVendorList {
  id: number
  vendorId: number
  userId: number
  vendorName: string
  companyCategoryId: number
  companyCategoryName: string
  vendorEmail: string
  vendorPhone: string
  vendorWebsite: string
  npwp: string
  npwpUrl: string
  foundedDate: string
  companyScale: null | string
  verificationRemark: string
  approvalStatus: string
  isActive: boolean
  isVerified: number
  activedUTCDate: string
  verifiedUTCDate: string
  verifiedSendUTCDate: null | string
  verifiedRejectedUTCDate: string
  sendApprovalDate: string | null
  licenses: {
    licenseName: string
    expiredUTCDate: null | string
  }[]
  createdBy: string
  createdUTCDate: string
}

export interface IVendorContent {
  items: IVendorList[]
  total: number
  page: number
  pageSize: number
}

export interface IAdministration {
  vendorId: number
  userId: number
  userName: string
  vendorName: string
  companyCategoryId: number
  companyCategoryName: string
  groupCompany: string
  npwp: string
  npwpUrl: string
  vendorPhone: string
  vendorEmail: string
  vendorWebsite: string
  businessFieldName: string | null
  businessUnitName: string
  addressCompanyDetail: string
  stateName: string
  cityName: string
  currencyLabel: string
  currencySymbol: string
}
