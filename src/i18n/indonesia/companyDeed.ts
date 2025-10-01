export const companyDeed = {
  // Page titles
  title: 'Data Akta Perusahaan',

  // Shareholders Section
  shareholders: {
    title: 'Pemegang Saham',
    addNew: 'Tambah pemegang saham baru',
    edit: 'Edit pemegang saham',
    name: 'Nama Pemegang Saham',
    type: 'Tipe',
    idNumber: 'Nomor Identitas',
    birthDate: 'Tanggal Lahir',
    nominalShare: 'Nilai Nominal Saham',
    shareUnit: 'Satuan Saham',
    position: 'Posisi / Peran',
    idCopy: 'Salinan KTP',
    action: 'Aksi',
    add: 'Tambah',
    edit_action: 'Edit',
    delete_action: 'Hapus',
    cancel: 'Batal',
    save: 'Simpan',
    saving: 'Menyimpan...',
    uploadPlaceholder: 'Unggah file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)',

    // Validation messages
    validation: {
      nameRequired: 'Nama Pemegang Saham wajib diisi',
      idRequired: 'Nomor Identitas wajib diisi',
      shareRequired: 'Nilai Nominal Saham wajib diisi',
      unitRequired: 'Satuan Saham wajib diisi',
      positionRequired: 'Posisi / Peran wajib diisi',
    },
  },

  // Company Deed Section
  companyDeedSection: {
    title: 'Akta Pendirian Perusahaan',
    documentNo: 'Nomor Dokumen',
    documentDate: 'Tanggal Dokumen',
    notaryName: 'Nama Notaris',
    notaryLocation: 'Lokasi Notaris',
    document: 'Dokumen',
    add: 'Tambah',
    save: 'Simpan',
    selectDate: 'Pilih Tanggal',

    // Validation
    validation: {
      documentNoRequired: 'Nomor dokumen wajib diisi',
      notaryNameRequired: 'Nama notaris wajib diisi',
      documentRequired: 'Dokumen wajib diisi',
      documentDateRequired: 'Tanggal dokumen wajib diisi',
      notaryLocationRequired: 'Lokasi notaris wajib diisi',
    },
  },

  // Latest Amendment Section
  latestAmendment: {
    title: 'Data Perubahan Terakhir',
    documentNo: 'Nomor Dokumen',
    documentDate: 'Tanggal Dokumen',
    notaryName: 'Nama Notaris',
    notaryLocation: 'Lokasi Notaris',
    document: 'Dokumen',
    add: 'Tambah',
    save: 'Simpan',

    // Validation
    validation: {
      documentNoRequired: 'Nomor dokumen wajib diisi',
      notaryNameRequired: 'Nama notaris wajib diisi',
      documentRequired: 'URL Dokumen wajib diisi',
      notaryLocationRequired: 'Lokasi notaris wajib diisi',
    },
  },

  // Ratification Section
  ratification: {
    title: 'Pengesahan oleh Kemkumham',
    subtitle: 'Khusus untuk perusahaan dengan status badan hukum PT',
    documentNo: 'Nomor',
    documentDate: 'Tanggal Surat',
    document: 'Dokumen',
    add: 'Tambah',
    save: 'Simpan',

    // Validation
    validation: {
      numberRequired: 'Nomor wajib diisi',
      letterDateRequired: 'Tanggal surat wajib diisi',
      fileRequired: 'File wajib diisi',
    },
  },

  // Common
  common: {
    loading: 'Memuat...',
    noData: 'Belum ada data',
    errorLoadingData: 'Terjadi kesalahan saat memuat data',
    download: 'Unduh',
    hooray: 'Berhasil!',
    successMessage: 'Data berhasil disimpan. Terima kasih atas partisipasi Anda!',
    companyCategory: 'Kategori Perusahaan',
    companyAddress: 'Alamat Perusahaan',
    datePlaceholder: 'Pilih Tanggal',
    uploadHint: 'Unggah berkas di sini',
    data: 'data',

    // Error modal
    failed: 'Gagal',
    failedAdd: 'Gagal menambah',
    failedChange: 'Gagal mengubah',
    failedDelete: 'Gagal menghapus',
    document: 'dokumen',
    shareholders: 'Pemegang Saham',

    // Delete confirmation
    deleteTitle: 'Apakah Anda Yakin Ingin Menghapus Item Ini?',
    deleteMessage: 'Tindakan ini akan menghapus data yang dipilih secara permanen dari daftar.',
    cancel: 'Batal',
    delete: 'Hapus',

    // Upload
    uploadFailed: 'Upload Gagal',
    fileSizeExceeds:
      'Ukuran file melebihi batas maksimum 16 MB. Silakan pilih file yang lebih kecil.',

    // Pagination
    show: 'Tampilkan',
    perPage: 'per halaman',
    from: 'dari',
  },
}
