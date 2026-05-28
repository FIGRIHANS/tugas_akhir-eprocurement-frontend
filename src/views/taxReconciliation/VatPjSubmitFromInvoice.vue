<template>
  <div class="pb-20">
    <Breadcrumb title="VAT — Pajak Express" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="space-y-6">
      <div class="flex gap-[24px] items-start">

        <!-- LEFT COLUMN: Form Data -->
        <div class="flex-1 space-y-6">
          
          <!-- Linked Invoice Info Card -->
          <div v-if="invoiceId" class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Linked Invoice Details</h3>
              <span
                :class="
                  route.query.poNumber || (invoiceNo && !invoiceNo.startsWith('NPO'))
                    ? 'badge badge-light-primary px-2 font-semibold text-xs'
                    : 'badge badge-light-warning px-2 font-semibold text-xs'
                "
              >
                {{ route.query.poNumber || (invoiceNo && !invoiceNo.startsWith('NPO')) ? 'PO' : 'Non-PO' }}
              </span>
            </div>
            <div class="card-body flex flex-col gap-[16px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">No. Invoice</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ invoiceNo || '—' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Vendor Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ vendorName || '—' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP Penjual (Invoice)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ vendorNpwp || '—' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">DPP (Tax Base)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ fmt(dppNum) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px] border-t border-gray-100 pt-4">
                <p class="font-normal text-sm font-semibold text-primary">VAT / PPN (Invoice)</p>
                <p class="font-bold text-base text-primary">{{ fmt(vatNum) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="card p-[20px] bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-900">
            <i class="ki-filled ki-information-2 text-amber-600 mr-1.5 text-base align-middle"></i>
            <strong>Manual Mode:</strong> No invoice linked. Please fill in the details below manually.
          </div>

          <!-- Section 1: Faktur & Pengkreditan -->
          <div class="card p-[20px]">
            <h3 class="text-lg font-semibold mb-[16px]">Faktur &amp; Pengkreditan</h3>
            <div class="flex flex-col gap-[8px]">

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Nomor Faktur Pajak</label>
                <div class="flex-1">
                  <input
                    v-model.trim="nomorFp"
                    type="text"
                    class="input w-full"
                    :placeholder="phNomorFp"
                    autocomplete="off"
                  />
                  <p class="mt-1 text-xs text-gray-400">Pastikan cocok dengan faktur di lingkungan sandbox Pajak Express.</p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Masa Pajak</label>
                <div class="flex gap-2 flex-1">
                  <select v-model="bulanIdx" class="select w-full" @change="syncMasaFromSelect">
                    <option v-for="b in bulanOptions" :key="b.v" :value="b.idx">{{ b.label }}</option>
                  </select>
                  <input
                    v-model.trim="masaPajakMm"
                    type="text"
                    maxlength="2"
                    class="input w-16 shrink-0 text-center"
                    :placeholder="phMasa"
                  />
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Tahun Pajak</label>
                <input v-model.trim="tahunPajak" type="text" maxlength="4" class="input flex-1" :placeholder="phTahun" />
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Konfirmasi Pengkreditan</label>
                <select v-model="konfirmasi" class="select flex-1">
                  <option value="CREDITED">CREDITED — Kredit masuk pajak pembeli</option>
                  <option value="UNCREDITED">UNCREDITED — Belum / tidak dikreditkan</option>
                  <option value="INVALID">INVALID — Faktur tidak berlaku / ditolak</option>
                </select>
              </div>

              <div class="flex items-start flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600 pt-1">NPWP Penjual</label>
                <div class="flex-1">
                  <label class="flex items-center gap-2.5 cursor-pointer mb-2">
                    <input v-model="includeNpwpPenjualPrepop" type="checkbox" class="checkbox checkbox-sm checkbox-primary" />
                    <span class="text-sm font-medium text-gray-700">Sertakan NPWP Penjual (default dari vendor invoice)</span>
                  </label>
                  <div v-if="includeNpwpPenjualPrepop" class="animate-in fade-in duration-200">
                    <input v-model.trim="npwpPenjual" type="text" class="input w-full" :placeholder="phNpwpPenjual" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Section 1B: Sandbox Shortcuts -->
          <div class="card p-[20px]">
            <h3 class="text-lg font-semibold mb-[4px] flex items-center gap-2">
              <i class="ki-filled ki-flash text-indigo-500"></i>
              Pintasan Faktur Sandbox Asli
            </h3>
            <p class="text-xs text-gray-500 mb-[12px]">
              Klik salah satu nomor faktur di bawah untuk mengisi form secara otomatis:
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="realFp in ['04002600000070403', '04002600000070397', '04002600000070396', '04002600000070395', '04002600000070402', '04002600000070420', '04002600000070401', '04002600000066118', '04002600000070400']"
                :key="realFp"
                type="button"
                class="btn btn-outline btn-primary btn-xs"
                @click="applyRealSandboxInvoice(realFp)"
              >
                {{ realFp }}
              </button>
              <button
                type="button"
                class="btn btn-success btn-xs font-bold text-white"
                @click="applyTodaySandboxTest"
              >
                <i class="ki-filled ki-flash text-xs mr-1"></i>
                Auto-Fill Hari Ini (Simulasi)
              </button>
            </div>
            <p class="text-[10px] text-gray-400 mt-3 leading-relaxed">
              * Akan mengatur Nomor Faktur, Masa = <code class="bg-gray-100 px-1 py-0.5 rounded">03</code>, Tahun = <code class="bg-gray-100 px-1 py-0.5 rounded">2026</code>, dan NPWP Penjual = <code class="bg-gray-100 px-1 py-0.5 rounded">{{ npwpPembeli || '1091031210969728' }}</code>.
            </p>
          </div>

          <!-- Section 2: Sandbox Context Override -->
          <div class="card p-[20px]">
            <h3 class="text-lg font-semibold mb-[16px]">Sandbox Context Override</h3>
            <div class="flex flex-col gap-[8px]">

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">NPWP Pembeli</label>
                <input v-model.trim="npwpPembeli" type="text" class="input flex-1" :placeholder="phNpwpPembeli" />
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">User ID / Signer</label>
                <input v-model.trim="userIdSigner" type="text" class="input flex-1" :placeholder="phUserId" />
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Kanal</label>
                <input v-model.trim="kanal" type="text" class="input flex-1" :placeholder="phKanal" />
              </div>

              <div class="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                <button type="button" class="btn btn-light btn-sm" @click="saveSandboxToStorage">
                  <i class="ki-filled ki-save-2 text-xs"></i>
                  Simpan Draft
                </button>
                <button type="button" class="btn btn-light btn-sm" @click="loadSandboxFromStorage">
                  <i class="ki-filled ki-folder-open text-xs"></i>
                  Muat Draft
                </button>
                <button type="button" class="btn btn-light btn-sm text-warning" @click="clearSandboxStorage">
                  <i class="ki-filled ki-arrows-circle text-xs"></i>
                  Reset Draft
                </button>
                <button type="button" class="btn btn-secondary btn-sm ml-auto" @click="autoFillSandboxData">
                  <i class="ki-filled ki-flash text-xs"></i>
                  Auto-Fill Sandbox Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Sticky Sidebar -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">

          <!-- Submit Action Card -->
          <div class="card h-fit">
            <div class="card-header py-[16px] px-[20px] border-b border-gray-100 bg-white">
              <h3 class="text-base font-bold text-gray-800 mb-0">
                <i class="ki-filled ki-paper-plane text-primary mr-2"></i>
                Pajak Express Submission
              </h3>
            </div>
            <div class="card-body flex flex-col gap-[16px]">
              <p class="text-xs text-gray-500 leading-relaxed">
                Kirim konfirmasi pengkreditan faktur masukan ini langsung ke sistem DJP melalui integrasi Pajak Express.
              </p>
              <button
                type="button"
                class="btn btn-primary w-full"
                :disabled="anyLoading || !canSubmitUpload"
                @click="submitUpload"
              >
                <span v-if="loadingSubmit" class="loading loading-spinner loading-sm mr-2"></span>
                <i v-else class="ki-filled ki-paper-plane mr-2"></i>
                Submit ke Pajak Express
              </button>
              <p class="text-[10px] text-gray-400 leading-relaxed text-center">
                Menandai status faktur masukan ini sebagai CREDITED ke sistem DJP secara langsung.
              </p>
            </div>
          </div>

          <!-- Success Banner -->
          <div
            v-if="successBanner"
            class="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-300"
          >
            <i class="ki-filled ki-check-circle text-emerald-600 text-base shrink-0 mt-0.5"></i>
            <div>
              <span class="font-bold block">Sukses!</span>
              <span>{{ successBanner }}</span>
            </div>
          </div>

          <!-- Debug Response Card -->
          <div class="card h-fit">
            <div class="card-header py-[16px] px-[20px] border-b border-gray-100 bg-white flex items-center justify-between">
              <h3 class="text-sm font-bold text-gray-700 mb-0 flex items-center gap-1.5">
                <i class="ki-filled ki-code text-gray-500 text-base"></i>
                Response Terakhir
              </h3>
              <button type="button" class="btn btn-light btn-xs" :disabled="!lastResponseRaw" @click="copyLast">
                <i class="ki-filled ki-copy text-xs mr-1"></i>
                Salin JSON
              </button>
            </div>
            <div class="card-body p-0">
              <pre class="vat-pj-pre max-h-[340px] overflow-auto rounded-b-xl bg-gray-950/95 p-4 text-[11px] leading-relaxed text-emerald-100">{{ lastResponseRaw || '{ } — jalankan salah satu aksi untuk melihat jawaban API.' }}</pre>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="pt-8 border-t border-gray-100 flex items-center justify-between">
        <router-link class="btn btn-outline btn-primary" :to="{ name: 'vatReconciliation' }">
          <i class="ki-filled ki-arrow-left"></i>
          Batal &amp; Kembali
        </router-link>
        <button
          type="button"
          class="btn btn-primary px-12"
          :disabled="anyLoading || !canSubmitUpload"
          @click="submitUpload"
        >
          <span v-if="loadingSubmit" class="loading loading-spinner loading-sm"></span>
          <i v-else class="ki-filled ki-paper-plane ml-2"></i>
          Submit ke Pajak Express
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import moment from 'moment'
import axios from 'axios'
import { 
  postVatInPrepopulated, 
  postVatInUpload, 
  postVatInVerify015,
  postVatInVerifyCoretax063,
  postVatInVerifyCoretax063Prepop,
  type VatInUploadRequestDto
} from '@/core/utils/vatPxInvoiceApi'

/** Contoh format di `placeholder` saja — input tetap kosong sampai Anda ketik / muat dari browser. */
const SAMPLE_PLACEHOLDER = {
  nomorFaktur: '010.000-10.90000001',
  npwpPembeli: '1091031210969728',
  npwpPenjualDigits: '123456789098765',
  userIdSigner: '3172022407830008',
  kanal: '14',
} as const

/** Kunci localStorage sandbox (PJ); bukan ENV. */
const LS = {
  draft: 'vat_pj_px_form_draft_v1',
  npwpPembeli: 'vat_pj_px_npwp_pembeli',
  userId: 'vat_pj_px_user_id',
  kanal: 'vat_pj_px_kanal',
} as const

const route = useRoute()
const router = useRouter()

const routes = computed<routeTypes[]>(() => [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'VAT Reconciliation', to: '/vat-reconciliation' },
  { name: 'Form PJ', to: '#' },
])

const invoiceId = computed(() => String(route.query.invoiceId || '').trim())
const invoiceNo = computed(() => String(route.query.invoiceNo || ''))
const vendorName = computed(() => String(route.query.vendorName || ''))
const vendorNpwp = computed(() => String(route.query.vendorNpwp || ''))

function numFromQuery(k: string) {
  const v = route.query[k]
  if (v === undefined || v === null || v === '') return 0
  const n = Number(String(v))
  return Number.isFinite(n) ? n : 0
}

const dppNum = computed(() => numFromQuery('dpp'))
const vatNum = computed(() => numFromQuery('vatAmount'))

const bulanOptions = Array.from({ length: 12 }, (_, i) => ({
  idx: String(i),
  v: String(i + 1).padStart(2, '0'),
  label: `${String(i + 1).padStart(2, '0')} — ${moment().month(i).format('MMMM')}`,
}))

const bulanIdx = ref(String(Math.max(0, moment().month())))
const masaPajakMm = ref(moment().format('MM'))
const tahunPajak = ref(moment().format('YYYY'))

function syncMasaFromSelect() {
  const idx = Number(bulanIdx.value)
  const m = idx >= 0 && idx <= 11 ? idx + 1 : 1
  masaPajakMm.value = String(m).padStart(2, '0')
}

watch(bulanIdx, syncMasaFromSelect)

const nomorFp = ref('')
const konfirmasi = ref('CREDITED')
const includeNpwpPenjualPrepop = ref(false)
const npwpPenjual = ref('')
const npwpPembeli = ref('')
const userIdSigner = ref('')
const kanal = ref('')

type SandboxDraftV1 = {
  v: 1
  nomorFp: string
  konfirmasi: string
  includeNpwpPenjualPrepop: boolean
  npwpPenjual: string
  bulanIdx: string
  masaPajakMm: string
  tahunPajak: string
  npwpPembeli: string
  userIdSigner: string
  kanal: string
}

function snapshotSandboxDraft(): SandboxDraftV1 {
  return {
    v: 1,
    nomorFp: nomorFp.value,
    konfirmasi: konfirmasi.value,
    includeNpwpPenjualPrepop: includeNpwpPenjualPrepop.value,
    npwpPenjual: npwpPenjual.value,
    bulanIdx: bulanIdx.value,
    masaPajakMm: masaPajakMm.value,
    tahunPajak: tahunPajak.value,
    npwpPembeli: npwpPembeli.value,
    userIdSigner: userIdSigner.value,
    kanal: kanal.value,
  }
}

function isDraftV1(x: unknown): x is SandboxDraftV1 {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  if (o.v !== 1) return false
  const strings = ['nomorFp', 'konfirmasi', 'npwpPenjual', 'bulanIdx', 'masaPajakMm', 'tahunPajak', 'npwpPembeli', 'userIdSigner', 'kanal'] as const
  if (!strings.every((k) => typeof o[k] === 'string')) return false
  return typeof o.includeNpwpPenjualPrepop === 'boolean'
}

function applySandboxDraft(d: SandboxDraftV1) {
  nomorFp.value = d.nomorFp
  konfirmasi.value = d.konfirmasi
  includeNpwpPenjualPrepop.value = d.includeNpwpPenjualPrepop
  npwpPenjual.value = d.npwpPenjual
  bulanIdx.value = d.bulanIdx
  masaPajakMm.value = d.masaPajakMm
  tahunPajak.value = d.tahunPajak
  npwpPembeli.value = d.npwpPembeli
  userIdSigner.value = d.userIdSigner
  kanal.value = d.kanal
  syncMasaFromSelect()
}

loadSandboxFromStorage()

const loadingSubmit = ref(false)
const loadingPrepop = ref(false)
const loadingVerify = ref(false)
const loadingVerifyCoreTax = ref(false)
const loadingVerifyCoreTaxPrepop = ref(false)
const lastResponseRaw = ref('')
const successBanner = ref('')
const anyLoading = computed(() => 
  loadingSubmit.value || 
  loadingPrepop.value || 
  loadingVerify.value || 
  loadingVerifyCoreTax.value || 
  loadingVerifyCoreTaxPrepop.value
)

const canVerifyCoreTax = computed(() => {
  const fp = nomorFp.value.trim()
  const seller = sanitizeNpwp(npwpPenjual.value)
  const buyer = sanitizeNpwp(npwpPembeli.value)
  return fp.length >= 8 && seller.length >= 10 && buyer.length >= 10
})

watch(
  () => route.query.defMasa,
  () => {
    const dm = String(route.query.defMasa || '').trim()
    const dy = String(route.query.defYear || '').replace(/\D/g, '')
    if (dm.length >= 1) {
      const padded = dm.slice(0, 2).padStart(2, '0')
      masaPajakMm.value = padded
      const m = Number(padded) - 1
      if (m >= 0 && m <= 11) bulanIdx.value = String(m)
    }
    if (dy.length === 4) tahunPajak.value = dy
  },
  { immediate: true },
)

watch(
  vendorNpwp,
  (nw) => {
    if (!includeNpwpPenjualPrepop.value || !nw) return
    npwpPenjual.value = sanitizeNpwp(nw) ? formatNpwpDisplay(nw) : nw.trim()
  },
  { immediate: true },
)

watch(includeNpwpPenjualPrepop, (on) => {
  if (on && !npwpPenjual.value.trim() && vendorNpwp.value)
    npwpPenjual.value = formatNpwpDisplay(vendorNpwp.value)
})

function sanitizeNpwp(s: string): string {
  const d = s.replace(/\D/g, '')
  return d.slice(0, 16)
}

function formatNpwpDisplay(s: string): string {
  const d = sanitizeNpwp(s)
  if (!d) return ''
  if (d.length <= 15) return d.match(/.{1,4}/g)?.join('.') ?? d
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}.${d.slice(8, 9)}.${d.slice(9, 12)}.${d.slice(12)}`
}

/** Teks helper di atribut HTML `placeholder` saja (bukan nilai input). */
const phNomorFp = computed(() => SAMPLE_PLACEHOLDER.nomorFaktur)
const phNpwpPembeli = computed(() => SAMPLE_PLACEHOLDER.npwpPembeli)
const phUserId = computed(() => SAMPLE_PLACEHOLDER.userIdSigner)
const phKanal = computed(() => SAMPLE_PLACEHOLDER.kanal)
const phTahun = computed(() => moment().format('YYYY'))
const phMasa = computed(() => moment().format('MM'))
const phNpwpPenjual = computed(() => formatNpwpDisplay(SAMPLE_PLACEHOLDER.npwpPenjualDigits))

function fmt(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(amount)
}

function sanitizedMasaTahun() {
  const masa = masaPajakMm.value.replace(/\D/g, '').slice(0, 2).padStart(2, '0')
  const th = tahunPajak.value.replace(/\D/g, '').slice(0, 4).trim()
  return { masa, tahun: th }
}

const canPingPj = computed(() => {
  const { masa, tahun } = sanitizedMasaTahun()
  const fp = nomorFp.value.trim()
  const mOk = masa.length === 2 && Number(masa) >= 1 && Number(masa) <= 12
  return fp.length >= 8 && mOk && tahun.length === 4
})

const canSubmitUpload = computed(() => canPingPj.value)

function optionalPjRoot() {
  const o: { npwpPembeli?: string; userId?: string; kanal?: string } = {}
  const n = sanitizeNpwp(npwpPembeli.value)
  if (n) o.npwpPembeli = n
  if (userIdSigner.value.trim()) o.userId = userIdSigner.value.trim()
  if (kanal.value.trim()) o.kanal = kanal.value.trim()
  return o
}

function buildPrepopMasukan(preopNomor: string, extraNpwp?: string) {
  const { masa, tahun } = sanitizedMasaTahun()
  const body: Record<string, unknown> = {
    fgPermintaan: 1,
    requestFakturMasukan: {
      prepopTahunPajak: tahun,
      prepopMasaPajak: masa,
      prepopNomorFaktur: preopNomor.trim(),
    },
    ...optionalPjRoot(),
  }
  const masukan = body.requestFakturMasukan as Record<string, unknown>
  if (extraNpwp && sanitizeNpwp(extraNpwp)) {
    masukan.prepopNpwpPenjual = sanitizeNpwp(extraNpwp)
  }
  return body
}

function buildVerifyBody(nomor: string) {
  const { masa, tahun } = sanitizedMasaTahun()
  const body: Record<string, unknown> = {
    fgPermintaan: 1,
    requestFakturMasukan: {
      prepopTahunPajak: tahun,
      prepopMasaPajak: masa,
      prepopNomorFaktur: nomor.trim(),
    },
    ...optionalPjRoot(),
  }
  const masukan = body.requestFakturMasukan as Record<string, unknown>
  if (includeNpwpPenjualPrepop.value && sanitizeNpwp(npwpPenjual.value)) {
    masukan.prepopNpwpPenjual = sanitizeNpwp(npwpPenjual.value)
  }
  return body
}

function setLastResponse(payload: unknown) {
  successBanner.value = ''
  try {
    lastResponseRaw.value = JSON.stringify(payload, null, 2)
  } catch {
    lastResponseRaw.value = String(payload)
  }
}

function axMsg(e: unknown): string {
  if (!axios.isAxiosError(e)) return e instanceof Error ? e.message : String(e)
  const d = e.response?.data as Record<string, unknown> | undefined
  const mess = typeof d?.message === 'string' ? d.message : undefined
  if (mess?.trim()) return mess
  const res = e.response?.data
  if (typeof res === 'object' && res !== null) {
    const rstr = JSON.stringify(res, null, 2)
    if (rstr.length < 2800) return rstr
  }
  return e.message || 'Terjadi kesalahan pada server.'
}

async function runPrepopulated() {
  const fp = nomorFp.value.trim()
  const { masa, tahun } = sanitizedMasaTahun()
  if (!validateCore(fp, masa, tahun)) return
  loadingPrepop.value = true
  try {
    const npSeller = includeNpwpPenjualPrepop.value ? sanitizeNpwp(npwpPenjual.value) || undefined : undefined
    const body = buildPrepopMasukan(fp, npSeller)
    const res = await postVatInPrepopulated(body)
    setLastResponse(res.data)
    successBanner.value = 'Prepopulated OK — bandingkan isi dengan data di portal Pajak Express sandbox.'
  } catch (e) {
    setLastResponse({ error: axMsg(e) })
    alert(axMsg(e))
  } finally {
    loadingPrepop.value = false
  }
}

async function runVerify015() {
  const fp = nomorFp.value.trim()
  const { masa, tahun } = sanitizedMasaTahun()
  if (!validateCore(fp, masa, tahun)) return
  loadingVerify.value = true
  try {
    const body = buildVerifyBody(fp)
    const res = await postVatInVerify015(body)
    setLastResponse(res.data)
    successBanner.value = 'Verify 015 OK — cocokkan status di aplikasi pajak reseller/sandbox Anda.'
  } catch (e) {
    setLastResponse({ error: axMsg(e) })
    alert(axMsg(e))
  } finally {
    loadingVerify.value = false
  }
}

async function runVerifyCoreTax() {
  const fp = nomorFp.value.trim()
  const seller = sanitizeNpwp(npwpPenjual.value)
  const buyer = sanitizeNpwp(npwpPembeli.value)
  
  if (!fp) {
    alert('Nomor Faktur Pajak wajib diisi.')
    return
  }
  if (!seller) {
    alert('NPWP Penjual wajib diisi.')
    return
  }
  if (!buyer) {
    alert('NPWP Pembeli wajib diisi.')
    return
  }
  
  loadingVerifyCoreTax.value = true
  try {
    const body: Record<string, unknown> = {
      nomorFaktur: fp,
      npwpPenjual: seller,
      npwpPembeli: buyer,
    }
    if (userIdSigner.value.trim()) body.userId = userIdSigner.value.trim()
    if (kanal.value.trim()) body.idKanal = kanal.value.trim()
    
    const res = await postVatInVerifyCoretax063(body)
    setLastResponse(res.data)
    successBanner.value = 'CoreTax 063 Verify OK — bandingkan status dengan data di portal Pajak Express sandbox.'
  } catch (e) {
    setLastResponse({ error: axMsg(e) })
    alert(axMsg(e))
  } finally {
    loadingVerifyCoreTax.value = false
  }
}

async function runVerifyCoreTaxPrepop() {
  const fp = nomorFp.value.trim()
  const seller = sanitizeNpwp(npwpPenjual.value)
  const buyer = sanitizeNpwp(npwpPembeli.value)
  
  if (!fp) {
    alert('Nomor Faktur Pajak wajib diisi.')
    return
  }
  if (!seller) {
    alert('NPWP Penjual wajib diisi.')
    return
  }
  if (!buyer) {
    alert('NPWP Pembeli wajib diisi.')
    return
  }
  
  loadingVerifyCoreTaxPrepop.value = true
  try {
    const body: Record<string, unknown> = {
      nomorFaktur: fp,
      npwpPenjual: seller,
      npwpPembeli: buyer,
    }
    if (userIdSigner.value.trim()) body.userId = userIdSigner.value.trim()
    if (kanal.value.trim()) body.idKanal = kanal.value.trim()
    
    const res = await postVatInVerifyCoretax063Prepop(body)
    setLastResponse(res.data)
    successBanner.value = 'CoreTax Prepop 063 Verify OK — bandingkan status dengan data di portal Pajak Express sandbox.'
  } catch (e) {
    setLastResponse({ error: axMsg(e) })
    alert(axMsg(e))
  } finally {
    loadingVerifyCoreTaxPrepop.value = false
  }
}

function validateCore(fp: string, masa: string, tahun: string): boolean {
  if (fp.trim() === '') {
    alert('Nomor Faktur Pajak wajib diisi.')
    return false
  }
  if (masa.length !== 2 || Number(masa) < 1 || Number(masa) > 12) {
    alert('Masa pajak harus dua digit 01–12.')
    return false
  }
  if (tahun.length !== 4) {
    alert('Tahun pajak harus empat digit.')
    return false
  }
  return true
}

async function submitUpload() {
  const fp = nomorFp.value.trim()
  const { masa, tahun } = sanitizedMasaTahun()
  if (!validateCore(fp, masa, tahun)) return
  loadingSubmit.value = true
  try {
    const root = optionalPjRoot()

    // Build the core Pajak Express payload
    const pjPayload: VatInUploadRequestDto = {
      fgPermintaan: 2,
      ...root,
      konfirmasiFakturMasukan: {
        konfirmasiPengkreditan: konfirmasi.value,
        nomorFaktur: fp,
        masaPajak: masa,
        tahunPajak: tahun,
      },
    }

    // Wrap with metadata so backend persists it to Tax_VatTransaction DB
    // (same pattern as BPU/WHT — submitted invoices appear in reconciliation list)
    const res = await postVatInUpload({
      payload: pjPayload,
      invoiceId: invoiceId.value ? Number(invoiceId.value) : 0,
      npwpPenjual: includeNpwpPenjualPrepop.value ? sanitizeNpwp(npwpPenjual.value) || undefined : undefined,
      namaVendor: vendorName.value || undefined,
      tanggalFaktur: new Date().toISOString().split('T')[0], // today as ISO date
      dpp: dppNum.value > 0 ? dppNum.value : undefined,
      ppn: vatNum.value > 0 ? vatNum.value : undefined,
    })

    setLastResponse(res.data)
    successBanner.value = 'Konfirmasi pengkreditan terkirim & disimpan. Data akan muncul di tab Faktur Pajak Express!'
    setTimeout(() => {
      if (confirm('Kembali ke halaman Rekonsiliasi VAT?')) {
        router.push({ name: 'vatReconciliation' })
      }
    }, 250)
  } catch (e) {
    setLastResponse({ error: axMsg(e) })
    alert(axMsg(e))
  } finally {
    loadingSubmit.value = false
  }
}

async function copyLast() {
  if (!lastResponseRaw.value) return
  try {
    await navigator.clipboard.writeText(lastResponseRaw.value)
    successBanner.value = 'JSON berhasil disalin ke clipboard.'
  } catch {
    alert('Clipboard tidak diizinkan; salin manual dari kotak Response.')
  }
}

function saveSandboxToStorage() {
  try {
    const d = snapshotSandboxDraft()
    localStorage.setItem(LS.draft, JSON.stringify(d))
    /** Kompatibilitas lama — kunci pisah NPWP/User/Kanal */
    localStorage.setItem(LS.npwpPembeli, d.npwpPembeli)
    localStorage.setItem(LS.userId, d.userIdSigner)
    localStorage.setItem(LS.kanal, d.kanal)
    successBanner.value = 'Draft form (nomor FP, periode & konteks PJ) disimpan untuk browser ini.'
  } catch {
    alert('Gagal simpan — localStorage mungkin penuh / diblok.')
  }
}

function loadSandboxFromStorage() {
  try {
    const rawDraft = localStorage.getItem(LS.draft)
    if (rawDraft) {
      const parsed: unknown = JSON.parse(rawDraft)
      if (isDraftV1(parsed)) {
        applySandboxDraft(parsed)
        return
      }
    }
    const a = localStorage.getItem(LS.npwpPembeli)
    const b = localStorage.getItem(LS.userId)
    const c = localStorage.getItem(LS.kanal)
    if (a) npwpPembeli.value = a
    if (b) userIdSigner.value = b
    if (c) kanal.value = c
  } catch {
    /* noop */
  }
}

function autoFillSandboxData() {
  nomorFp.value = SAMPLE_PLACEHOLDER.nomorFaktur
  npwpPembeli.value = formatNpwpDisplay(SAMPLE_PLACEHOLDER.npwpPembeli)
  includeNpwpPenjualPrepop.value = true
  npwpPenjual.value = formatNpwpDisplay(SAMPLE_PLACEHOLDER.npwpPenjualDigits)
  userIdSigner.value = SAMPLE_PLACEHOLDER.userIdSigner
  kanal.value = SAMPLE_PLACEHOLDER.kanal
  successBanner.value = 'Data contoh sandbox berhasil diisi otomatis! Silakan langsung klik tombol pengujian.'
}

function applyRealSandboxInvoice(fpNumber: string) {
  nomorFp.value = fpNumber
  bulanIdx.value = '2' // Maret (Index 2)
  masaPajakMm.value = '03'
  tahunPajak.value = '2026'
  konfirmasi.value = 'CREDITED'
  includeNpwpPenjualPrepop.value = true
  
  // Set NPWP Pembeli & Penjual
  const currentPembeli = sanitizeNpwp(npwpPembeli.value) || SAMPLE_PLACEHOLDER.npwpPembeli
  npwpPembeli.value = formatNpwpDisplay(currentPembeli)
  npwpPenjual.value = formatNpwpDisplay(currentPembeli) // In sandbox PJAP, seller matches buyer NPWP scope
  
  userIdSigner.value = SAMPLE_PLACEHOLDER.userIdSigner
  kanal.value = SAMPLE_PLACEHOLDER.kanal
  
  successBanner.value = `Faktur ${fpNumber} (Masa 03 Tahun 2026) berhasil dimuat! Siap di-submit ke Pajak Express.`
}

function applyTodaySandboxTest() {
  const randFP = `010.000-26.${Math.floor(10000000 + Math.random() * 90000000)}`
  nomorFp.value = randFP
  
  const today = moment()
  const m = today.month()
  bulanIdx.value = String(m)
  masaPajakMm.value = today.format('MM')
  tahunPajak.value = today.format('YYYY')
  
  konfirmasi.value = 'CREDITED'
  includeNpwpPenjualPrepop.value = true
  
  const currentPembeli = sanitizeNpwp(npwpPembeli.value) || SAMPLE_PLACEHOLDER.npwpPembeli
  npwpPembeli.value = formatNpwpDisplay(currentPembeli)
  npwpPenjual.value = formatNpwpDisplay(currentPembeli)
  
  userIdSigner.value = SAMPLE_PLACEHOLDER.userIdSigner
  kanal.value = SAMPLE_PLACEHOLDER.kanal
  
  successBanner.value = `Faktur Simulasi ${randFP} untuk hari ini (${today.format('MMMM YYYY')}) berhasil dimuat! Siap di-submit ke Pajak Express.`
}

function clearSandboxStorage() {
  try {
    localStorage.removeItem(LS.draft)
    localStorage.removeItem(LS.npwpPembeli)
    localStorage.removeItem(LS.userId)
    localStorage.removeItem(LS.kanal)
    nomorFp.value = ''
    konfirmasi.value = 'CREDITED'
    includeNpwpPenjualPrepop.value = false
    npwpPenjual.value = ''
    bulanIdx.value = String(Math.max(0, moment().month()))
    tahunPajak.value = moment().format('YYYY')
    masaPajakMm.value = moment().format('MM')
    syncMasaFromSelect()
    npwpPembeli.value = ''
    userIdSigner.value = ''
    kanal.value = ''
    successBanner.value = 'Draft penyimpanan browser dibersihkan.'
  } catch {
    /* noop */
  }
}

onMounted(() => {
  autoFillSandboxData()
})
</script>

<style scoped lang="scss">
.badge-light-primary {
  background-color: #f1faff;
  color: #009ef7;
}
.badge-light-warning {
  background-color: #fff8dd;
  color: #ffc700;
}

.vat-pj-pre {
  font-variant-numeric: tabular-nums;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
