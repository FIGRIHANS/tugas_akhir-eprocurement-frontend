export const otherDocumentData = {
  pageTitle: 'Other Documents',

  // Table headers
  table: {
    headers: {
      action: 'Action',
      documentName: 'Document Name',
      documentNo: 'Document Number',
      availableUntil: 'Available Until',
    },
    noData: 'No data',
  },

  // Buttons
  buttons: {
    add: 'Add',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    close: 'Close',
  },

  // Modal Form
  modal: {
    form: {
      title: 'Other Document',

      // Form labels and placeholders
      labels: {
        documentName: 'Document Name',
        documentNo: 'Document Number',
        availableUntil: 'Available Until',
      },
      placeholders: {
        startDate: 'Start Date',
        upload: 'Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)',
      },
      uploadHint: '*jpg, jpeg, png, pdf, zip / max : 16 MB',
    },

    // Success Modal
    success: {
      title: 'Hooray!',
      message: 'The data has been successfully updated in the admin system.',
    },

    // Error Modal
    error: {
      title: 'Failed to {action} Other document!',
      message: 'Please try again later or contact support if the problem persists.',
      actions: {
        delete: 'Delete',
        add: 'Add',
        change: 'Change',
      },
    },

    // Delete Modal
    delete: {
      title: 'Are You Sure You Want to Delete This Item?',
      message: 'This action will permanently remove the selected data from the list.',
    },

    // File Size Error
    fileSizeError: {
      title: 'File Size Exceeded',
      message: 'File size exceeds the maximum limit of 16 MB. Please choose a smaller file.',
    },
  },

  // Validation messages
  validation: {
    documentNameRequired: 'Document name required',
    documentNoRequired: 'Document number required',
  },

  // Error messages
  error: {
    downloadFailed: 'Failed to download document. Please try again later.',
    uploadFailed: 'File upload failed. Please try again.',
  },
}
