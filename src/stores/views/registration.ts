import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  DocumentAndLegalType,
  PaymentDetailFlaggingType,
  PaymentDetailType,
  RegisContactType,
  RegisInformationType,
} from './types/registration'

export const useRegistrationVendorStore = defineStore('registrationVendor', () => {
  const information = ref<RegisInformationType>({
    perusahaan: {
      namaPerusahaan: '',
      groupPerusahaan: '',
      tanggalBerdiri: '',
    },
    lokasiKantorPusat: {
      negara: 0,
      provinsi: 0,
      kabupatenKota: 0,
      kodePos: '',
      alamatLengkap: '',
    },
    lokasiPerusahaan: {
      negara: 0,
      provinsi: 0,
      kabupatenKota: 0,
      kodePos: '',
      alamatLengkap: '',
    },
    bidangUsaha: {
      bidangUsaha: 0,
      subBidangUsaha: 0,
      list: [],
    },
  })

  const contact = ref<RegisContactType>({
    account: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      website: '',
      noTel: '',
    },
    contactPerson: {
      fullName: '',
      noTel: '',
      email: '',
      position: 0,
      list: [],
    },
  })

  const requiredDocumentFields = ref<Record<number, number[]>>({
    1: [17, 12, 10],
    2: [17, 16],
    3: [12],
    4: [20],
  })

  const documentAndLegal = ref<DocumentAndLegalType>({
    kategori: 0,
    fields: [],
    anotherDocuments: [],
  })

  const paymentDetail = ref<PaymentDetailType>({
    noRekening: '',
    namaPemilikAkun: '',
    perbedaanRekening: '',
    halamanPertama: '',
    suratPernyataan: '',
    mataUang: 0,
    bankKey: '',
    namaBank: '',
    cabangBank: '',
    swiftCode: '',
    alamatBank: '',
  })

  const paymentDetailFlagging = ref<PaymentDetailFlaggingType>({
    isNotSameAsCompany: false,
    bankNotRegistered: false,
    acceptTermCondition: false,
    captcha: false,
  })

  return {
    information,
    contact,
    requiredDocumentFields,
    documentAndLegal,
    paymentDetail,
    paymentDetailFlagging,
  }
})
