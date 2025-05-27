export type CountryListType = {
  countryID: number
  currencyId: number
  countryCode: string
  countryName: string
  countryPhonePrefix: string
}[]

export type ProvinceListType = {
  provinceID: number
  provinceName: string
  countryID: number
}[]

export type CityListType = {
  cityID: number
  cityName: string
  provinceID: number
}[]

export type DistrictListType = {
  districtID: number
  districtName: string
  cityID: number
}[]

export type PositionListType = {
  positionTypeId: number
  positionName: string
}[]

export type BankListType = {
  id: number
  bankCountryCode: string
  bankKey: string
  bankNameAccount: string
  street: string
  swiftCode: string
  addressNumber: number
  bankBranch: string | null
}[]

export type BusinessType = {
  businessFieldID: number
  businessFieldName: string
}

export type SubBusinessType = {
  subBusinessFieldID: number
  subBusinessFieldName: string
}

export type BusinessFieldListType = (BusinessType & {
  subBusiness: SubBusinessType[]
})[]

export type BusinessFieldReducerType = BusinessType & {
  subBusiness: SubBusinessType[]
}

export type BusinessFieldResponse = (BusinessType & SubBusinessType)[]

export type CurrencyListType = {
  currencyCode: string
  currencyName: string
}[]

export type CompanyCategoryType = {
  companyCategoryId: number
  companyCategoryName: string
}[]

export type CompanyLicenseType = {
  id: number
  companyCategoryId: number
  licenseId: number
  licenseName: string
}[]

export type TermConditionType = {
  termCondition: string
}

export type UploadFileResponse = {
  name: string
  url: string
  urlWithToken: string
}

type LocationType = {
  countryId: number
  country: string
  stateId: number
  state: string
  cityId: number
  city: string
  postalCode: string
  addressDetail: string
}

type DocumentType = {
  description: string
  issuedDate: string | null
  expiredDate: string | null
  uploadUrl: string
}

export type VendorRegistrationPayloadType = {
  account: {
    userName: string
    email: string
    password: string
  }
  vendor: {
    vendorName: string
    groupCompany: string
    foundedDate: string
    categoryId: number
    vendorEmail: string
    vendorPhone: string
    vendorWebsite: string
  }
  companyLocation: LocationType
  vendorLocation: LocationType
  vendorCommodities: {
    subBusinessFieldId: number
  }[]
  vendorResponsibleContacts: {
    contactName: string
    contactPhone: string
    contactEmail: string
    positionTypeId: number
  }[]
  vendorLicenses: (DocumentType & {
    licenseId: number
    licenseNo: string
  })[]
  otherDocuments: (DocumentType & {
    documentName: string
    documentNo: string
  })[]
  bankDetailDto: {
    bankKey: string
    bankName: string
    branch: string
    swiftCode: string
    address: string
  }
  vendorBankDetail: {
    accountNo: string
    accountName: string
    bankId: number
    currencyId: number
    urlAccountDifferences: string
    urlFirstPage: string
    bankAddress: string
    countryId: 0
  }
}
