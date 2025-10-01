import { general } from './general'
import { login } from './login'
import { registration } from './registration'
import { vendorProfile } from './vendorProfile'
import { companyDeed } from './companyDeed'
import { administrativeData } from './administrativeData'
import { businessLicense } from './businessLicense'
import { paymentInfo } from './paymentInfo'
import { equipmentData } from './equipmentData'
import { experienceData } from './experienceData'
import { expertPersonnelData } from './expertPersonnelData'
import { otherDocumentData } from './otherDocumentData'
import { companyInformation } from './companyInformation'
import vendor from './vendor'
import vendorVerification from './vendorVerification'

export default {
  general: general,
  login: login,
  registration: registration,
  vendorProfile: vendorProfile,
  companyDeed: companyDeed,
  administrativeData: administrativeData,
  businessLicense: businessLicense,
  paymentInfo: paymentInfo,
  equipmentData: equipmentData,
  experienceData: experienceData,
  expertPersonnelData: expertPersonnelData,
  otherDocumentData: otherDocumentData,
  companyInformation: companyInformation,
  vendor,
  vendorVerification,
}
