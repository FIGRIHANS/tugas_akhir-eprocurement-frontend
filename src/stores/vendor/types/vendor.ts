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
  companyScale: string | null
  verificationRemark: string
  licenses: {
    licenseName: string
    expiredUTCDate: string | null
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
