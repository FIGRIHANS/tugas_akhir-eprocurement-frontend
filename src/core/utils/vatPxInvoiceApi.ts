import vatApi from '@/core/utils/vatApi'

/** Aligned with Invoice API `api/Vat/vat-in/*` (ASP.NET deserialization is case-insensitive). */
export interface VatInKonfirmasiFakturMasukanDto {
  konfirmasiPengkreditan: string
  nomorFaktur: string
  masaPajak: string
  tahunPajak: string
}

export interface VatInUploadRequestDto {
  fgPermintaan?: number
  npwpPembeli?: string
  konfirmasiFakturMasukan: VatInKonfirmasiFakturMasukanDto
  userId?: string
  kanal?: string
}

/**
 * Extended upload body — wraps the core payload with optional metadata
 * so the backend can persist the record to Tax_VatTransaction DB and show it
 * in the VAT Reconciliation list (same pattern as BPU/WHT).
 */
export interface VatUploadWithMetaRequest {
  /** Core Pajak Express payload (required). */
  payload: VatInUploadRequestDto
  /** Internal InvoiceHeader.Id — 0 if submitted manually. */
  invoiceId?: number
  npwpPenjual?: string
  namaVendor?: string
  tanggalFaktur?: string   // ISO 8601 date string, e.g. "2026-05-19"
  dpp?: number
  ppn?: number
}

/** IF_TXR_015 upload — confirm crediting (fgPermintaan = 2).
 *  Pass the full VatUploadWithMetaRequest so amounts and vendor info are saved. */
export function postVatInUpload(body: VatUploadWithMetaRequest) {
  return vatApi.post('/vat/vat-in/upload', body)
}

/** IF_TXR_015/prepopulated */
export function postVatInPrepopulated(body: Record<string, unknown>) {
  return vatApi.post('/vat/vat-in/prepopulated', body)
}

/** IF_TXR_015/verify */
export function postVatInVerify015(body: Record<string, unknown>) {
  return vatApi.post('/vat/vat-in/verify', body)
}

/** IF_TXR_063 */
export function postVatInVerifyCoretax063(body: Record<string, unknown>) {
  return vatApi.post('/vat/vat-in/verify-coretax', body)
}

/** IF_TXR_063/prepop */
export function postVatInVerifyCoretax063Prepop(body: Record<string, unknown>) {
  return vatApi.post('/vat/vat-in/prepop/verify-coretax', body)
}

/** IF_TXR_062 Replace/Cancel */
export function postVatInReplaceCancel(body: Record<string, unknown>) {
  return vatApi.post('/vat/vat-in/replace-cancel', body)
}

/** IF_TXR_CETAK Download PDF */
export function postVatInDownloadPdf(body: { url: string }) {
  return vatApi.post('/vat/vat-in/download-pdf', body)
}

// ==========================================
// VAT OUT (PAJAK KELUARAN) ENDPOINTS
// ==========================================

export function postVatOutCreate(vendorNpwp: string, body: any) {
  return vatApi.post(`/vat/vat-out/create?vendorNpwp=${vendorNpwp}`, body)
}

export function getVatOutList(vendorNpwp: string, params: any) {
  return vatApi.get(`/vat/vat-out/list`, {
    params: { vendorNpwp, ...params }
  })
}

export function postVatOutUpload(vendorNpwp: string, body: any) {
  return vatApi.post(`/vat/vat-out/upload?vendorNpwp=${vendorNpwp}`, body)
}

export function postVatOutCancel(vendorNpwp: string, body: any) {
  return vatApi.post(`/vat/vat-out/cancel?vendorNpwp=${vendorNpwp}`, body)
}

export function postVatOutDelete(vendorNpwp: string, body: any) {
  return vatApi.post(`/vat/vat-out/delete?vendorNpwp=${vendorNpwp}`, body)
}

