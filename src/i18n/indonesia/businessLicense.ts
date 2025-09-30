export const businessLicense = {
  // Page title
  title: 'Data Izin Usaha',

  // PKP Table View
  pkpTable: {
    title: 'Data Izin Usaha',
    headers: {
      businessLicense: 'Izin Usaha',
      licenseNumber: 'Nomor Izin / Keterangan',
      validFrom: 'Berlaku Dari (Tanggal Mulai)',
      validUntil: 'Berlaku Sampai (Tanggal Berakhir)',
      document: 'Dokumen',
      action: 'Aksi',
    },
    placeholders: {
      licenseNumber: 'Nomor Izin / Keterangan',
      selectDate: 'Pilih Tanggal',
      chooseFile: 'Pilih file...',
    },
    buttons: {
      edit: 'Edit',
      save: 'Simpan',
      cancel: 'Batal',
      downloadDocument: 'Unduh Dokumen',
      uploadDocument: 'Upload dokumen',
    },
    messages: {
      noData: 'Tidak ada data tersedia',
      requiredField: 'Field wajib diisi',
    },
  },

  // Other Documents Table View
  otherDocuments: {
    title: 'Dokumen Lainnya',
    tooltip: 'Maksimal 5 Dokumen Diizinkan',
    headers: {
      documentName: 'Nama Dokumen',
      licenseNumber: 'Nomor Izin / Keterangan',
      validFrom: 'Berlaku Dari (Tanggal Mulai)',
      validUntil: 'Berlaku Sampai (Tanggal Berakhir)',
      document: 'Dokumen',
      action: 'Aksi',
    },
    placeholders: {
      documentName: 'Nama Dokumen',
      licenseNumber: 'Nomor Izin / Keterangan',
      chooseFile: 'Pilih file...',
    },
    buttons: {
      addDocument: 'Tambah Dokumen',
      edit: 'Edit',
      save: 'Simpan',
      cancel: 'Batal',
      downloadDocument: 'Unduh Dokumen',
      uploadDocument: 'Upload dokumen',
    },
    messages: {
      noData: 'Tidak ada dokumen lainnya tersedia.',
      accountStatementRequired:
        'Harus mengunggah Rekening Koran. Tanpa dokumen ini, data akan ditolak.',
    },
  },

  // General messages and actions
  instructions: {
    uploadReminder: 'Pastikan untuk mengklik tombol upload setelah memilih dokumen.',
    requiredFields: 'Field yang ditandai (*) dengan tanda bintang adalah wajib diisi.',
  },

  buttons: {
    back: 'Kembali',
    save: 'Simpan',
    cancel: 'Batal',
    close: 'Tutup',
  },

  // Modals
  confirmModal: {
    title: 'Simpan',
    message: 'Anda akan menyimpan data ini. Silakan tinjau input Anda sebelum melanjutkan',
  },

  successModal: {
    title: 'Data Izin Usaha Berhasil Diperbarui',
    message: 'Data telah berhasil diperbarui dalam sistem admin',
  },

  errorModal: {
    title: 'Kesalahan Memperbarui Data',
    message: 'Terjadi kesalahan saat memperbarui data. Silakan coba lagi nanti.',
  },

  uploadErrorModal: {
    title: 'Upload Gagal',
    message: 'Upload gagal. Silakan coba lagi nanti.',
  },

  fileSizeErrorModal: {
    title: 'Ukuran File Melebihi Batas',
    message: 'Ukuran file melebihi batas maksimum 16 MB. Silakan pilih file yang lebih kecil.',
  },

  requiredFieldsModal: {
    title: 'Field Wajib Belum Diisi',
    message: 'Silakan isi semua field wajib sebelum menyimpan.',
  },

  // Error messages
  errors: {
    uploadFailed: 'Upload file gagal. Silakan coba lagi.',
    downloadFailed: 'Gagal mengunduh dokumen. Silakan coba lagi nanti.',
  },
}
