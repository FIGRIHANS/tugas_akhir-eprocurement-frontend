import { extractGrFromText } from '@/core/utils/grDocumentNo'
import {
  dedupePoGrLines,
  getPoGrLineKey,
  hasCompletePoGrLines,
} from '@/core/utils/poGrDedup'
import invoiceApi from '@/core/utils/invoiceApi'
import GoodsReceiptService, {
  type GoodsReceiptDetailContentDto,
  type GoodsReceiptDetailParams,
} from '@/services/goodsReceipt.service'
import type { PoGrItemTypes } from '@/stores/views/invoice/types/submission'
import type { formTypes } from '@/views/invoice/types/invoiceAddWrapper'
import type { itemsPoGrType } from '@/views/invoice/types/invoicePoGr'

export type PoGrAutofillOptions = {
  grDocumentNo?: string | null
  /** @deprecated use overwriteExisting for manual refresh */
  force?: boolean
  userModified?: boolean
  /** Explicit user search — may replace existing PO/GR rows */
  overwriteExisting?: boolean
}

type GrAccessProfile = {
  vendorCode?: string | null
  sapCode?: string | null
  companyCode?: string | null
  profileId?: number | null
}

export const resolvePoGrCompanyCode = (
  form: Pick<formTypes, 'companyCode'>,
  profile?: GrAccessProfile | null,
): string => {
  const fromForm = String(form.companyCode ?? '').trim()
  if (fromForm) return fromForm

  return String(profile?.companyCode ?? '').trim()
}

const seedFormCompanyCodeFromProfile = (
  form: Pick<formTypes, 'companyCode'>,
  profile?: GrAccessProfile | null,
) => {
  if (String(form.companyCode ?? '').trim()) return

  const fromProfile = resolvePoGrCompanyCode(form, profile)
  if (fromProfile) form.companyCode = fromProfile
}

const mapInvoicePoGrApiItem = (apiItem: Record<string, string | number | undefined>): PoGrItemTypes => ({
  poNo: (apiItem.poNo as string) || (apiItem.poNumber as string) || '',
  poItem: (apiItem.poItem as number) || 0,
  grDocumentNo: (apiItem.grDocumentNo as string) || '',
  grDocumentItem: (apiItem.grDocumentItem as number) || 0,
  grDocumentDate: (apiItem.grDocumentDate as string) || '',
  taxCode: (apiItem.taxCode as string) || '',
  quantity: (apiItem.quantity as number) || 0,
  unit: (apiItem.uom as string) || (apiItem.unit as string) || '',
  uom: (apiItem.uom as string) || (apiItem.unit as string) || '',
  itemText: (apiItem.itemText as string) || (apiItem.materialDescription as string) || '',
  material: (apiItem.material as string) || (apiItem.sku as string) || '',
  materialDescription: (apiItem.materialDescription as string) || (apiItem.itemName as string) || '',
  currency: (apiItem.currency as string) || '',
  conditionType: (apiItem.conditionType as string) || '',
  conditionTypeDesc: (apiItem.conditionTypeDesc as string) || '',
  qcStatus: (apiItem.qcStatus as string) || '',
  postingDate: (apiItem.postingDate as string) || '',
  enteredOn: (apiItem.enteredOn as string) || '',
  purchasingOrg: (apiItem.purchasingOrg as string) || '',
  department: (apiItem.department as string) || (apiItem.costCenter as string) || '',
  currencyLC: (apiItem.currencyLC as string) || '',
  currencyTC: (apiItem.currencyTC as string) || '',
  itemAmountLC: (apiItem.itemAmountLC as number) ?? (apiItem.itemAmount as number) ?? 0,
  itemAmountTC: (apiItem.itemAmountTC as number) ?? (apiItem.itemAmount as number) ?? 0,
  itemAmount: (apiItem.itemAmount as number) ?? 0,
  deliveryOrderNo: (apiItem.deliveryOrderNo as string) || '',
})

export const resolveGrAccessVendorCode = (
  form: Pick<formTypes, 'vendorId'>,
  profile?: GrAccessProfile | null,
): string | null => {
  const formVendor = String(form.vendorId ?? '').trim()
  if (formVendor) return formVendor

  const profileVendor = String(profile?.vendorCode ?? profile?.sapCode ?? '').trim()
  return profileVendor || null
}

const fetchPoGrLinesFromInvoiceEndpoint = async (
  grDocumentNo: string,
  form: Pick<formTypes, 'vendorId' | 'companyCode'>,
  profile?: GrAccessProfile | null,
): Promise<PoGrItemTypes[]> => {
  const companyCode = resolvePoGrCompanyCode(form, profile)
  if (!companyCode) return []

  const vendorCode = resolveGrAccessVendorCode(form, profile) || form.vendorId || null
  const resp = await invoiceApi.get('/invoice/po-gr', {
    params: {
      poNumber: grDocumentNo.trim(),
      companyCode,
      vendorCode,
    },
  })

  const content = resp.data?.result?.content
  if (!Array.isArray(content) || content.length === 0) return []

  return content.map((item: Record<string, string | number | undefined>) =>
    mapInvoicePoGrApiItem(item),
  )
}

const buildGoodsReceiptDetailParams = (
  grDocumentNo: string,
  accessVendorCode?: string | null,
  profile?: GrAccessProfile | null,
): GoodsReceiptDetailParams => {
  const params: GoodsReceiptDetailParams = { grDocumentNo: grDocumentNo.trim() }
  const profileVendorCode = String(profile?.vendorCode ?? '').trim()
  const code = accessVendorCode?.trim() || profileVendorCode

  if (profileVendorCode) {
    if (profile?.profileId != null) params.accessVendorId = profile.profileId
    params.accessVendorCode = profileVendorCode
  } else if (code) {
    params.accessVendorCode = code
  }

  return params
}

export const mapGoodsReceiptDetailToPoGrItems = (
  detail: GoodsReceiptDetailContentDto,
): PoGrItemTypes[] => {
  const cur = detail.currency || 'IDR'
  const headerGrDate =
    typeof detail.grDocumentDate === 'string'
      ? detail.grDocumentDate
      : detail.grDocumentDate != null
        ? String(detail.grDocumentDate)
        : ''

  return (detail.items || []).map((line) => {
    const qty = Number(line.qtyReceivedGood ?? 0)
    const unitPrice = Number(line.unitPrice ?? 0)
    let amount = line.lineAmount != null ? Number(line.lineAmount) : NaN
    if (!Number.isFinite(amount)) {
      amount = qty * unitPrice
    }

    const grDt =
      typeof line.grDocumentDate === 'string'
        ? line.grDocumentDate
        : line.grDocumentDate != null
          ? String(line.grDocumentDate)
          : headerGrDate

    return {
      poNo: line.poNumber || detail.poNumber || '',
      poItem: line.grDocumentItem ?? 0,
      grDocumentNo: line.grDocumentNo || detail.grDocumentNo || '',
      grDocumentItem: line.grDocumentItem ?? 0,
      grDocumentDate: grDt,
      taxCode: '',
      quantity: qty,
      unit: line.uom || '',
      uom: line.uom || '',
      itemText: line.itemName || '',
      material: line.sku || '',
      materialDescription: line.itemName || '',
      currency: cur,
      conditionType: line.conditionType || '',
      conditionTypeDesc: '',
      qcStatus: detail.hasDiscrepancy ? 'Discrepancy' : '-',
      postingDate: '',
      enteredOn: '',
      purchasingOrg: '',
      department: '',
      currencyLC: cur,
      currencyTC: cur,
      itemAmountLC: amount,
      itemAmountTC: amount,
      itemAmount: amount,
      deliveryOrderNo: detail.deliveryOrderNumber || '',
    }
  })
}

const fetchGoodsReceiptDetail = async (
  grDocumentNo: string,
  accessVendorCode?: string | null,
  profile?: GrAccessProfile | null,
) => {
  try {
    return await GoodsReceiptService.getDetail(
      buildGoodsReceiptDetailParams(grDocumentNo, accessVendorCode, profile),
    )
  } catch (error) {
    if (!accessVendorCode?.trim() && !profile?.vendorCode?.trim()) throw error
    return GoodsReceiptService.getDetail({ grDocumentNo: grDocumentNo.trim() })
  }
}

export const fetchPoGrLinesFromGrDocumentNo = async (
  grDocumentNo: string,
  form: Pick<formTypes, 'vendorId' | 'companyCode'>,
  profile?: GrAccessProfile | null,
): Promise<PoGrItemTypes[]> => {
  const grNo = grDocumentNo.trim()
  const accessVendorCode = resolveGrAccessVendorCode(form, profile)

  const detail = await fetchGoodsReceiptDetail(grNo, accessVendorCode, profile)
  return mapGoodsReceiptDetailToPoGrItems(detail)
}

export const applyPoGrLinesToForm = (form: formTypes, items: PoGrItemTypes[]) => {
  const existingByKey = new Map(form.invoicePoGr.map((row) => [getPoGrLineKey(row), row]))
  const uniqueItems = dedupePoGrLines(items || [])

  form.invoicePoGr = uniqueItems.map((item) => {
    const draft = {
      poNo: item.poNo || '',
      poItem: item.poItem || 0,
      grDocumentNo: item.grDocumentNo || '',
      grDocumentItem: item.grDocumentItem || 0,
    }
    const existing = existingByKey.get(getPoGrLineKey(draft))

    return {
      id: existing?.id && Number(existing.id) > 0 ? existing.id : 0,
      poNo: draft.poNo,
      poItem: draft.poItem,
      grDocumentNo: draft.grDocumentNo,
      grDocumentItem: draft.grDocumentItem,
      grDocumentDate: item.grDocumentDate || existing?.grDocumentDate || '',
      taxCode: existing?.taxCode || item.taxCode || '',
      vatAmount: existing?.vatAmount ?? 0,
      currencyLC: item.currencyLC || form.currency,
      currencyTC: item.currencyTC || form.currency,
      itemAmountLC: item.itemAmountLC ?? item.itemAmount ?? existing?.itemAmountLC ?? 0,
      itemAmountTC: item.itemAmountTC ?? item.itemAmount ?? existing?.itemAmountTC ?? 0,
      quantity: item.quantity || existing?.quantity || 0,
      uom: item.uom || existing?.uom || '',
      itemText: item.itemText || item.materialDescription || existing?.itemText || '',
      currency: item.currency || form.currency || 'IDR',
      conditionType: existing?.conditionType || item.conditionType || '',
      conditionTypeDesc: existing?.conditionTypeDesc || item.conditionTypeDesc || '',
      qcStatus: item.qcStatus || existing?.qcStatus || '',
      postingDate: item.postingDate || existing?.postingDate || '',
      enteredOn: item.enteredOn || existing?.enteredOn || '',
      purchasingOrg: item.purchasingOrg || existing?.purchasingOrg || '',
      department: existing?.department || item.department || '',
      whtType: existing?.whtType || '',
      whtCode: existing?.whtCode || '',
      whtBaseAmount: existing?.whtBaseAmount ?? (item.itemAmountLC ?? item.itemAmount ?? 0),
      whtAmount: existing?.whtAmount ?? 0,
      poNoError: false,
      poItemError: false,
      departementError: false,
      deliveryOrderNo: item.deliveryOrderNo || existing?.deliveryOrderNo || '',
      isEdit: false,
    } as itemsPoGrType
  })
}

export const resolveGrDocumentNoForAutofill = (
  form: formTypes,
  explicitGrNo?: string | null,
): string => {
  const explicit = extractGrFromText(explicitGrNo || '')
  if (explicit) return explicit

  const fromPoGr = extractGrFromText(form.invoicePoGr?.[0]?.grDocumentNo?.toString() || '')
  if (fromPoGr) return fromPoGr

  return extractGrFromText(form.invoiceVendorNo) || ''
}

export const shouldSkipPoGrAutofill = (
  form: formTypes,
  options: PoGrAutofillOptions = {},
): boolean => {
  if (form.invoiceDp === '9012' || form.invoiceType === '902') return true

  const overwriteExisting = options.overwriteExisting || options.force === true
  if (options.userModified && !overwriteExisting) return true

  const grNo = resolveGrDocumentNoForAutofill(form, options.grDocumentNo)
  if (!grNo) return true

  // Only skip when table already has full PO/GR line data (not poNo-only stubs from backend/FTP).
  if (hasCompletePoGrLines(form.invoicePoGr) && !overwriteExisting) return true

  return false
}

export const runInvoicePoGrAutofill = async (
  form: formTypes,
  options: PoGrAutofillOptions = {},
  profile?: GrAccessProfile | null,
): Promise<{ grDocumentNo: string | null; error: string | null }> => {
  if (shouldSkipPoGrAutofill(form, options)) {
    return { grDocumentNo: null, error: null }
  }

  const grNo = resolveGrDocumentNoForAutofill(form, options.grDocumentNo)
  if (!grNo) {
    return { grDocumentNo: null, error: null }
  }

  seedFormCompanyCodeFromProfile(form, profile)

  try {
    const mapped = await fetchPoGrLinesFromGrDocumentNo(grNo, form, profile)
    if (!mapped.length) {
      return { grDocumentNo: grNo, error: 'No GR line items found for this GR Document No.' }
    }

    applyPoGrLinesToForm(form, mapped)
    return { grDocumentNo: grNo, error: null }
  } catch (error) {
    console.error('Error auto-fetching GR for invoice PO & GR:', error)
    return {
      grDocumentNo: grNo,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to load GR lines. Please check GR Document No.',
    }
  }
}
