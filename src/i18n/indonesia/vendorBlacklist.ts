export const vendorBlacklist = {
  title: 'Daftar Hitam Vendor',
  breadcrumb: {
    vendorBlacklist: 'Daftar Hitam Vendor',
  },
  tabs: {
    pendingBlacklist: 'Pending Daftar Hitam',
    blacklistVendor: 'Vendor Daftar Hitam',
  },
  table: {
    columns: {
      actions: 'Aksi',
      companyName: 'Nama Perusahaan',
      type: 'Tipe',
      startDate: 'Tanggal Mulai',
      endDate: 'Tanggal Selesai',
      blacklistDescription: 'Deskripsi Daftar Hitam',
      document: 'Dokumen',
      status: 'Status',
    },
    noData: 'Tidak ada data',
    pagination: {
      showing: 'Menampilkan {start} sampai {end} dari {total} entri',
    },
  },
  search: {
    placeholder: 'Cari Vendor',
  },
  filter: {
    title: 'Filter',
    period: 'Periode',
    resetFilter: 'Reset Filter',
  },
  modal: {
    blacklist: {
      title: 'Daftar Hitam Vendor',
      fields: {
        blacklistType: 'Tipe Daftar Hitam',
        selectType: 'Pilih Tipe',
        startDate: 'Tanggal Mulai',
        endDate: 'Tanggal Selesai',
        uploadFiles: 'Unggah file pendukung',
        reason: 'Alasan',
      },
      validation: {
        blacklistTypeRequired: 'Tipe daftar hitam wajib diisi',
        reasonRequired: 'Alasan wajib diisi',
      },
      buttons: {
        upload: 'Unggah',
        cancel: 'Batal',
        blacklist: 'Daftar Hitam',
        progress: 'Proses',
      },
      messages: {
        uploadSuccess: 'Berhasil mengunggah file',
      },
    },
    success: {
      title: 'Permintaan Daftar Hitam Vendor {action}',
      message: 'Permintaan daftar hitam vendor telah berhasil {action}.',
      removedTitle: 'Vendor Berhasil Dihapus dari Daftar Hitam',
      removedText: 'Vendor sekarang aktif kembali di sistem.',
      approvedTitle: 'Permintaan Daftar Hitam Vendor Disetujui',
      approvedText: 'Permintaan daftar hitam vendor telah berhasil disetujui.',
      rejectedTitle: 'Permintaan Daftar Hitam Vendor Ditolak',
      rejectedText: 'Permintaan daftar hitam vendor telah berhasil ditolak.',
    },
    error: {
      title: 'Gagal {action} Permintaan Daftar Hitam Vendor',
      message: 'Permintaan daftar hitam vendor gagal {action}.',
      removeTitle: 'Gagal menghapus vendor dari daftar hitam',
      removeText: 'Penghapusan vendor dari daftar hitam gagal',
      approveTitle: 'Gagal menyetujui Permintaan Daftar Hitam Vendor',
      approveText: 'Permintaan daftar hitam vendor gagal disetujui.',
      rejectTitle: 'Gagal menolak Permintaan Daftar Hitam Vendor',
      rejectText: 'Permintaan daftar hitam vendor gagal ditolak.',
    },
    remove: {
      success: {
        title: 'Vendor Berhasil Dihapus dari Daftar Hitam',
        message: 'Vendor sekarang aktif kembali di sistem.',
      },
      error: {
        title: 'Gagal menghapus vendor dari daftar hitam',
        message: 'Penghapusan vendor dari daftar hitam gagal',
      },
    },
  },
  actions: {
    download: 'Unduh',
    downloadFailed: 'Gagal mengunduh dokumen. Silakan coba lagi nanti.',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  },
}
