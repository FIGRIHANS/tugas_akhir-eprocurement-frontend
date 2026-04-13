import invoiceApi from '@/core/utils/invoiceApi'
import type { ResponseData } from './types/api'

export interface Pph21Content {
  id: number // Internal Database ID
  pxId: string // Pajak Express Logic ID
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
  npwpPenerima?: string
  npwp?: string
  dpp?: number
  tarif?: number
  pphDipotong?: number
  kodeObjekPajak?: string
  tglPemotongan?: string
  pasalPPh?: string
  fgPPh21Final?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Pph21ListResponse {
  title: string
  statusCode: number
  result: {
    message: string
    isError: boolean
    content: {
      items: Pph21Content[]
      total: number
    }
  }
}

export interface Pph21CreatePayload {
  invoiceId: number
  npwpPemotong: string
  fgNpwpNik: boolean
  npwp: string
  nama: string
  fgJnsBupot: string
  tglPemotongan: string
  dataDetilPph21: {
    kodeObjekPajak: string
    pasalPPh: string
    dpp: number
    tarif: number
    pphDipotong: number
    dokReferensi: Array<{
      dokReferensi: string
      nomorDokumen: string
      tanggal_Dokumen: string
    }>
  }
}

const Pph21Service = {
  getList: async (params: { npwpPemotong: string; page: number; limit: number; search?: string }) => {
    const res = await invoiceApi.get<Pph21ListResponse>('/tax/pph21', { params })
    return res.data
  },

  create: async (payload: Pph21CreatePayload) => {
    const res = await invoiceApi.post('/tax/pph21', payload)
    return res.data
  },

  upload: async (payload: { id: string; npwpNikPenandatangan: string; passphrase?: string }) => {
    const res = await invoiceApi.post(`/tax/pph21/upload`, payload)
    return res.data
  },

  deleteDraft: async (payload: { id: string }) => {
    const res = await invoiceApi.post(`/tax/pph21/delete`, payload)
    return res.data
  },

  batalkan: async (payload: { id: string; tglPembatalan: string; npwpNikPenandatangan: string }) => {
    const res = await invoiceApi.post(`/tax/pph21/batal`, payload)
    return res.data
  },

  verify: async (payload: {
    id: string
    npwpPemotong: string
    tahunPajak: string
    noBupot?: string
    idBupot?: string
    fgJnsBupot: string
  }): Promise<unknown> => {
    const res = await invoiceApi.post('/tax/pph21/verify', payload)
    return res.data
  },

  getDetail: async (id: string): Promise<ResponseData<Pph21Content>> => {
    const res = await invoiceApi.get<ResponseData<Pph21Content>>(`/tax/pph21/${id}`)
    return res.data
  }
}

export default Pph21Service
