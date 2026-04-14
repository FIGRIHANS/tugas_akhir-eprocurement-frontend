import invoiceApi from '@/core/utils/invoiceApi'
import type { ResponseData } from './types/api'

// --- Interfaces for BPU ---

export interface BpuDokReferensi {
  dokReferensi: string
  nomorDokumen: string
  tanggal_Dokumen: string
}

export interface BpuDataDetil {
  sertifikatInsentifDipotong: string
  nomorSertifikatInsentif: string
  kodeObjekPajak: string
  pasalPPh: string
  statusPPh: string
  dpp: number | string
  tarif: number | string
  pphDipotong: number | string
  kap: string
  kjs: string
  dokReferensi: BpuDokReferensi[]
  metodePembayaranBendahara: string
  nomorSP2D: string
}

export interface BpuCreatePayload {
  invoiceId: number | string
  npwpPemotong: string
  idTku: string
  revNo: number
  masaPajak: string
  tahunPajak: string
  fgNpwpNik: string | boolean
  npwp: string
  nik: string
  nama: string
  fgJnsBupot: 'BPU'
  dataDetilBpu: BpuDataDetil
  tglPemotongan: string // Format DDMMYYYY
  glAccount: string
}

export interface BpuContent {
  id: number // Internal Database ID
  pxId: string // Pajak Express Logic ID (what px-internal expects as "id")
  idBupot: string | null
  nomorBuktiPotong: string | null
  noBupot: string | null
  status: string | null
  fgStatus: string | null
  errorMsg: string | null
  tahunPajak?: string
  masaPajak?: string
  namaPenerima?: string
  nama?: string
  name?: string
  npwpPenerima?: string
  npwp?: string
  dpp?: number
  tarif?: number
  pphDipotong?: number
  kodeObjekPajak?: string
  tglPemotongan?: string
  alamatPenerima?: string
  dokReferensi?: BpuDokReferensi[]
  pasalPPh?: string
  statusPPh?: string
  idTku?: string
  kap?: string
  kjs?: string
  glAccount?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface BpuListResponse {
  items: BpuContent[]
  page: number
  limit: number
  total: number
}

export interface BpuUploadPayload {
  id: string // pxId
  npwpNikPenandatangan: string
  passphrase?: string
}

export interface BpuVerifyPayload {
  id: string // pxId
  npwpPemotong: string
  tahunPajak: string
  noBupot: string
  idBupot: string
  fgJnsBupot: 'BPU'
}

export interface BpuBatalPayload {
  id: string // pxId
  tglPembatalan: string // Format DDMMYYYY
  npwpNikPenandatangan: string
}

export interface BpuDeletePayload {
  id: string // pxId
}

export interface BpuQueryParams {
  npwpPemotong: string
  page?: number
  limit?: number
  search?: string
}

// --- Service Implementation ---

const BpuService = {
  async getList(params: BpuQueryParams): Promise<ResponseData<BpuListResponse>> {
    const response = await invoiceApi.get<ResponseData<BpuListResponse>>('/tax/bpu', { params })
    return response.data
  },

  async create(payload: BpuCreatePayload): Promise<ResponseData<BpuContent>> {
    const response = await invoiceApi.post<ResponseData<BpuContent>>('/tax/bpu', payload)
    return response.data
  },

  async upload(payload: { id: string; npwpNikPenandatangan: string; passphrase?: string }): Promise<ResponseData<unknown>> {
    const response = await invoiceApi.post<ResponseData<unknown>>('/tax/bpu/upload', payload)
    return response.data
  },

  async deleteDraft(payload: { id: string }): Promise<ResponseData<unknown>> {
    const response = await invoiceApi.post<ResponseData<unknown>>(
      '/tax/bpu/delete',
      payload
    )
    return response.data
  },

  async batalkan(payload: {
    id: string
    tglPembatalan: string
    npwpNikPenandatangan: string
  }): Promise<ResponseData<unknown>> {
    const response = await invoiceApi.post<ResponseData<unknown>>(
      '/tax/bpu/batal',
      payload
    )
    return response.data
  },

  async verify(payload: {
    id: string
    npwpPemotong: string
    tahunPajak: string
    noBupot?: string
    idBupot?: string
    fgJnsBupot: string
  }): Promise<ResponseData<unknown>> {
    const response = await invoiceApi.post<ResponseData<unknown>>(
      '/tax/bpu/verify',
      payload
    )
    return response.data
  },

  async getDetail(id: string, npwpPemotong: string): Promise<ResponseData<BpuContent>> {
    // There is no direct detail endpoint, so we fetch the full list and find by internal ID.
    // We do NOT pass a search param because the search filters by name/bupot, not internal ID.
    const params = {
      npwpPemotong,
      page: 1,
      limit: 200, // Fetch enough records to guarantee finding the item
    }
    const response = await invoiceApi.get<ResponseData<BpuListResponse>>('/tax/bpu', { params })

    // Find the exact record by internal DB ID
    const content = response.data.result.content.items?.find(
      (i: BpuContent) => String(i.id) === String(id)
    ) || null

    return {
      ...response.data,
      result: {
        ...response.data.result,
        content: content as BpuContent
      }
    } as unknown as ResponseData<BpuContent>
  }
}

export default BpuService
