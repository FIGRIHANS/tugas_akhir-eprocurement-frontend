export const vendorBlacklist = {
  title: 'Vendor Blacklist',
  breadcrumb: {
    vendorBlacklist: 'Vendor Blacklist',
  },
  tabs: {
    pendingBlacklist: 'Pending Blacklist',
    blacklistVendor: 'Blacklist Vendor',
  },
  table: {
    columns: {
      actions: 'Actions',
      companyName: 'Company Name',
      type: 'Type',
      startDate: 'Start Date',
      endDate: 'End Date',
      blacklistDescription: 'Blacklist Description',
      document: 'Document',
      status: 'Status',
    },
    noData: 'No data',
    pagination: {
      showing: 'Showing {start} to {end} of {total} entries',
    },
  },
  search: {
    placeholder: 'Search Vendor',
  },
  filter: {
    title: 'Filter',
    period: 'Period',
    resetFilter: 'Reset Filter',
  },
  modal: {
    blacklist: {
      title: 'Blacklist Vendor',
      fields: {
        blacklistType: 'Blacklist Type',
        selectType: 'Select Type',
        startDate: 'Start Date',
        endDate: 'End Date',
        uploadFiles: 'Upload supporting files',
        reason: 'Reason',
      },
      validation: {
        blacklistTypeRequired: 'Blacklist type is Required',
        reasonRequired: 'Reason is Required',
      },
      buttons: {
        upload: 'Upload',
        cancel: 'Cancel',
        blacklist: 'Blacklist',
        progress: 'Progress',
      },
      messages: {
        uploadSuccess: 'Upload file success',
      },
    },
    success: {
      title: 'Blacklist Vendor Request {action}',
      message: 'Blacklist Vendor request has been successfully {action}.',
      removedTitle: 'Vendor Successfully Removed from Blacklist',
      removedText: 'The Vendor is now active in the system again.',
      approvedTitle: 'Blacklist Vendor Request Approved',
      approvedText: 'Blacklist Vendor request has been successfully Approved.',
      rejectedTitle: 'Blacklist Vendor Request Rejected',
      rejectedText: 'Blacklist Vendor request has been successfully Rejected.',
    },
    error: {
      title: 'Failed to {action} Blacklist Vendor Request',
      message: 'Blacklist Vendor request failed to {action}.',
      removeTitle: 'Failed to remove vendor from blacklist',
      removeText: 'Remove vendor from Blacklist failed',
      approveTitle: 'Failed to approve Blacklist Vendor Request',
      approveText: 'Blacklist Vendor request failed to approve.',
      rejectTitle: 'Failed to reject Blacklist Vendor Request',
      rejectText: 'Blacklist Vendor request failed to reject.',
    },
    remove: {
      success: {
        title: 'Vendor Successfully Removed from Blacklist',
        message: 'The Vendor is now active in the system again.',
      },
      error: {
        title: 'Failed to remove vendor from blacklist',
        message: 'Remove vendor from Blacklist failed',
      },
    },
  },
  actions: {
    download: 'Download',
    downloadFailed: 'Failed to download document. Please try again later.',
    approved: 'Approved',
    rejected: 'Rejected',
  },
}
