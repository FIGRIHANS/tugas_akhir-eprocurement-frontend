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

  return { information }
})
