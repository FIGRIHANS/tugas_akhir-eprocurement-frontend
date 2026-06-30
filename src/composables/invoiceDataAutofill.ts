import type { VendorTypes } from '@/stores/master-data/types/invoiceMasterData'
import type { formTypes } from '@/views/invoice/types/invoiceAddWrapper'
import { resolveCompanyCodeValue } from '@/views/ftpInvoiceIntegration/types/ftpUploadService'

type UserProfile = {
  sapCode?: string
  vendorName?: string
  companyCode?: string
}

const hasPaymentSelection = (form: formTypes) =>
  !!(form.bankKeyId?.trim() || form.bankAccountNumber?.trim())

const applyPaymentFromVendor = (form: formTypes, payments: VendorTypes['payment']) => {
  if (!payments?.length) return

  const selected = form.bankAccountNumber
    ? payments.find((item) => item.accountNumber === form.bankAccountNumber)
    : payments.length === 1
      ? payments[0]
      : null

  if (!selected) return

  form.bankKeyId = selected.bankKey
  form.bankNameId = selected.bankName
  form.beneficiaryName = selected.beneficiaryName
  form.bankAccountNumber = selected.accountNumber
  form.bankCountryCode = selected.bankCountryCode
}

const resolveVendorByReference = (
  vendorList: VendorTypes[],
  reference?: string | null,
): VendorTypes | undefined => {
  const key = String(reference || '').trim()
  if (!key) return undefined

  return vendorList.find(
    (item) => item.sapCode === key || item.vendorId === key || item.vendorCode === key,
  )
}

export const findVendorFromList = resolveVendorByReference

const applyCompanyNameFromList = (
  form: formTypes,
  companyList: Array<{ code: string; name: string }>,
) => {
  const match = companyList.find((item) => item.code === form.companyCode)
  if (!match) return

  const parts = match.name.split(' - ')
  form.companyName = parts.length > 1 ? parts[parts.length - 1].trim() : match.name
}

/** Fill company code from profile or single company option when still empty. */
export const ensureFormCompanyCode = (
  form: formTypes,
  companyList: Array<{ code: string; name: string }>,
  profile?: UserProfile | null,
) => {
  if (form.companyCode?.trim()) return

  const profileCode = profile?.companyCode?.trim()
  if (profileCode) {
    form.companyCode = resolveCompanyCodeValue(profileCode, companyList) || profileCode
    applyCompanyNameFromList(form, companyList)
    return
  }

  if (companyList.length === 1) {
    form.companyCode = companyList[0].code
    applyCompanyNameFromList(form, companyList)
  }
}

/** Restore Invoice Data tab (General Data + Payment Information) from vendor master. */
export const syncInvoiceDataTabFromVendorMaster = (
  form: formTypes,
  vendorList: VendorTypes[],
  options?: {
    isVendor?: boolean
    profile?: UserProfile | null
    preservePayment?: boolean
  },
) => {
  if (!vendorList.length) return

  if (options?.isVendor && options.profile?.sapCode) {
    form.vendorId = options.profile.sapCode
    if (options.profile.vendorName) form.vendorName = options.profile.vendorName
  }

  if (!form.companyCode?.trim() && options?.profile?.companyCode?.trim()) {
    form.companyCode = options.profile.companyCode.trim()
  }

  const vendor = resolveVendorByReference(vendorList, form.vendorId || form.vendorName)
  if (!vendor) return

  form.vendorId = vendor.sapCode
  form.vendorName = vendor.vendorName
  form.npwp = vendor.npwp
  form.address = vendor.address

  if (!options?.preservePayment || !hasPaymentSelection(form)) {
    applyPaymentFromVendor(form, vendor.payment)
    return
  }

  if (form.bankAccountNumber) {
    applyPaymentFromVendor(form, vendor.payment)
  }
}
