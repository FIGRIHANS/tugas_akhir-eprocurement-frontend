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
  bankCountryCode: string
  bankCode: string
  bankName: string
  bankSwiftCode: string
  partnerBankType: string
  bankAddress: string
  bankCity: string
  branch: string
  logIntegration: string
  biCode: string
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
  companyLocation: {
    countryId: number
    country: string
    stateId: number
    state: string
    cityId: number
    city: string
    postalCode: string
    addressDetail: string
  }
  vendorLocation: {
    countryId: number
    country: string
    stateId: number
    state: string
    cityId: number
    city: string
    postalCode: string
    addressDetail: string
  }
  vendorCommodities: {
    subBusinessFieldId: number
  }[]
  vendorResponsibleContacts: {
    contactName: string
    contactPhone: string
    contactEmail: string
    positionTypeId: number
  }[]
  vendorLicenses: {
    licenseId: number
    licenseNo: string
    description: string
    issuedDate: string
    expiredDate: string
    uploadUrl: string
  }[]
  otherDocuments: {
    documentName: string
    documentNo: string
    description: string
    issuedDate: string
    expiredDate: string
    uploadUrl: string
  }[]
  bankDetailDto: {
    bankName: string
    branch: string
    swiftCode: string
    address: string
  }
  vendorBankDetail: {
    accountNo: string
    accountName: string
    bankId: string
    currencyId: number
    urlAccountDifferences: string
    urlFirstPage: string
    urlDoc: string
    bankAddress: string
    countryId: 0
  }
}
