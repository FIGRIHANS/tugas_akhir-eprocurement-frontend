<template>
  <div class="vat-pj-page pb-[80px]">
    <Breadcrumb title="VAT — Pajak Express" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="max-w-6xl mx-auto px-2 sm:px-0">
      <header class="mb-6">
        <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl flex items-center gap-2">
          <i class="ki-filled ki-calculator text-primary text-2xl"></i>
          VAT Reconciliation — Pajak Express
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Kirim data faktur masukan (VAT In) dan konfirmasi status pengkreditan ke DJP via Pajak Express sandbox.
        </p>
      </header>

      <div class="flex flex-col lg:flex-row gap-6 items-start">
        
        <!-- COLUMN LEFT: Form Data -->
        <div class="flex-1 space-y-6 w-full">
          
          <!-- Section A: Linked Invoice Info -->
          <div v-if="invoiceId" class="card p-[20px] bg-gradient-to-br from-teal-50/70 via-white to-white border border-teal-100 shadow-sm rounded-xl">
            <span class="font-semibold text-xs uppercase tracking-wider text-teal-800 mb-4 block">Linked Invoice Details</span>
            <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span class="text-gray-400 block text-xs">No. Invoice</span>
                <span class="font-semibold text-gray-900">{{ invoiceNo || '—' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs">Vendor Name</span>
                <span class="font-semibold text-gray-900">{{ vendorName || '—' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs">NPWP Penjual (Invoice)</span>
                <span class="font-mono text-gray-700">{{ vendorNpwp || '—' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-xs">DPP (Tax Base)</span>
                <span class="font-semibold text-gray-900">{{ fmt(dppNum) }}</span>
              </div>
              <div class="col-span-2 border-t border-teal-50 pt-3 flex justify-between items-center">
                <span class="font-medium text-teal-800 text-xs">VAT / PPN (Invoice)</span>
                <span class="font-bold text-teal-700 text-base">{{ fmt(vatNum) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="card p-[20px] bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-900">
            <i class="ki-filled ki-information-2 text-amber-600 mr-1.5 text-base align-middle"></i>
            <strong>Manual Mode:</strong> No invoice linked. Please fill in the details below manually.
          </div>

          <!-- Section 1: Faktur & Pengkreditan -->
          <div class="card p-[20px] bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div class="flex items-center gap-2 border-b border-gray-100 pb-3">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">1</span>
              <h2 class="text-sm font-bold uppercase tracking-wide text-gray-700">Faktur &amp; Pengkreditan</h2>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="label py-1"><span class="label-text font-semibold text-gray-600">Nomor Faktur Pajak</span></label>
                <input
                  v-model.trim="nomorFp"
                  type="text"
                  class="input input-bordered input-md w-full font-mono text-gray-800"
                  :placeholder="phNomorFp"
                  autocomplete="off"
                />
                <p class="mt-1 text-xs text-gray-400">Pastikan cocok dengan faktur di lingkungan sandbox Pajak Express.</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label py-1"><span class="label-text font-semibold text-gray-600">Masa Pajak</span></label>
                  <div class="flex gap-2">
                    <select v-model="bulanIdx" class="select select-bordered w-full" @change="syncMasaFromSelect">
                      <option v-for="b in bulanOptions" :key="b.v" :value="b.idx">{{ b.label }}</option>
                    </select>
                    <input
                      v-model.trim="masaPajakMm"
                      type="text"
                      maxlength="2"
                      class="input input-bordered w-16 shrink-0 font-mono text-center"
                      :placeholder="phMasa"
                    />
                  </div>
                </div>
                <div>
                  <label class="label py-1"><span class="label-text font-semibold text-gray-600">Tahun Pajak</span></label>
                  <input
                    v-model.trim="tahunPajak"
                    type="text"
                    maxlength="4"
                    class="input input-bordered w-full font-mono text-center"
                    :placeholder="phTahun"
                  />
                </div>
              </div>

              <div>
                <label class="label py-1"><span class="label-text font-semibold text-gray-600">Konfirmasi Pengkreditan</span></label>
                <select v-model="konfirmasi" class="select select-bordered w-full">
                  <option value="CREDITED">CREDITED — Kredit masuk pajak pembeli</option>
                  <option value="UNCREDITED">UNCREDITED — Belum / tidak dikreditkan</option>
                  <option value="INVALID">INVALID — Faktur tidak berlaku / ditolak</option>
                </select>
              </div>

              <div class="bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input v-model="includeNpwpPenjualPrepop" type="checkbox" class="checkbox checkbox-sm checkbox-primary" />
                  <span class="text-sm font-medium text-gray-700">Sertakan NPWP Penjual (default dari vendor invoice)</span>
                </label>
                <div v-if="includeNpwpPenjualPrepop" class="mt-3 animate-in fade-in duration-200">
                  <label class="label py-0.5"><span class="label-text text-xs text-gray-500">NPWP Penjual</span></label>
                  <input
                    v-model.trim="npwpPenjual"
                    type="text"
                    class="input input-bordered w-full font-mono text-sm"
                    :placeholder="phNpwpPenjual"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 1B: Real Sandbox Invoice Shortcuts -->
          <div class="card p-[20px] bg-gradient-to-br from-indigo-50/50 via-white to-white border border-indigo-100 rounded-xl shadow-sm space-y-3">
            <div class="flex items-center gap-2 border-b border-indigo-50 pb-2">
              <i class="ki-filled ki-flash text-indigo-600 text-base"></i>
              <h2 class="text-xs font-bold uppercase tracking-wider text-indigo-900">Pintasan Faktur Sandbox Asli</h2>
            </div>
            <p class="text-xs text-indigo-950/70 leading-relaxed">
              Klik salah satu nomor faktur di bawah ini (dari dashboard sandbox Anda) untuk mengisi form secara otomatis dengan data faktur asli yang aktif &amp; belum dikreditkan:
            </p>
            <div class="flex flex-wrap gap-2 pt-1">
              <button 
                v-for="realFp in ['04002600000070403', '04002600000070397', '04002600000070396', '04002600000070395', '04002600000070402', '04002600000070420', '04002600000070401', '04002600000066118', '04002600000070400']" 
                :key="realFp"
                type="button"
                class="btn btn-outline btn-primary btn-xs font-mono"
                @click="applyRealSandboxInvoice(realFp)"
              >
                {{ realFp }}
              </button>
              
              <button
                type="button"
                class="btn btn-success btn-xs font-bold text-white"
                @click="applyTodaySandboxTest"
              >
                ⚡ Auto-Fill Hari Ini (Simulasi)
              </button>
            </div>
            <p class="text-[10px] text-gray-500 leading-relaxed">
              * Pintasan ini akan mengatur Nomor Faktur = <code class="font-mono bg-gray-100 px-1 py-0.5 rounded">[Nomor]</code>, Masa = <code class="font-mono bg-gray-100 px-1 py-0.5 rounded">03</code>, Tahun = <code class="font-mono bg-gray-100 px-1 py-0.5 rounded">2026</code>, dan NPWP Penjual = <code class="font-mono bg-gray-100 px-1 py-0.5 rounded">{{ npwpPembeli || '1091031210969728' }}</code>.
            </p>
          </div>

          <!-- Section 2: Sandbox Context Override -->
          <div class="card p-[20px] bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div class="flex items-center gap-2 border-b border-gray-100 pb-3">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-white">2</span>
              <h2 class="text-sm font-bold uppercase tracking-wide text-gray-700">Sandbox Context Override</h2>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="label py-1"><span class="label-text font-semibold text-gray-600">NPWP Pembeli</span></label>
                <input
                  v-model.trim="npwpPembeli"
                  type="text"
                  class="input input-bordered w-full font-mono text-sm"
                  :placeholder="phNpwpPembeli"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label py-1"><span class="label-text font-semibold text-gray-600">User ID / Signer</span></label>
                  <input v-model.trim="userIdSigner" type="text" class="input input-bordered w-full font-mono text-sm" :placeholder="phUserId" />
                </div>
                <div>
                  <label class="label py-1"><span class="label-text font-semibold text-gray-600">Kanal</span></label>
                  <input v-model.trim="kanal" type="text" class="input input-bordered w-full font-mono text-sm" :placeholder="phKanal" />
                </div>
              </div>

              <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <button type="button" class="btn btn-ghost btn-xs text-gray-500" @click="saveSandboxToStorage">Simpan Draft</button>
                <button type="button" class="btn btn-ghost btn-xs text-gray-500" @click="loadSandboxFromStorage">Muat Draft</button>
                <button type="button" class="btn btn-ghost btn-xs text-warning" @click="clearSandboxStorage">Reset Draft</button>
                <button type="button" class="btn btn-secondary btn-xs ml-auto animate-pulse" @click="autoFillSandboxData">
                  <i class="ki-filled ki-flash text-xs mr-1"></i>
                  Auto-Fill Sandbox Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN RIGHT: Actions & Results -->
        <div class="w-full lg:max-w-sm space-y-6 sticky top-6">
          
          <!-- Card: Main Submit Action -->
          <div class="card p-[20px] bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <span class="font-bold text-xs uppercase tracking-wider text-slate-700 block border-b border-gray-100 pb-2">
              📤 Pajak Express Submission
            </span>
            
            <p class="text-xs text-gray-500 leading-relaxed">
              Kirim konfirmasi pengkreditan faktur masukan ini langsung ke sistem DJP melalui integrasi Pajak Express.
            </p>

            <button 
              type="button" 
              class="btn btn-primary btn-md w-full text-white" 
              :disabled="anyLoading || !canSubmitUpload" 
              @click="submitUpload"
            >
              <span v-if="loadingSubmit" class="loading loading-spinner loading-sm mr-2" />
              <i v-else class="ki-filled ki-paper-plane mr-2" />
              Submit ke Pajak Express
            </button>
            
            <p class="text-[10px] text-gray-400 leading-relaxed text-center">
              Menandai status faktur masukan ini sebagai CREDITED ke sistem DJP secara langsung.
            </p>

            <router-link class="btn btn-ghost btn-sm w-full text-gray-500" :to="{ name: 'vatReconciliation' }">
              Batal &amp; Kembali
            </router-link>
          </div>

          <!-- Toast Banner -->
          <div v-if="successBanner" class="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-300">
            <i class="ki-filled ki-check-circle text-emerald-600 text-base shrink-0 mt-0.5"></i>
            <div>
              <span class="font-bold block">Sukses!</span>
              <span>{{ successBanner }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Debug Response (Bottom) -->
      <section class="card p-[20px] bg-white border border-gray-200 rounded-xl shadow-sm mt-8 space-y-3">
        <div class="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <div class="flex items-center gap-1.5">
            <i class="ki-filled ki-code text-gray-600 text-base"></i>
            <h2 class="text-sm font-bold text-gray-700">Response Terakhir (Debug Sandbox)</h2>
          </div>
          <button 
            type="button" 
            class="btn btn-light btn-xs" 
            :disabled="!lastResponseRaw" 
            @click="copyLast"
          >
            <i class="ki-filled ki-copy text-xs mr-1"></i>
            Salin JSON
          </button>
        </div>
        <pre class="vat-pj-pre max-h-[420px] overflow-auto rounded-lg bg-gray-950/95 p-4 text-[11px] leading-relaxed text-emerald-100">{{
          lastResponseRaw || '{ } — jalankan salah satu aksi di samping untuk melihat jawaban API invoice backend.'
        }}</pre>
      </section>

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
.vat-pj-pre {
  font-variant-numeric: tabular-nums;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
