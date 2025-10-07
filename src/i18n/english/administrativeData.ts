export const administrativeData = {
  // Page title and actions
  title: 'Administration',
  editData: 'Edit Data',
  done: 'Done',
  cancel: 'Cancel',
  save: 'Save',
  back: 'Back',

  // Data loading states
  loading: 'Loading...',
  noData: 'Oops! No data',

  // Form fields
  fields: {
    username: 'Username',
    userEmail: 'User Email',
    companyName: 'Company Name',
    companyCategory: 'Company Category',
    companyGroup: 'Company Group',
    npwpNumber: 'NPWP Number',
    npwpDocument: 'NPWP Document',
    country: 'Country',
    province: 'Province',
    regencyCity: 'Regency/City',
    telephone: 'Telephone',
    vendorEmail: 'Vendor Email',
    website: 'Website',
    currencyPreference: 'Currency Preference',
    companyAddress: 'Company Address',
    businessFields: 'Business Fields',
    sapcode: 'SAP Code',
  },

  // Actions
  actions: {
    downloadNpwp: 'Download NPWP Document',
    upload: 'Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)',
  },

  // Validation messages
  validation: {
    userEmailRequired: 'User Email Required',
    companyNameRequired: 'Company Name Required',
    companyGroupRequired: 'Company Group Required',
    npwpRequired: 'NPWP Required',
    npwpDocumentRequired: 'NPWP Document required',
    cityRequired: 'City Required',
    vendorPhoneRequired: 'Vendor Phone Required',
    vendorWebsiteRequired: 'Vendor Website Required',
    currencyRequired: 'Currency Required',
    addressRequired: 'Address Required',
  },

  // Confirmation modal
  confirmModal: {
    title: 'Save',
    message: 'You are about to Save to this data. Please review your input before continuing.',
  },

  // Success modal
  successModal: {
    title: 'Administration Data Successfully Updated',
    message: 'The data has been successfully updated in the admin system.',
  },

  // Error modal
  errorModal: {
    title: 'Failed to Change Vendor data!',
    message:
      'Failed to change vendor data. Please try again later or contact support if the problem persists.',
  },

  // Error messages
  errors: {
    uploadFailed: 'File upload failed. Please try again.',
    downloadFailed: 'Failed to download document. Please try again later.',
  },
}
