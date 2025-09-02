const blacklist = {
  approveButton: 'Setujui',
  rejectButton: 'Tolak',
  cancelButton: 'Batal',
  removeButton: 'Hapus',
  downloadButton: 'Unduh',
  reason: 'Alasan',
  reasonError: 'Alasan wajib diisi',
  rejectTitle: 'Tolak permintaan blacklist vendor',
  approveTitle: 'Setujui permintaan blacklist vendor?',
  approveText: 'Vendor akan diblacklist',
  removeTitle: 'Hapus vendor dari blacklist?',
  removeText: 'Vendor akan dihapus dari blacklist',
}

const masterFilters = {
  category: 'Kategori',
  registrationStartDate: 'Tanggal Awal Registrasi',
  registrationEndDate: 'Tanggal Akhir Registrasi',
  reset: 'Atur ulang Filter',
}

const approvalFilters = {
  category: 'Kategori',
  approvalDateSent: 'Tanggal Persetujuan Dikirim',
}

const pagination = {
  show: 'Menampilkan { start } ke { end } dari { total } data',
}

export default {
  masterFilters,
  pagination,
  approvalFilters,
  blacklist,
}
