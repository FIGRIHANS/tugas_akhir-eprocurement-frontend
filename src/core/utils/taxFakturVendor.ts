import type { invoiceOcrData } from '@/views/invoice/types/invoiceOcrData'

const SECTION_LABELS = [
  'pengusaha kena pajak',
  'pembeli barang kena pajak / penerima jasa kena pajak',
  'pembeli barang kena pajak',
  'penerima jasa kena pajak',
  'faktur pajak',
  'nomor seri faktur pajak',
]

export const isTaxFakturSectionLabel = (value?: string | null): boolean => {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return false
  return SECTION_LABELS.some((label) => normalized === label || normalized.startsWith(label))
}

const digitsOnly = (value?: string | null) => String(value || '').replace(/\D/g, '')

/** Default TKU pusat: NPWP 15–16 digit + suffix 000000 (contoh e-Faktur). */
export const deriveTkuFromNpwp = (npwp?: string | null): string => {
  const digits = digitsOnly(npwp)
  if (digits.length < 15 || digits.length > 16) return ''
  return `${digits}000000`
}

export const normalizeTaxFakturVendorSupplier = (
  data: Partial<invoiceOcrData> & Record<string, unknown>,
): string => {
  const altKeys = [
    'idTku',
    'tku',
    'tkuId',
    'nama',
    'namaVendor',
    'namaPenjual',
    'sellerName',
    'supplierName',
    'vendorName',
    'vendorSupplier',
  ]

  for (const key of altKeys) {
    const value = String(data[key] || '').trim()
    if (value && !isTaxFakturSectionLabel(value)) return value
  }

  const current = String(data.vendorSupplier || '').trim()
  if (current && !isTaxFakturSectionLabel(current)) return current

  const fromNpwp = deriveTkuFromNpwp(String(data.npwpSupplier || data.npwp || ''))
  if (fromNpwp) return fromNpwp

  const rawText = String(data.rawText || data.text || data.ocrText || data.fullText || '')
  if (rawText) {
    const match = rawText.match(
      /Pengusaha\s+Kena\s+Pajak[\s\S]{0,500}?Nama\s*[:：]\s*([^\n\r]+)/i,
    )
    const nama = match?.[1]?.trim()
    if (nama && !isTaxFakturSectionLabel(nama)) return nama
  }

  return ''
}

export const normalizeTaxFakturScanResult = <T extends Partial<invoiceOcrData>>(
  data: T & Record<string, unknown>,
): T => {
  const vendorSupplier = normalizeTaxFakturVendorSupplier(data)
  if (!vendorSupplier) return data
  return { ...data, vendorSupplier }
}
