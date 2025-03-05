import { ref } from 'vue'
import { defineStore } from 'pinia'

const documentAndLegalFields = {
  noIzin: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  dokumen: '',
}

export const useRegistrationVendorStore = defineStore('registrationVendor', () => {
  const information = ref({
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
      position: 0,
      list: [] as { fullName: string; noTel: string; email: string; position: number }[],
    },
  })

  const documentAndLegal = ref({
    bagian: '',
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

  return { information, contact, documentAndLegal, paymentDetail }
})
