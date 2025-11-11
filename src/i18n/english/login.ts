export const login = {
  back: 'Back',
  legal: 'Legal',
  contact: 'Contact',
  term: 'Terms',
  // Language selection
  language: {
    indonesia: 'Indonesia (ID)',
    english: 'English (EN)',
  },
  // Branch Login
  branch: {
    adminTitle: 'Login as employee',
    adminDesc: 'If you are employee login here',
    vendorTitle: 'Login as vendor',
    vendorDesc: 'If you are vendor login here',
  },
  // Login Form
  form: {
    signIn: 'Sign in',
    admin: 'employee',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    username: 'Username',
    usernamePlaceholder: 'Username',
    password: 'Password',
    passwordPlaceholder: 'Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember me',
    signInButton: 'Sign In',
    registerButton: 'Register',
    errorMessage: 'Email or password you entered is incorrect, Please double-check and try again.',
  },
  // Forgot Password
  forgot: {
    title: 'Forgot Password',
    form: {
      description:
        'To reset your password, please enter the email used during registration, make sure the email is active and we will send you a link to change your new password!',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      resetButton: 'Reset Password',
      emailError:
        'We did not find the email you entered, please check the email you used for your first registration.',
    },
    success: {
      title: 'Email Sent',
      message:
        'We have sent a link to create a new password to your email address, please open your email and follow the instructions in your email!',
      backButton: 'Back',
    },
    failed: {
      title: 'Failed to Send Email',
      message: 'Email not found, please check the email you used for your first registration.',
      backButton: 'Back',
    },
  },
  reset: {
    title: 'Enter New password',
    description:
      'Make sure your new password is strong and contains a combination of numbers, upper and lower case letters and a combination of characters!',
    form: {
      enterNewPassword: 'Enter New Password',
      confirmNewPassword: 'Confirm New Password',
      confirm: 'Confirm',
    },
  },
  setNewPassword: {
    title: 'Enter New Password',
    form: {
      description:
        'Make sure your new password is strong and contains a combination of numbers, upper and lower case letters and a combination of characters!',
      enterNewPassword: 'Enter New Password',
      confirmNewPassword: 'Confirm New Password',
      passwordPlaceholder: 'Password',
      confirm: 'Confirm',
    },
    success: {
      title: 'Success!',
      message: 'You have just changed your password, please log in again using the new password!',
      loginButton: 'login',
    },
  },
}
