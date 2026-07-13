export interface GrInvoiceVendorNoInput {
  vendorName?: string | null
  grDocumentDate?: string | null
  invoiceVendorNo?: string | null
}

/** Draft Invoice Vendor No — same formula as GoodReceiptInvoicePrint PDF. */
export function generateDraftInvoiceVendorNo(
  vendorName?: string | null,
  grDocumentDate?: string | null,
): string {
  const vName = vendorName || 'VND'
  const vAbbr =
    vName
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase() || 'VND'

  const dateStr = grDocumentDate || new Date().toISOString()
  const d = new Date(dateStr)
  const yy = d.getFullYear().toString().substring(2, 4)
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')

  const hashInput = vName + dateStr
  let hash = 0
  for (let i = 0; i < hashInput.length; i++) {
    hash = (hash << 5) - hash + hashInput.charCodeAt(i)
    hash |= 0
  }
  const seq = String(Math.abs(hash) % 1000).padStart(3, '0')

  return `INV/${vAbbr}/${yy}${mm}/${seq}`
}

/**
 * Resolve display Invoice Vendor No (list/detail):
 * - Official: InvoiceHeader.DocumentNo from backend
 * - Draft: generated PDF formula + "(Draft)" suffix
 */
export function resolveDisplayInvoiceVendorNo(input: GrInvoiceVendorNoInput): string {
  const official = input.invoiceVendorNo?.trim()
  if (official) return official
  return `${generateDraftInvoiceVendorNo(input.vendorName, input.grDocumentDate)} (Draft)`
}

/** Resolve for PDF print — no "(Draft)" suffix, same as previous print behaviour. */
export function resolvePrintInvoiceVendorNo(input: GrInvoiceVendorNoInput): string {
  const official = input.invoiceVendorNo?.trim()
  if (official) return official
  return generateDraftInvoiceVendorNo(input.vendorName, input.grDocumentDate)
}

/** True when backend has provided official DocumentNo. */
export function hasOfficialInvoiceVendorNo(invoiceVendorNo?: string | null): boolean {
  return !!invoiceVendorNo?.trim()
}
