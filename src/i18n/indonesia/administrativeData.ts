export const administrativeData = {
  // Page title and actions
  title: 'Administrasi',
  editData: 'Edit Data',
  done: 'Selesai',
  cancel: 'Batal',
  save: 'Simpan',
  back: 'Kembali',

  // Data loading states
  loading: 'Memuat...',
  noData: 'Ups! Tidak ada data',

  // Form fields
  fields: {
    username: 'Username',
    userEmail: 'Email User',
    companyName: 'Nama Perusahaan',
    companyCategory: 'Kategori Perusahaan',
    companyGroup: 'Grup Perusahaan',
    npwpNumber: 'Nomor NPWP',
    npwpDocument: 'Dokumen NPWP',
    country: 'Negara',
    province: 'Provinsi',
    regencyCity: 'Kabupaten/Kota',
    telephone: 'Telepon',
    vendorEmail: 'Email Vendor',
    website: 'Website',
    currencyPreference: 'Preferensi Mata Uang',
    companyAddress: 'Alamat Perusahaan',
    businessFields: 'Bidang Usaha',
    sapcode: 'Kode SAP',
  },

  // Actions
  actions: {
    downloadNpwp: 'Unduh Dokumen NPWP',
    upload: 'Unggah file - (*jpg, jpeg, png, pdf, zip / maks : 16 MB)',
  },

  // Validation messages
  validation: {
    userEmailRequired: 'Email User Diperlukan',
    companyNameRequired: 'Nama Perusahaan Diperlukan',
    companyGroupRequired: 'Grup Perusahaan Diperlukan',
    npwpRequired: 'NPWP Diperlukan',
    npwpDocumentRequired: 'Dokumen NPWP diperlukan',
    cityRequired: 'Kota Diperlukan',
    vendorPhoneRequired: 'Telepon Vendor Diperlukan',
    vendorWebsiteRequired: 'Website Vendor Diperlukan',
    currencyRequired: 'Mata Uang Diperlukan',
    addressRequired: 'Alamat Diperlukan',
  },

  // Confirmation modal
  confirmModal: {
    title: 'Simpan',
    message: 'Anda akan menyimpan data ini. Mohon tinjau input Anda sebelum melanjutkan.',
  },

  // Success modal
  successModal: {
    title: 'Data Administrasi Berhasil Diperbarui',
    message: 'Data telah berhasil diperbarui dalam sistem admin.',
  },

  // Error modal
  errorModal: {
    title: 'Gagal Mengubah Data Vendor!',
    message:
      'Gagal mengubah data vendor. Silakan coba lagi nanti atau hubungi dukungan jika masalah terus berlanjut.',
  },

  // Error messages
  errors: {
    uploadFailed: 'Upload file gagal. Silakan coba lagi.',
    downloadFailed: 'Gagal mengunduh dokumen. Silakan coba lagi nanti.',
  },
}
