const blacklist = {
  approveButton: 'Setuju',
  rejectButton: 'Tolak',
  cancelButton: 'Batal',
  removeButton: 'Hapus',
  downloadButton: 'Unduh',
  reason: 'Alasan',
  reasonError: 'Alasan wajib diisi',
  rejectTitle: 'Tolak permintaan blacklist vendor',
  approveTitle: 'Setujui permintaan blacklist vendor?',
  approveText: 'Vendor akan dimasukkan ke blacklist',
  removeTitle: 'Hapus vendor dari blacklist?',
  removeText: 'Vendor akan dihapus dari blacklist',
}

const masterFilters = {
  category: 'Category',
  registrationStartDate: 'Registration Start Date',
  registrationEndDate: 'Registration End Date',
  reset: 'Reset Filter',
}

const approvalFilters = {
  category: 'Category',
  approvalDateSent: 'Approval Date Sent',
}

const pagination = {
  show: 'Menampilkan { start } sampai { end } dari { total } data',
}

export default {
  masterFilters,
  pagination,
  approvalFilters,
  blacklist,
}
