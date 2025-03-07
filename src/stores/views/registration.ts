import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  PaymentDetailType,
  RegisContactType,
  RegisInformationType,
} from './types/registration'

const documentAndLegalFields = {
  noIzin: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  dokumen: '',
}

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
      kecamatan: 0,
      kodePos: '',
      alamatLengkap: '',
    },
    lokasiPerusahaan: {
      negara: 0,
      provinsi: 0,
      kabupatenKota: 0,
      kecamatan: 0,
      kodePos: '',
      alamatLengkap: '',
    },
    bidangUsaha: {
      bidangUsaha: '',
      subBidangUsaha: '',
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
      list: [] as { fullName: string; noTel: string; email: string; position: number }[],
    },
  })

  const documentAndLegal = ref({
    kategori: '',
    fields: {
      nib: {
        ...documentAndLegalFields,
      },
      npwp: {
        ...documentAndLegalFields,
      },
      sppkp: {
        ...documentAndLegalFields,
      },
      spfp: {
        ...documentAndLegalFields,
      },
      suratNonPkp: {
        ...documentAndLegalFields,
      },
      paktaIntegritas: {
        ...documentAndLegalFields,
      },
    },
  })

  const paymentDetail = ref<PaymentDetailType>({
    noRekening: '',
    namaPemilikAkun: '',
    perbedaanRekening: new Blob(),
    halamanPertama: new Blob(),
    mataUang: 0,
    bankKey: '',
    namaBank: '',
    cabangBank: '',
    swiftCode: '',
    alamatBank: '',
    isNotSameAsCompany: false,
    bankNotRegistered: false,
  })

  return { information, contact, documentAndLegal, paymentDetail }
})
