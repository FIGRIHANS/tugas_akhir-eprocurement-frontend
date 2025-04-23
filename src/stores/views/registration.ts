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
    vendor: {
      vendorName: '',
      groupCompany: '',
      foundedDate: '',
    },
    companyLocation: {
      countryId: 0,
      country: '',
      stateId: 0,
      state: '',
      cityId: 0,
      city: '',
      postalCode: '',
      addressDetail: '',
    },
    vendorLocation: {
      countryId: 0,
      country: '',
      stateId: 0,
      state: '',
      cityId: 0,
      city: '',
      postalCode: '',
      addressDetail: '',
    },
    vendorCommodities: {
      businessFieldId: 0,
      subBusinessFieldId: 0,
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
      phone: '',
    },
    contactPerson: {
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      positionTypeId: 0,
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
