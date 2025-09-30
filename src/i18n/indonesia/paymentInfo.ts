export const paymentInfo = {
  // Page title and main actions
  title: 'Informasi Pembayaran',
  addData: 'Tambah Data',

  // Table headers
  tableHeaders: {
    no: 'No',
    accountNo: 'No. Rekening',
    accountHolderName: 'Nama Pemegang Rekening',
    swiftCode: 'Kode Swift',
    accountDiscrepancyStatement: 'Pernyataan Ketidaksesuaian Rekening',
    accountCover: 'Sampul Rekening',
    currency: 'Mata Uang',
    bankKey: 'Kunci Bank',
    bankName: 'Nama Bank',
    bankBranch: 'Cabang Bank',
    bankAddress: 'Alamat Bank',
  },

  // Dropdown actions
  actions: {
    viewData: 'Lihat Data',
    edit: 'Edit',
    delete: 'Hapus',
  },

  // Buttons
  buttons: {
    back: 'Kembali',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    close: 'Tutup',
  },

  // Modal titles
  modalTitles: {
    addPaymentInfo: 'Tambah Informasi Pembayaran',
    viewPaymentInfo: 'Lihat Informasi Pembayaran',
    editPaymentInfo: 'Edit Informasi Pembayaran',
  },

  // Form labels and placeholders
  form: {
    bankAccountNumber: 'Nomor Rekening Bank',
    bankAccountNumberPlaceholder: 'Masukkan Nomor Rekening Bank',
    accountHolderName: 'Nama Pemegang Rekening',
    accountHolderNamePlaceholder: 'Masukkan nama lengkap sesuai buku tabungan',
    holderNameDifferent: 'Nama pemegang berbeda dengan nama perusahaan.',
    accountCover: 'Sampul Rekening',
    bankKey: 'Kunci Bank',
    bankName: 'Nama Bank',
    currency: 'Mata Uang',
    accountDiscrepancyStatement: 'Pernyataan Ketidaksesuaian Rekening',
    bankNotRegistered: 'Bank tidak terdaftar.',
    bankCountry: 'Negara Bank',
    bankBranch: 'Cabang Bank',
    swiftCode: 'Kode Swift',
    bankAddress: 'Alamat Bank',
    uploadFile: 'Unggah file - (*jpg, jpeg, png, pdf, zip / maks : 16 MB)',
    select: 'Pilih',
  },

  // Validation messages
  validation: {
    accountNumberRequired: 'Nomor Rekening diperlukan',
    accountNameRequired: 'Nama Rekening diperlukan',
    bankKeyRequired: 'Kunci Bank diperlukan',
    currencyRequired: 'Mata Uang diperlukan',
    bankAddressRequired: 'Alamat Bank diperlukan',
    accountCoverRequired: 'Sampul Rekening diperlukan',
    accountDifferenceRequired: 'Pernyataan Ketidaksesuaian diperlukan',
    bankNameRequired: 'Nama Bank diperlukan',
    countryRequired: 'Negara diperlukan',
    branchRequired: 'Cabang diperlukan',
    swiftCodeRequired: 'Kode Swift diperlukan',
    addressRequired: 'Alamat diperlukan',
  },

  // Delete modal
  deleteModal: {
    title: 'Apakah Anda Yakin Ingin Menghapus Item Ini?',
    message: 'Tindakan ini akan menghapus secara permanen data yang dipilih dari daftar.',
  },

  // Success modal
  successModal: {
    title: 'Hore!',
    message: 'Data telah berhasil diperbarui dalam sistem admin.',
  },

  // Error modal
  errorModal: {
    titleAdd: 'Gagal Menambah Informasi Pembayaran!',
    titleEdit: 'Gagal Mengubah Informasi Pembayaran!',
    titleDelete: 'Gagal Menghapus Informasi Pembayaran!',
    message:
      'Gagal mengubah Informasi Pembayaran. Silakan coba lagi nanti atau hubungi dukungan jika masalah terus berlanjut.',
  },

  // File size error modal
  fileSizeErrorModal: {
    title: 'Ukuran File Melebihi Batas',
    message: 'Ukuran file melebihi batas maksimum 16 MB. Silakan pilih file yang lebih kecil.',
  },

  // Error messages
  errors: {
    downloadFailed: 'Gagal mengunduh dokumen. Silakan coba lagi nanti.',
    uploadFailed: 'Upload file gagal. Silakan coba lagi.',
  },
}
