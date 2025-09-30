export const businessLicense = {
  // Page title
  title: 'Business License Data',

  // PKP Table View
  pkpTable: {
    title: 'Business License Data',
    headers: {
      businessLicense: 'Business License',
      licenseNumber: 'License Number / Description',
      validFrom: 'Valid From (Start Date)',
      validUntil: 'Valid Until (End Date)',
      document: 'Document',
      action: 'Action',
    },
    placeholders: {
      licenseNumber: 'License Number / Description',
      selectDate: 'Pilih Tanggal',
      chooseFile: 'Choose file...',
    },
    buttons: {
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      downloadDocument: 'Download Document',
      uploadDocument: 'Upload document',
    },
    messages: {
      noData: 'No data available',
      requiredField: 'Required field',
    },
  },

  // Other Documents Table View
  otherDocuments: {
    title: 'Other Documents',
    tooltip: 'Maximum of 5 Documents Allowed',
    headers: {
      documentName: 'Document Name',
      licenseNumber: 'License Number / Description',
      validFrom: 'Valid From (Start Date)',
      validUntil: 'Valid Until (End Date)',
      document: 'Document',
      action: 'Action',
    },
    placeholders: {
      documentName: 'Document Name',
      licenseNumber: 'License Number / Description',
      chooseFile: 'Choose file...',
    },
    buttons: {
      addDocument: 'Add Document',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      downloadDocument: 'Download Document',
      uploadDocument: 'Upload document',
    },
    messages: {
      noData: 'No other documents available.',
      accountStatementRequired:
        'Must upload Account Statement. Without this document, data will be rejected.',
    },
  },

  // General messages and actions
  instructions: {
    uploadReminder: 'Make sure to click the upload button after selecting the document.',
    requiredFields: 'Fields marked (*) with an asterisk are required.',
  },

  buttons: {
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
  },

  // Modals
  confirmModal: {
    title: 'Save',
    message: 'You are about to Save to this data. Please review your input before continuing',
  },

  successModal: {
    title: 'Business License Data Successfully Updated',
    message: 'The data has been successfully updated in the admin system',
  },

  errorModal: {
    title: 'Error Updated Data',
    message: 'An error occurred while updating the data. Please try again later.',
  },

  uploadErrorModal: {
    title: 'Upload Failed',
    message: 'Upload failed. Please try again later.',
  },

  fileSizeErrorModal: {
    title: 'File Size Exceeded',
    message: 'File size exceeds the maximum limit of 16 MB. Please choose a smaller file.',
  },

  requiredFieldsModal: {
    title: 'Required Fields Missing',
    message: 'Please fill all required fields before saving.',
  },

  // Error messages
  errors: {
    uploadFailed: 'File upload failed. Please try again.',
    downloadFailed: 'Failed to download document. Please try again later.',
  },
}
