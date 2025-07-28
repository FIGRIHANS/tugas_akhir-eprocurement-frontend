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
  companyScale: string | null
  verificationRemark: string | null
  approvalStatusId: string | null
  approvalStatus: string | null
  isActive: boolean
  isVerified: number
  activedUTCDate: string | null
  verifiedUTCDate: string | null
  verifiedSendUTCDate: string
  verifiedRejectedUTCDate: string | null
  sendApprovalDate: string | null
  isSpecificIndustry: number
  licenses: {
    vendorId: number
    licenseName: string
    expiredUTCDate: string
    seq: number
  }[]
  createdBy: string
  createdUTCDate: string
  modifiedUTCDate: string
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
  userEmail: string
  vendorName: string
  companyCategoryId: number
  companyCategoryName: string
  groupCompany: string
  npwp: string
  npwpUrl: string
  vendorPhone: string
  vendorEmail: string
  vendorWebsite: string
  businessFieldName: string
  businessUnitName: string
  addressCompanyDetail: string
  countryName: string
  stateName: string
  cityName: string
  currencyLabel: string
  currencySymbol: string
  countryId: number
  stateId: number
  cityId: number
  currencyId: number
}

export interface IAdministrationPayload {
  vendorId: number
  emailUser: string
  companyName: string
  companyGroup: string
  npwpNo: string
  npwpUrl: string
  currencySymbol: string
  cityId: number
  vendorPhone: string
  vendorWebsite: string
  companyAddress: string
  vendorCommodities?: {
    subBusinessFieldId: number
  }[]
  updatedBy: string
}

export interface ILicense {
  vendorId: number
  licenseId: number
  licenseNo: string
  issuedUTCDate: string
  expiredUTCDate: string
  issuedBy: string | null
  issuedLocation: string | null
  documentUrl: string
  remark: string
  action: string | null
  isTemporary: string | null
  licenseName: string
  seq: number
  companyCategoryId: number
}

export interface IPayment {
  id: number
  vendorId: number
  accountNo: string
  accountName: string
  bankId: number
  currencyId: number
  urlDoc: string
  isTemporary: null | string
  action: null | string
  bankAddress: string
  countryId: number
  isTransfer: boolean
  changeRequestId: null | number
  isActive: boolean
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
  countryCode: null | string
  countryName: null | string
  countryPhonePrefix: null | string
  urlFirstPage: string
  urlAccountDifferences: string
  urlBankAccountDeclaration: null | string
  isBankRegistered: boolean
  isHolderNameDifferent: boolean
}

export interface IPaymentPayload {
  request: {
    bankDetailDto: IBankDetailDto
    vendorBankDetail: IBankDetail
    id: number
    vendorId: number
    updateBy: string
  }
}

export interface IBankDetailDto {
  bankCountryCode: string
  bankKey: string
  bankName: string
  branch: string
  swiftCode: string
  address: string
}

export interface IBankDetail {
  accountNo: string
  accountName: string
  bankKey: string
  currencySymbol: string
  urlDoc: string
  urlBankAccountDeclaration: string
  isHolderNameDifferent: boolean
  urlFirstPage: string
  urlAccountDifferences: string
  isBankRegistered: boolean
  bankAddress: string
  countryId: number
}

export interface IDeletePaymentPayload {
  request: {
    id: number
    updateBy: string
  }
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

export interface IOtherDocument {
  documentName: string,
  documentNo: string,
  uploadUrl: string,
  description: string,
  issuedDate: string | number | unknown,
  expiredDate: string | number | unknown,
}

export interface IVendorPayload {
  request: {
    vendorLicenses: ILicensePayload[],
    otherDocumentVendor: IOtherDocument[],
    vendorId: number,
    updatedBy: string
  }
}

export interface ILicensePayload {
  licenseId: number;
  licenseNo: string;
  uploadUrl: string;
  description: string;
  issuedDate: string;
  expiredDate: string;
}
