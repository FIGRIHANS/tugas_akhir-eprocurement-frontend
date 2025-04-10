type LokasiKantor = {
  negara: number
  negaraError?: boolean
  provinsi: number
  provinsiError?: boolean
  kabupatenKota: number
  kabupatenKotaError?: boolean
  kodePos: string
  kodePosError?: boolean
  alamatLengkap: string
  alamatLengkapError?: boolean
}

type BidangUsaha = {
  bidangUsaha: number
  subBidangUsaha: number
}

export type RegisInformationType = {
  perusahaan: {
    namaPerusahaan: string
    namaPerusahaanError?: boolean
    groupPerusahaan: string
    tanggalBerdiri: string
    tanggalBerdiriError?: boolean
  }
  lokasiKantorPusat: LokasiKantor
  lokasiPerusahaan: LokasiKantor
  bidangUsaha: BidangUsaha & {
    bidangUsahaError?: boolean
    subBidangUsahaError?: boolean
    list: (BidangUsaha & {
      bidangUsahaName: string
      subBidangUsahaName: string
    })[]
  }
}

type ContactPersonType = {
  fullName: string
  noTel: string
  email: string
  position: number
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
    noTel: string
    noTelError?: boolean
  }
  contactPerson: ContactPersonType & {
    fullNameError?: boolean
    noTelError?: boolean
    emailError?: boolean
    positionError?: boolean
    list: ContactPersonType[]
  }
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
  isNotSameAsCompany: boolean
  bankNotRegistered: boolean
}
