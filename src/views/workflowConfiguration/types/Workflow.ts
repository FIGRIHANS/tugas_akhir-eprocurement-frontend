interface BracketForm {
  bracketCode: string
  amountFrom: string
  companyCode: string
  amountTo: string
  bracketType: string
  currency: string
  level: string
}

interface AuthForm {
  authObjectGroup: string
  authObjectCode: string
  authObjectName: string
}

interface ProfileForm {
  profileGroupId: string
  approverGroupId: string
  profileName: string
  category: string
  profileId: string
  step: string
}

export type { BracketForm, AuthForm, ProfileForm }
