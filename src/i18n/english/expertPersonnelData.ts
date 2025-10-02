export const expertPersonnelData = {
  pageTitle: 'Expert Personnel Data',

  // Table headers
  table: {
    headers: {
      action: 'Action',
      name: 'Name',
      education: 'Highest Education Level',
      position: 'Position / Role',
      experience: 'Years of Experience',
      expertise: 'Expertise / Skills',
    },
    noData: 'No data',
    showPerPage: 'Show',
    perPageText: 'per page from',
    dataText: 'data',
  },

  // Action menu
  actions: {
    viewDetail: 'View Detail',
    edit: 'Edit',
    delete: 'Delete',
  },

  // Buttons
  buttons: {
    add: 'Add',
    next: 'Next',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    delete: 'Delete',
    download: 'Download',
  },

  // Modal Form
  modal: {
    title: 'Expert Personnel Data',

    // Tabs
    tabs: {
      personalInfo: 'Personal Information',
      cvDetails: 'CV Details',
    },

    // Personal Information Form
    personalInfo: {
      labels: {
        name: 'Name',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        address: 'Address',
        education: 'Highest Education Level',
        nationality: 'Nationality',
        position: 'Position / Role',
        employmentStatus: 'Employment Status',
        expertise: 'Expertise / Skills',
      },
      placeholders: {
        name: 'Name',
        selectDate: 'Select',
        address: 'Address',
        education: '--Highest Education Level *--',
        nationality: '--Nationality--',
        position: 'Position / Role',
        expertise: 'Elaborate Expertise / Skills',
      },
      genderOptions: {
        male: 'Male',
        female: 'Female',
      },
    },

    // CV Details
    cvDetails: {
      tableHeaders: {
        action: '',
        start: 'Start',
        until: 'Until',
        file: 'File',
        description: 'Description',
      },
      uploadPlaceholder: 'Upload file',
      uploadHint: '*jpg, jpeg, png, pdf, zip / max : 16 MB',
      descriptionPlaceholder: 'Description',
    },

    // Success Modal
    success: {
      title: 'Expert Personnel Data Successfully Updated',
      message: 'The data has been successfully updated in the admin system.',
    },

    // Error Modal
    error: {
      title: 'Failed to Change Expert Personnel Data!',
      message: 'Please try again later or contact support if the problem persists.',
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
    nameRequired: 'Name Required',
    dateOfBirthRequired: 'Date of Birth Required',
    genderRequired: 'Gender Required',
    addressRequired: 'Address Required',
    educationRequired: 'Education Required',
    nationalityRequired: 'Nationality Required',
    positionRequired: 'Position Required',
    employmentStatusRequired: 'Employment Status Required',
    expertiseRequired: 'Expertise Required',
  },

  // Error messages
  error: {
    downloadFailed: 'Failed to download document. Please try again later.',
    uploadFailed: 'File upload failed. Please try again.',
  },
}
