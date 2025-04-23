type LokasiKantor = {
  countryId: number
  country: string
  countryError?: boolean
  stateId: number
  state: string
  stateError?: boolean
  cityId: number
  city: string
  cityError?: boolean
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
    foundedDate: string
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
  licenseNo: string
  issuedDate: string
  expiredDate: string
  uploadUrl: string
}

export type DocumentAndLegalType = {
  kategori: number
  fields: (DocumentFieldType & {
    licenseId: number
    licenseNoError?: boolean
    issuedDateError?: boolean
    expiredDateError?: boolean
    uploadUrlError?: boolean
  })[]
  anotherDocuments: DocumentFieldType[]
}

export type PaymentDetailType = {
  noRekening: string
  noRekeningError?: boolean
  namaPemilikAkun: string
  namaPemilikAkunError?: boolean
  perbedaanRekening: string
  perbedaanRekeningError?: boolean
  halamanPertama: string
  halamanPertamaError?: boolean
  suratPernyataan: string
  suratPernyataanError?: boolean
  mataUang: number
  mataUangError?: boolean
  bankKey: string
  bankKeyError?: boolean
  namaBank: string
  namaBankError?: boolean
  cabangBank: string
  cabangBankError?: boolean
  swiftCode: string
  swiftCodeError?: boolean
  alamatBank: string
  alamatBankError?: boolean
}

export type PaymentDetailFlaggingType = {
  isNotSameAsCompany: boolean
  bankNotRegistered: boolean
  acceptTermCondition: boolean
  captcha: boolean
}
