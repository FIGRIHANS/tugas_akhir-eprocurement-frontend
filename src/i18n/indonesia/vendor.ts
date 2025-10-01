const blacklist = {
  approveButton: 'Approve',
  rejectButton: 'Reject',
  cancelButton: 'Cancel',
  removeButton: 'Remove',
  downloadButton: 'Download',
  reason: 'Reason',
  reasonError: 'Reason is required',
  rejectTitle: 'Reject vendor blacklist request',
  approveTitle: 'Approve vendor blacklist request?',
  approveText: 'Vendor will be blacklisted',
  removeTitle: 'Remove vendor from blacklist?',
  removeText: 'Vendor will be removed from blacklist',
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
