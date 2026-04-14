import invoiceApi from '@/core/utils/invoiceApi'
import type { ResponseData } from './types/api'

// --- Interfaces ---

export interface Pph21DokReferensi {
  dokReferensi: string
  nomorDokumen: string
  tanggal_Dokumen: string
}

export interface Pph21DataDetil {
  sertifikatInsentifDipotong: string
  nomorSertifikatInsentif?: string
  kodeObjekPajak: string
  pasalPPh: string
  statusPPh: string
  kap: string
  kjs: string
  penghasilanKotorSebelumnya: number
  penghasilanKotor: number
  tarif: number
  pphDipotong: number
  NormaPenghasilan: number
  dokReferensi: Pph21DokReferensi[]
}

export interface Pph21CreatePayload {
  invoiceId?: number
  npwpPemotong: string
  idTku?: string
  masaPajak?: string
  tahunPajak?: string
  revNo?: number
  fgTransaction?: string
  fgNpwpNik: boolean
  npwp: string
  nik?: string
  nama: string
  fgJnsBupot?: string
  dataDetilBp21: Pph21DataDetil
  tglPemotongan: string // Format DDMMYYYY
  feature?: string     // 'final' | 'tdkfinal'
  email?: string
  glAccount?: string
  noBupot?: string
  idBupot?: string
  id?: number
}

export interface Pph21Content {
  id: number            // Internal Database ID
  pxId: string          // Pajak Express PxId (internal_id)
  idBupot: string | null
  nomorBuktiPotong?: string | null  // BPU alias
  noBupot: string | null            // BPU alias
  nomorBupot?: string | null        // Actual DB field name → JSON: nomorBupot
  status: string | null
  fgStatus: string | null
  errorMsg: string | null           // BPU alias
  errorMessage?: string | null      // Actual DB field name → JSON: errorMessage
  tahunPajak?: string
  masaPajak?: string
  namaPenerima?: string
  nama?: string
  npwpPenerima?: string
  npwp?: string
  penghasilanKotor?: number
  penghasilanKotorSebelumnya?: number
  tarif?: number
  pphDipotong?: number
  kodeObjekPajak?: string
  tglPemotongan?: string
  pasalPPh?: string
  statusPPh?: string
  feature?: string
  idTku?: string
  kap?: string
  kjs?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Pph21ListResponse {
  items: Pph21Content[]
  page: number
  limit: number
  total: number
  feature?: string
}

export interface Pph21QueryParams {
  npwpPemotong: string
  page?: number
  limit?: number
  search?: string
  feature?: string // 'final' | 'tdkfinal'
}

// --- Service ---

const Pph21Service = {
  async getList(params: Pph21QueryParams): Promise<ResponseData<Pph21ListResponse>> {
    const response = await invoiceApi.get<ResponseData<Pph21ListResponse>>('/tax/pph21', { params })
    return response.data
  },

  async create(payload: Pph21CreatePayload): Promise<ResponseData<Pph21Content>> {
    const response = await invoiceApi.post<ResponseData<Pph21Content>>('/tax/pph21', payload)
    return response.data
  },

  async upload(payload: {
    id: string | number
    npwpNikPenandatangan: string
    passphrase?: string
  }): Promise<ResponseData<unknown>> {
    const npwpPemotong = '1091031210912281'
    const response = await invoiceApi.post<ResponseData<unknown>>(
      `/tax/pph21/upload?npwpPemotong=${npwpPemotong}`,
      { ...payload, id: Number(payload.id) }  // Backend expects Int32
    )
    return response.data
  },

  async deleteDraft(payload: { id: string | number }): Promise<ResponseData<unknown>> {
    const npwpPemotong = '1091031210912281'
    const response = await invoiceApi.post<ResponseData<unknown>>(
      `/tax/pph21/delete?npwpPemotong=${npwpPemotong}`,
      { ...payload, id: Number(payload.id) }  // Backend expects Int32
    )
    return response.data
  },

  async batalkan(payload: {
    id: string | number
    tglPembatalan: string
    npwpNikPenandatangan: string
  }): Promise<ResponseData<unknown>> {
    const npwpPemotong = '1091031210912281'
    const response = await invoiceApi.post<ResponseData<unknown>>(
      `/tax/pph21/batal?npwpPemotong=${npwpPemotong}`,
      { ...payload, id: String(payload.id) }  // Backend Pph21CancelRequestDto.id is string
    )
    return response.data
  },

  async verify(payload: {
    id: string | number
    npwpPemotong?: string
    feature?: string
  }): Promise<ResponseData<unknown>> {
    const response = await invoiceApi.post<ResponseData<unknown>>('/tax/pph21/verify', {
      id: String(payload.id),  // Backend Pph21VerifyRequestDto.id is string
      npwpPemotong: payload.npwpPemotong || '1091031210912281',
      feature: payload.feature || 'tdkfinal',
    })
    return response.data
  },

  async getDetail(id: string): Promise<ResponseData<Pph21Content>> {
    // No direct detail endpoint — fetch list and find by internal DB ID
    const params: Pph21QueryParams = {
      npwpPemotong: '1091031210912281',
      page: 1,
      limit: 200,
    }
    const response = await invoiceApi.get<ResponseData<Pph21ListResponse>>('/tax/pph21', { params })
    const items = response.data?.result?.content?.items || []
    const found = items.find((i: Pph21Content) => String(i.id) === String(id)) || null

    return {
      ...response.data,
      result: {
        ...response.data.result,
        content: found as Pph21Content,
      },
    } as unknown as ResponseData<Pph21Content>
  },
}

export default Pph21Service
