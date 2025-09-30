export const paymentInfo = {
  // Page title and main actions
  title: 'Payment Information',
  addData: 'Add Data',

  // Table headers
  tableHeaders: {
    no: 'No',
    accountNo: 'Account No.',
    accountHolderName: 'Account Holder Name',
    swiftCode: 'SwiftCode',
    accountDiscrepancyStatement: 'Account Discrepancy Statement',
    accountCover: 'Account Cover',
    currency: 'Currency',
    bankKey: 'Bank Key',
    bankName: 'Bank Name',
    bankBranch: 'Bank Branch',
    bankAddress: 'Bank Address',
  },

  // Dropdown actions
  actions: {
    viewData: 'View Data',
    edit: 'Edit',
    delete: 'Delete',
  },

  // Buttons
  buttons: {
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    close: 'Close',
  },

  // Modal titles
  modalTitles: {
    addPaymentInfo: 'Add Payment Information',
    viewPaymentInfo: 'View Payment Information',
    editPaymentInfo: 'Edit Payment Information',
  },

  // Form labels and placeholders
  form: {
    bankAccountNumber: 'Bank Account Number',
    bankAccountNumberPlaceholder: 'Enter Bank Account Number',
    accountHolderName: 'Account Holder Name',
    accountHolderNamePlaceholder: 'Enter full name as written in bank book',
    holderNameDifferent: "Holder's name is different from the company name.",
    accountCover: 'Account Cover',
    bankKey: 'Bank Key',
    bankName: 'Bank Name',
    currency: 'Currency',
    accountDiscrepancyStatement: 'Account Discrepancy Statement',
    bankNotRegistered: 'Bank not registered.',
    bankCountry: 'Bank Country',
    bankBranch: 'Bank Branch',
    swiftCode: 'Swift Code',
    bankAddress: 'Bank Address',
    uploadFile: 'Upload file - (*jpg, jpeg, png, pdf, zip / max : 16 MB)',
    select: 'Select',
  },

  // Validation messages
  validation: {
    accountNumberRequired: 'Account Number required',
    accountNameRequired: 'Account Name required',
    bankKeyRequired: 'Bank Key required',
    currencyRequired: 'Currency required',
    bankAddressRequired: 'Bank Address required',
    accountCoverRequired: 'Account Cover required',
    accountDifferenceRequired: 'Account Difference required',
    bankNameRequired: 'Bank Name required',
    countryRequired: 'Country required',
    branchRequired: 'Branch required',
    swiftCodeRequired: 'Swift Code required',
    addressRequired: 'Address required',
  },

  // Delete modal
  deleteModal: {
    title: 'Are You Sure You Want to Delete This Item?',
    message: 'This action will permanently remove the selected data from the list.',
  },

  // Success modal
  successModal: {
    title: 'Hooray!',
    message: 'The data has been successfully updated in the admin system.',
  },

  // Error modal
  errorModal: {
    titleAdd: 'Failed to Add Payment Information!',
    titleEdit: 'Failed to Change Payment Information!',
    titleDelete: 'Failed to Delete Payment Information!',
    message:
      'Failed to change Payment Information. Please try again later or contact support if the problem persists.',
  },

  // File size error modal
  fileSizeErrorModal: {
    title: 'File Size Exceeded',
    message: 'File size exceeds the maximum limit of 16 MB. Please choose a smaller file.',
  },

  // Error messages
  errors: {
    downloadFailed: 'Failed to download document. Please try again later.',
    uploadFailed: 'File upload failed. Please try again.',
  },
}
