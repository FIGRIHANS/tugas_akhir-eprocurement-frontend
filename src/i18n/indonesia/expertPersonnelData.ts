export const expertPersonnelData = {
  pageTitle: 'Data Personil Ahli',

  // Table headers
  table: {
    headers: {
      action: 'Aksi',
      name: 'Nama',
      education: 'Tingkat Pendidikan Tertinggi',
      position: 'Posisi / Peran',
      experience: 'Tahun Pengalaman',
      expertise: 'Keahlian / Keterampilan',
    },
    noData: 'Tidak ada data',
    showPerPage: 'Tampilkan',
    perPageText: 'per halaman dari',
    dataText: 'data',
  },

  // Action menu
  actions: {
    viewDetail: 'Lihat Detail',
    edit: 'Edit',
    delete: 'Hapus',
  },

  // Buttons
  buttons: {
    add: 'Tambah',
    next: 'Selanjutnya',
    back: 'Kembali',
    cancel: 'Batal',
    save: 'Simpan',
    close: 'Tutup',
    delete: 'Hapus',
    download: 'Unduh',
  },

  // Modal Form
  modal: {
    title: 'Data Personil Ahli',

    // Tabs
    tabs: {
      personalInfo: 'Informasi Pribadi',
      cvDetails: 'Detail CV',
    },

    // Personal Information Form
    personalInfo: {
      labels: {
        name: 'Nama',
        dateOfBirth: 'Tanggal Lahir',
        gender: 'Jenis Kelamin',
        address: 'Alamat',
        education: 'Tingkat Pendidikan Tertinggi',
        nationality: 'Kewarganegaraan',
        position: 'Posisi / Peran',
        employmentStatus: 'Status Kepegawaian',
        expertise: 'Keahlian / Keterampilan',
      },
      placeholders: {
        name: 'Nama',
        selectDate: 'Pilih',
        address: 'Alamat',
        education: '--Tingkat Pendidikan Tertinggi *--',
        nationality: '--Kewarganegaraan--',
        position: 'Posisi / Peran',
        expertise: 'Jelaskan Keahlian / Keterampilan',
      },
      genderOptions: {
        male: 'Laki-laki',
        female: 'Perempuan',
      },
    },

    // CV Details
    cvDetails: {
      tableHeaders: {
        action: '',
        start: 'Mulai',
        until: 'Sampai',
        file: 'File',
        description: 'Deskripsi',
      },
      placeholders: {
        start: 'Tanggal Mulai',
        until: 'Tanggal Berakhir',
        description: 'Deskripsi',
      },
      uploadPlaceholder: 'Unggah file',
      uploadHint: '*jpg, jpeg, png, pdf, zip / maks : 16 MB',
      descriptionPlaceholder: 'Deskripsi',
    },

    // Success Modal
    success: {
      title: 'Data Personil Ahli Berhasil Diperbarui',
      message: 'Data telah berhasil diperbarui dalam sistem admin.',
    },

    // Error Modal
    error: {
      title: 'Gagal Mengubah Data Personil Ahli!',
      message: 'Silakan coba lagi nanti atau hubungi dukungan jika masalah berlanjut.',
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
    nameRequired: 'Nama Wajib Diisi',
    dateOfBirthRequired: 'Tanggal Lahir Wajib Diisi',
    genderRequired: 'Jenis Kelamin Wajib Diisi',
    addressRequired: 'Alamat Wajib Diisi',
    educationRequired: 'Pendidikan Wajib Diisi',
    nationalityRequired: 'Kewarganegaraan Wajib Diisi',
    positionRequired: 'Posisi Wajib Diisi',
    employmentStatusRequired: 'Status Kepegawaian Wajib Diisi',
    expertiseRequired: 'Keahlian Wajib Diisi',
  },

  // Error messages
  error: {
    downloadFailed: 'Gagal mengunduh dokumen. Silakan coba lagi nanti.',
    uploadFailed: 'Pengunggahan file gagal. Silakan coba lagi.',
  },
}
