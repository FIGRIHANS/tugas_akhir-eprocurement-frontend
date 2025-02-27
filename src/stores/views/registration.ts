import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRegistrationVendorStore = defineStore('registrationVendor', () => {
  const information = ref({
    perusahaan: {
      namaPerusahaan: '',
      groupPerusahaan: '',
      tanggalBerdiri: '',
    },
    lokasiKantorPusat: {
      negara: '',
      provinsi: '',
      kabupatenKota: '',
      kecamatan: '',
    },
    lokasiPerusahaan: {
      negara: '',
      provinsi: '',
      kabupatenKota: '',
      kecamatan: '',
      kodePos: '',
      alamatLengkap: '',
    },
    bidangUsaha: {
      selected: '',
      list: [],
    },
    bisnisUnit: {
      selected: '',
      list: [],
    },
  })

  const contact = ref({
    account: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      website: '',
      noTel: '',
      noFax: '',
    },
    contactPerson: {
      fullName: '',
      noTel: '',
      email: '',
      partOf: '',
      list: [],
    },
  })

  const paymentDetail = ref({
    namaBank: '',
    noRekening: '',
    namaPemilikAkun: '',
    perbedaanRekening: '',
    mataUang: '',
    halamanPertama: '',
    negara: '',
    alamatBank: '',
  })

  return { information, contact, paymentDetail }
})
