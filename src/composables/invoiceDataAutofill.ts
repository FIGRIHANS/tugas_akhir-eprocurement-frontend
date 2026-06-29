import type { VendorTypes } from '@/stores/master-data/types/invoiceMasterData'
import type { formTypes } from '@/views/invoice/types/invoiceAddWrapper'

type UserProfile = {
  sapCode?: string
  vendorName?: string
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
