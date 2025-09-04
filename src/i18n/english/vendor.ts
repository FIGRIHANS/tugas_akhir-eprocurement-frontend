const blacklist = {
  approveButton: 'Approve',
  rejectButton: 'Reject',
  cancelButton: 'Cancel',
  removeButton: 'Remove',
  downloadButton: 'Download',
  reason: 'Reason',
  reasonError: 'Reason is required',
  rejectTitle: 'Reject Blacklist Vendor Request',
  approveTitle: 'Approve Blacklist Vendor Request?',
  approveText: 'The vendor will be blacklisted',
  removeTitle: 'Remove vendor from blacklist?',
  removeText: 'The vendor will be remove from blacklist',
}

const masterFilters = {
  category: 'Category',
  registrationStartDate: 'Registration Start Date',
  registrationEndDate: 'Registration End Date',
  reset: 'Reset Filters',
}

const approvalFilters = {
  category: 'Category',
  approvalDateSent: 'Approval Date Sent',
}

const pagination = {
  show: 'Showing { start } to { end } of { total } entries',
}

export default {
  masterFilters,
  pagination,
  approvalFilters,
  blacklist,
}
