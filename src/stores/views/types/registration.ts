type LokasiKantor = {
  countryId: number
  country: string
  countryIdError?: boolean
  stateId: number
  state: string
  stateIdError?: boolean
  cityId: number
  city: string
  cityIdError?: boolean
  postalCode: string
  postalCodeError?: boolean
  addressDetail: string
  addressDetailError?: boolean
}

type BidangUsaha = {
  businessFieldId: number
  subBusinessFieldId: number
}

export type RegisInformationType = {
  vendor: {
    vendorName: string
    vendorNameError?: boolean
    groupCompany: string
    foundedDate: Date | string
    foundedDateError?: boolean
  }
  companyLocation: LokasiKantor
  vendorLocation: LokasiKantor
  vendorCommodities: BidangUsaha & {
    businessFieldError?: boolean
    subBusinessFieldError?: boolean
    list: (BidangUsaha & {
      businessFieldName: string
      subBusinessFieldName: string
    })[]
  }
}

type ContactPersonType = {
  contactName: string
  contactPhone: string
  contactEmail: string
  positionTypeId: number
}

export type RegisContactType = {
  account: {
    username: string
    usernameError?: boolean
    email: string
    emailError?: boolean
    password: string
    passwordError?: boolean
    confirmPassword: string
    confirmPasswordError?: boolean
    website: string
    phone: string
    phoneError?: boolean
  }
  contactPerson: ContactPersonType & {
    contactNameError?: boolean
    contactPhoneError?: boolean
    contactEmailError?: boolean
    positionError?: boolean
    list: ContactPersonType[]
  }
}

type DocumentFieldType = {
  description: string
  issuedDate: Date | string
  expiredDate: Date | string
  uploadUrl: string
}

export type ListDocumentType = {
  file: File
  status: 'notUpload' | 'loading' | 'success'
}

export type DocumentAndLegalType = {
  kategori: number
  fields: (DocumentFieldType & {
    licenseId: number
    licenseNo: string
    licenseNoError?: boolean
    issuedDateError?: boolean
    expiredDateError?: boolean
    uploadUrlError?: boolean
  })[]
  anotherDocuments: (DocumentFieldType & {
    documentName: string
    documentNo: string
  })[]
}

export type PaymentDetailType = {
  accountNo: string
  accountNoError?: boolean
  accountName: string
  accountNameError?: boolean
  urlAccountDifferences: string
  urlAccountDifferencesError?: boolean
  urlFirstPage: string
  urlFirstPageError?: boolean
  currencyId: string
  currencyIdError?: boolean
  bankId: string
  bankIdError?: boolean
  bankKey: string
  bankKeyError?: boolean
  bankName: string
  bankNameError?: boolean
  branch: string
  branchError?: boolean
  swiftCode: string
  swiftCodeError?: boolean
  bankAddress: string
  bankAddressError?: boolean
}

export type PaymentDetailFlaggingType = {
  isNotSameAsCompany: boolean
  bankNotRegistered: boolean
  acceptTermCondition: boolean
  captcha: boolean
}
