export const companyDeed = {
  // Page titles
  title: 'Company Deed Data',

  // Shareholders Section
  shareholders: {
    title: 'Shareholders',
    addNew: 'Add new shareholders',
    edit: 'Edit shareholders',
    name: 'Shareholder Name',
    type: 'Type',
    idNumber: 'ID Number',
    birthDate: 'Date of Birth',
    nominalShare: 'Nominal Share Value',
    shareUnit: 'Share Unit',
    position: 'Position / Role',
    idCopy: 'ID Copy',
    action: 'Action',
    add: 'Add',
    edit_action: 'Edit',
    delete_action: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    uploadPlaceholder: 'Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)',

    // Validation messages
    validation: {
      nameRequired: 'Shareholder Name is required',
      idRequired: 'ID Number is required',
      shareRequired: 'Nominal Share Value is required',
      unitRequired: 'Share Unit is required',
      positionRequired: 'Position / Role is required',
    },
  },

  // Company Deed Section
  companyDeedSection: {
    title: 'Company Deed',
    documentNo: 'Document No',
    documentDate: 'Document Date',
    notaryName: 'Notary Name',
    notaryLocation: 'Notary Location',
    document: 'Document',
    add: 'Add',
    save: 'Save',
    selectDate: 'Select Date',

    // Validation
    validation: {
      documentNoRequired: 'Document no is required',
      notaryNameRequired: 'Notary name is required',
      documentRequired: 'Document URL is required',
      documentDateRequired: 'Document date is required',
      notaryLocationRequired: 'Notary location is required',
    },
  },

  // Latest Amendment Section
  latestAmendment: {
    title: 'Latest Amendment Data',
    documentNo: 'Document No',
    documentDate: 'Document Date',
    notaryName: 'Notary Name',
    notaryLocation: 'Notary Location',
    document: 'Document',
    add: 'Add',
    save: 'Save',

    // Validation
    validation: {
      documentNoRequired: 'Document no is required',
      notaryNameRequired: 'Notary name is required',
      documentRequired: 'Document URL is required',
      notaryLocationRequired: 'Notary location is required',
    },
  },

  // Ratification Section
  ratification: {
    title: 'Ratification by Kemkumham',
    subtitle: 'Specifically for companies with PT legal entity status',
    documentNo: 'Number',
    documentDate: 'Letter Date',
    document: 'Document',
    add: 'Add',
    save: 'Save',

    // Validation
    validation: {
      numberRequired: 'Number is required',
      letterDateRequired: 'Letter date is required',
      fileRequired: 'File is required',
    },
  },

  // Common
  common: {
    loading: 'Loading...',
    noData: 'No data available',
    errorLoadingData: 'An error occurred while loading data',
    download: 'Download',
    hooray: 'Hooray!',
    successMessage: 'Data saved successfully. Thank you for your participation!',
    companyCategory: 'Company Category',
    companyAddress: 'Company Address',
    datePlaceholder: 'Select Date',
    uploadHint: 'Upload file here',
    data: 'data',

    // Error modal
    failed: 'Failed to',
    failedAdd: 'Failed to Add',
    failedChange: 'Failed to Change',
    failedDelete: 'Failed to Delete',
    document: 'document',
    shareholders: 'Shareholders',

    // Delete confirmation
    deleteTitle: 'Are You Sure You Want to Delete This Item?',
    deleteMessage: 'This action will permanently remove the selected data from the list.',
    cancel: 'Cancel',
    delete: 'Delete',

    // Upload
    uploadFailed: 'Upload Failed',
    fileSizeExceeds: 'File size exceeds the maximum limit of 16 MB. Please choose a smaller file.',

    // Pagination
    show: 'Show',
    perPage: 'per page',
    from: 'from',
  },
}
