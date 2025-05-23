export interface IVendorList {
  id: number
  vendorCode: string
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
  approvalStatusId: number
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
  countryName: string
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

export interface ILicense {
  vendorId: number
  licenseId: number
  licenseNo: string
  issuedUTCDate: null | string
  expiredUTCDate: null | string
  issuedBy: null | string
  issuedLocation: null | string
  documentUrl: string
  remark: null | string
  action: null | string
  isTemporary: null | string
  licenseName: string
  isNominal: boolean
}

export interface IPayment {
  id: number
  vendorId: number
  accountNo: string
  accountName: string
  bankId: number
  currencyId: string
  urlDoc: string
  isTemporary: null | string
  action: null | string
  bankAddress: string
  countryId: number
  isTransfer: boolean
  changeRequestId: null | string
  isActive: null | string
  bankCountryCode: string
  bankCode: string
  bankName: string
  bankSwiftCode: string
  partnerBankType: string
  bankBankAddress: string
  bankCity: string
  branch: string
  bankLogIntegration: string
  bankDateIntegration: string
  biCode: string
  currencySymbol: string
  currencyLabel: string
  countryCode: string
  countryName: string
  countryPhonePrefix: string
}

export interface IPostBlacklist {
  VendorId?: number
  BlacklistDescription?: string
  DocUrl?: string
  BlacklistTypeID?: number
  StartDate?: string
  EndDate?: string
  CreatedBy?: string
}

export interface IVerifyLegal {
  vendorId?: number
  dataCategoryId?: number
  isVerified?: boolean
  verifiedNote?: string
  isReject?: boolean
  rejectedNote?: string
  position?: string
  createdBy?: string
  verificatorName?: string
}

export interface IVerificationDetailData {
  vendorId: number
  verificatorName: string
  position: string
  createdDate: string
  verificationType: string
  status: string
  keterangan: string
}
