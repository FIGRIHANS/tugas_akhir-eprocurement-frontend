export const otherDocumentData = {
  pageTitle: 'Dokumen Lainnya',

  // Table headers
  table: {
    headers: {
      action: 'Aksi',
      documentName: 'Nama Dokumen',
      documentNo: 'Nomor Dokumen',
      availableUntil: 'Berlaku Sampai',
    },
    noData: 'Tidak ada data',
  },

  // Buttons
  buttons: {
    add: 'Tambah',
    back: 'Kembali',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    close: 'Tutup',
  },

  // Modal Form
  modal: {
    form: {
      title: 'Dokumen Lainnya',

      // Form labels and placeholders
      labels: {
        documentName: 'Nama Dokumen',
        documentNo: 'Nomor Dokumen',
        availableUntil: 'Berlaku Sampai',
      },
      placeholders: {
        startDate: 'Tanggal Mulai',
        upload: 'Unggah file - (*jpg, jpeg, png, pdf, zip / maks : 16 MB)',
      },
      uploadHint: '*jpg, jpeg, png, pdf, zip / maks : 16 MB',
    },

    // Success Modal
    success: {
      title: 'Horee!',
      message: 'Data telah berhasil diperbarui dalam sistem admin.',
    },

    // Error Modal
    error: {
      title: 'Gagal {action} Dokumen lainnya!',
      message: 'Silakan coba lagi nanti atau hubungi dukungan jika masalah berlanjut.',
      actions: {
        delete: 'Menghapus',
        add: 'Menambahkan',
        change: 'Mengubah',
      },
    },

    // Delete Modal
    delete: {
      title: 'Apakah Anda Yakin Ingin Menghapus Item Ini?',
      message: 'Tindakan ini akan menghapus data yang dipilih secara permanen dari daftar.',
    },

    // File Size Error
    fileSizeError: {
      title: 'Ukuran File Melebihi Batas',
      message: 'Ukuran file melebihi batas maksimum 16 MB. Silakan pilih file yang lebih kecil.',
    },
  },

  // Validation messages
  validation: {
    documentNameRequired: 'Nama dokumen wajib diisi',
    documentNoRequired: 'Nomor dokumen wajib diisi',
  },

  // Error messages
  error: {
    downloadFailed: 'Gagal mengunduh dokumen. Silakan coba lagi nanti.',
    uploadFailed: 'Pengunggahan file gagal. Silakan coba lagi.',
  },
}
